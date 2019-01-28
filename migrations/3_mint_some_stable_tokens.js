var SomeStableToken = artifacts.require("./SomeStableToken.sol");

module.exports = function(deployer, network, accounts) {

    console.log(network)
    console.log(accounts)
    if(network === 'development') {

        SomeStableToken.deployed().then((token) => {
            accounts.forEach((account) => {
                    token.mint(account, 100, {from: accounts[0]})
                    token.balanceOf(account).then((rs) => {
                        console.log(`Token Balance for ${account}: ${rs} SST`)
                    });
            })
        })

    }
}
