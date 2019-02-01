var web3lib = require('web3');
const SEOwnedUpgradabilityProxy = artifacts.require("SEOwnedUpgradabilityProxy");
const SupportEth = artifacts.require("Supporteth_V0");
const SomeStableToken = artifacts.require("SomeStableToken");
const Publisher = artifacts.require("Publisher");
const PublisherSubscription = artifacts.require("PublisherSubscription");

contract("Supporteth_V0", accounts => {

    let web3_ = new web3lib(web3.currentProvider)

    const publisher = accounts[2]
    const subscriber = accounts[3]
    const relayer = accounts[5]

    let subscriptionHash;
    let signature;

    it("should obtain a Supporteth_V0 as current implementation", async () => {
        const proxyInst = await SEOwnedUpgradabilityProxy.deployed()
        const implAddr = await proxyInst.implementation()
        const seAddr = SupportEth.address
        assert.equal(implAddr, seAddr, "There should be a V0 implementation of SupportEth")
    })

    it("should allow the registration of a new Publisher", async () => {
        const inst = await SupportEth.deployed()
        const pubContract = await Publisher.new(
            relayer, SomeStableToken.address,
            {from: publisher})

        await inst.addPublisher(pubContract.address, {from: publisher})

        assert.equal(await inst.publishers.call(publisher), pubContract.address,
            "new Publisher contract is not registered on SupportEth")

        assert.equal(await pubContract.owner.call(), publisher,
            "new Publisher contract is not owned by the publisher address")
    })

    it("should allow the registration of a new Subscriber", async () => {
        const inst = await SupportEth.deployed()
        const pubAddress = await inst.publishers.call(publisher)
        const pubContract = await Publisher.at(pubAddress)
        const tokenAddr = await pubContract.tokenAddress.call()
        const subContract = await PublisherSubscription.new(
            pubAddress,
            tokenAddr,
            5, // Subscription amount
            1, // Subscription period (execute payment every second)
            {from: subscriber})

        await inst.addSubscriber(subContract.address, {from: subscriber})

        assert.equal(await inst.subscribers.call(subscriber), subContract.address,
            "new PublisherSubscription contract is not registered on SupportEth")

        assert.equal(await subContract.subscriber.call(), subscriber,
            "new PublisherSubscription contracts is not owned by the subscriber address")
    })

    it("should verify that subscription does not have token enough allowance",
        async () => {
            const inst = await SupportEth.deployed()
            const subAddress = await inst.subscribers.call(subscriber)

            const token = await SomeStableToken.deployed()
            let allowance = await token.allowance.call(subscriber, subAddress)

            assert.equal(allowance, 0,
                "Subscription contract should not have allowance to spend tokens")

            // const valueToApprove = 100*10**18
            const valueToApprove = 100
            await token.approve(subAddress, valueToApprove, {from: subscriber})

            allowance = await token.allowance.call(subscriber, subAddress)

            assert.equal(allowance, valueToApprove,
                "Subscription contract should have allowance to spend tokens")
    })

    it("should verify that subscription hash and signature match", async () => {
        const inst = await SupportEth.deployed()
        const subAddress = await inst.subscribers.call(subscriber)
        const subscription = await PublisherSubscription.at(subAddress)

        const settings = await subscription.settings.call()

        const subscriptionParams = [
            subscriber,
            settings.publisher,
            settings.tokenAddress,
            // web3.utils.toTwosComplement(settings.tokenAmount*10**18),
            // web3.utils.toTwosComplement(settings.tokenAmount),
            settings.tokenAmount,
            // web3.utils.toTwosComplement(settings.subscriptionPeriod)
            settings.subscriptionPeriod
        ]

        subscriptionHash = await subscription
            .getSubscriptionHash.call(...subscriptionParams)

        signature = await web3_.eth.sign(subscriptionHash, subscriber)

        const signer = await subscription.getSubscriptionSigner
            .call(subscriptionHash, signature)

        const lll_signer = await subscription._getSigner
            .call(subscriptionHash, signature)

        assert.equal(signer, lll_signer,
            "getSubscriptionSigner implementation failed")

        assert.equal(signer, subscriber,
            "Signature and subscripton hash does not match")
    })

    it("should verify as a relayer that subscription is ready to be processed",
        async () => {

            const inst = await SupportEth.deployed()
            const subAddress = await inst.subscribers.call(subscriber)
            const subscription = await PublisherSubscription.at(subAddress)

            const settings = await subscription.settings.call()

            let params = [
                subscriber,
                settings.publisher,
                settings.tokenAddress,
                // web3.utils.toTwosComplement(settings.tokenAmount*10**18),
                // web3.utils.toTwosComplement(settings.tokenAmount),
                settings.tokenAmount,
                // web3.utils.toTwosComplement(settings.subscriptionPeriod),
                settings.subscriptionPeriod,
                signature
            ]
            let isReady = false
            for(let i=0; i<10; i++) {
                isReady = await subscription.isSubscriptionReady.call(...params)
                console.log(`Is Subscription ready? : ${isReady}`)
                if(isReady) break
            }

            assert.isTrue(isReady, "Subscription was never ready")

    })

    it("should allow the relayer to execute the subscription transaction", async () => {
        const token = await SomeStableToken.deployed()
        const inst = await SupportEth.deployed()
        const subAddress = await inst.subscribers.call(subscriber)
        const subscription = await PublisherSubscription.at(subAddress)

        const settings = await subscription.settings.call()

        let params = [
            subscriber,
            settings.publisher,
            settings.tokenAddress,
            // web3.utils.toTwosComplement(settings.tokenAmount*10**18),
            // web3.utils.toTwosComplement(settings.tokenAmount),
            settings.tokenAmount,
            // web3.utils.toTwosComplement(settings.subscriptionPeriod),
            settings.subscriptionPeriod,
            signature
        ]

        const receipt = await subscription.executeSubscription(...params, {from: relayer})

        console.log(receipt)

        const subscriberBalance = await token.balanceOf.call(subscriber)
        const subscriptionAllowance = await token.allowance.call(subscriber, subAddress)
        const pubBalance = await token.balanceOf.call(settings.publisher)

        /// Taking into account that accounts get 100 SST tokens during migration scripts
        assert.equal(subscriberBalance, 95, "Subscriber current balance is incorrect")
        assert.equal(subscriptionAllowance, 95, "Subscription current allowance is incorrect")
        assert.equal(pubBalance, 5, "Publisher current balance is incorrect")
    })

})
