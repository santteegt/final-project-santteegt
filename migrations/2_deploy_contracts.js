// var SimpleStorage = artifacts.require("./SimpleStorage.sol");
const abi = require('ethereumjs-abi')
var SEOwnedUpgradabilityProxy = artifacts.require("./SEOwnedUpgradabilityProxy.sol");
// var Address = artifacts.require("openzeppelin-solidity/contracts/utils/Address.sol");
var Address = artifacts.require("./Address.sol");
// var SafeMath = artifacts.require("openzeppelin-solidity/contracts/math/SafeMath.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
// var ECDSA = artifacts.require("openzeppelin-solidity/contracts/cryptography/ECDSA.sol");
var ECDSA = artifacts.require("./ECDSA.sol");
var PublisherSubscription = artifacts.require("./PublisherSubscription.sol");
var DLL = artifacts.require("./DLL.sol");
var Publisher = artifacts.require("./Publisher.sol");
var Supporteth_V0 = artifacts.require("./Supporteth_V0.sol");
var SupportethToken = artifacts.require("./SupportethToken.sol");
var SomeStableToken = artifacts.require("./SomeStableToken.sol");


function encodeCall(name, arguments, values) {
    const methodId = abi.methodID(name, arguments).toString('hex');
    const params = abi.rawEncode(arguments, values).toString('hex');
    return '0x' + methodId + params;
}

module.exports = function(deployer, network, accounts) {
    // deployer.deploy(SimpleStorage);

    // console.log(network)
    // process.exit(0)
    if(network == 'development') {
        // deployer.deploy(SEProxy);
        // deployer.link(SEProxy, SEUpgradabilityProxy);
        // deployer.deploy(SEUpgradabilityProxy);
        // deployer.link(SEUpgradabilityProxy, SEOwnedUpgradabilityProxy);
        // deployer.deploy(SEOwnedUpgradabilityProxy, {from: accounts[1]});
        deployer.deploy(SEOwnedUpgradabilityProxy, {from: accounts[1]});
        deployer.deploy(Address);
        deployer.link(Address, [Supporteth_V0, PublisherSubscription, Publisher]);
        deployer.deploy(SafeMath);
        deployer.link(SafeMath, [PublisherSubscription, Publisher]);
        deployer.deploy(ECDSA);
        deployer.link(ECDSA, PublisherSubscription);
        deployer.deploy(DLL);
        deployer.link(DLL, Publisher);
        deployer.deploy(Supporteth_V0, {from: accounts[1]}).then(() => {
            return SEOwnedUpgradabilityProxy.deployed();
        }).then((proxyInstance) => {
            // const initializeData = encodeCall('initialize', ['address'], [accounts[3]]);
            // console.log(`BYTES ${initializeData}`)
            // proxyInstance.upgradeToAndCall(Supporteth_V0.address, initializeData)
            proxyInstance.proxyOwner().then((rs) => console.log(`OWNER ADDR ${rs}`))
            console.log(`CONTRACT ADDR ${Supporteth_V0.address}`);
            return proxyInstance.upgradeTo(Supporteth_V0.address, {from: accounts[1]});
        })

        deployer.deploy(SupportethToken).then(() => {
            return deployer.deploy(
                Publisher,
                accounts[2], SupportethToken.address,
                { overwrite: false, from: accounts[2] }
            )
        })
        deployer.deploy(SomeStableToken);

    } else if(network.endsWith('fork')) {
        deployer.deploy(SEOwnedUpgradabilityProxy);
        deployer.deploy(Address);
        deployer.link(Address, [Supporteth_V0, PublisherSubscription, Publisher]);
        deployer.deploy(SafeMath);
        deployer.link(SafeMath, [PublisherSubscription, Publisher]);
        deployer.deploy(ECDSA);
        deployer.link(ECDSA, PublisherSubscription);
        deployer.deploy(DLL);
        deployer.link(DLL, Publisher);
        deployer.deploy(Supporteth_V0).then(() => {
            return SEOwnedUpgradabilityProxy.deployed();
        }).then((proxyInstance) => {
            // const initializeData = encodeCall('initialize', ['address'], [accounts[3]]);
            // console.log(`BYTES ${initializeData}`)
            // proxyInstance.upgradeToAndCall(Supporteth_V0.address, initializeData)
            proxyInstance.proxyOwner().then((rs) => console.log(`OWNER ADDR ${rs}`))
            console.log(`CONTRACT ADDR ${Supporteth_V0.address}`);
            console.log(accounts[0])
            return proxyInstance;
        });

        deployer.deploy(SomeStableToken);

        deployer.deploy(SupportethToken).then(() => {
            return deployer.deploy(
                Publisher,
                accounts[0], SupportethToken.address
            );
        }).then(() => {
            return deployer.deploy(
                PublisherSubscription,
                Publisher.address, SomeStableToken.address,
                10, 60)
        }).then(() => {
            console.log(`Deployed to network ${network}`)
            console.log(`SEOwnedUpgradabilityProxy ${SEOwnedUpgradabilityProxy.address}`);
            console.log(`Address                   ${Address.address}`);
            console.log(`SafeMath                  ${SafeMath.address}`);
            console.log(`ECDSA                     ${ECDSA.address}`);
            console.log(`DLL                       ${DLL.address}`);
            console.log(`Supporteth_V0             ${Supporteth_V0.address}`);
            console.log(`SomeStableToken           ${SomeStableToken.address}`);
            console.log(`SupportethToken           ${SupportethToken.address}`);
            console.log(`Publisher                 ${Publisher.address}`);
            console.log(`PublisherSubscription     ${PublisherSubscription.address}`);
            return deployer;
        })
    } else {
        deployer.deploy(SEOwnedUpgradabilityProxy);
        deployer.deploy(Address);
        deployer.link(Address, [Supporteth_V0, PublisherSubscription, Publisher]);
        deployer.deploy(SafeMath);
        deployer.link(SafeMath, [PublisherSubscription, Publisher]);
        deployer.deploy(ECDSA);
        deployer.link(ECDSA, PublisherSubscription);
        deployer.deploy(DLL);
        deployer.link(DLL, Publisher);
        deployer.deploy(Supporteth_V0).then(() => {
            return SEOwnedUpgradabilityProxy.deployed();
        }).then((proxyInstance) => {
            // const initializeData = encodeCall('initialize', ['address'], [accounts[3]]);
            // console.log(`BYTES ${initializeData}`)
            // proxyInstance.upgradeToAndCall(Supporteth_V0.address, initializeData)
            proxyInstance.proxyOwner().then((rs) => console.log(`OWNER ADDR ${rs}`))
            console.log(`CONTRACT ADDR ${Supporteth_V0.address}`);
            console.log(accounts[0])
            return proxyInstance.upgradeTo(Supporteth_V0.address, {from: accounts[0]});
            // return proxyInstance;
        });

        deployer.deploy(SomeStableToken);

        deployer.deploy(SupportethToken).then(() => {
            deployer.deploy(
                Publisher,
                accounts[0], SupportethToken.address
            );
            return Supporteth_V0.deployed();
        }).then((seInstance) => {
        // }).then(() => {
            seInstance.addPublisher(Publisher.address, {from: accounts[0]});
            deployer.deploy(
                PublisherSubscription,
                Publisher.address, SomeStableToken.address,
                10, 60,
            )
            seInstance.addSubscriber(PublisherSubscription.address, {from: accounts[0]});
            return deployer;
        }).then(() => {
            console.log(`Deployed to network ${network}`)
            console.log(`SEOwnedUpgradabilityProxy ${SEOwnedUpgradabilityProxy.address}`);
            console.log(`Address                   ${Address.address}`);
            console.log(`SafeMath                  ${SafeMath.address}`);
            console.log(`ECDSA                     ${ECDSA.address}`);
            console.log(`DLL                       ${DLL.address}`);
            console.log(`Supporteth_V0             ${Supporteth_V0.address}`);
            console.log(`SomeStableToken           ${SomeStableToken.address}`);
            console.log(`SupportethToken           ${SupportethToken.address}`);
            console.log(`Publisher                 ${Publisher.address}`);
            console.log(`PublisherSubscription     ${PublisherSubscription.address}`);
            return deployer;
        })


    }
};
