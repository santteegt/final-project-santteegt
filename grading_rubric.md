
# Grading Rubric Checklist

Here you can find comments and references to the source code to help you evaluate the project

## User Interface Requirements

* **Run app on a dev server locally for testing/grading (connecting to Rinkeby if required)**: dApp can be deployed to IPFS. See instructions in [README](https://github.com/dev-bootcamp-2019/final-project-santteegt#installation-instructions)
* **Should be able to visit a URL and interact with the app (can be localhost)**: you should run `npm deploy-ipfs-dev` command. See more info [here](https://github.com/dev-bootcamp-2019/final-project-santteegt#installation-instructions)
* **The applications should have the following features: 1)Display the current account; 2)Sign transactions using metamask or uPort; 3)Reflect updates to to the contract state**: dApp displays a Blockie with the current account in Metamask

## Testing

* **5 tests (Javascript or Solidity or both) with explanations for each smart contract written (where appropriate)**: the following test suites were developed. More information can be found on the comments within each test file

  * TestOwnedUpgradabilityProxy: test the possiblity to upgrade a smart contract implementation new address, and Proxy ownability
  * TestPublisher: test the Double linked list feature to store IPFS multihash pointers to publisher's contentIPFS, as well as contract ownability
  * TestPublisher2: test registry for new subscribers
  * TestPublisherSubscription: test subscription setup and circuit breaker features
  * TestSupporteth: test registries to store pointers to publishers, relayer supporters and fans in the SupportEth system
  * TestSupportethToken: test token transfer, allowance approval, and contract ownership

* **Tests are properly structured (ie sets up context, executes a call on the function to be tested, and verifies the result is correct)**: Yes
* **Tests provide adequate coverage for the contracts**: see test files
* **All tests pass**: Yes

## Design Pattern Requirements

* **Implement a circuit breaker / emergency stop**: It is deployed in [PublisherSubscription](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/contracts/PublisherSubscription.sol) contract. See more info in the [design pattern decision](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/design_patterns_decisions.md)
* **What other design patterns have you used or not used?**: see [design pattern decision](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/design_patterns_decisions.md)

## Security Tools / Common Attacks

* **Explain what measures they’ve taken to ensure that their contracts are not susceptible to common attacks"**: see [avoiding common attacks](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/avoiding_common_attacks.md)

## Library / EthPM

* **At least one of the project contracts includes an import from a library/contract or an ethPM package. If none of the project contracts do, then there is a  demonstration contract that does**: the following OpenZeppelin libraries were used:

* Address.sol: to ensure address parameters belong to a smart contract \[[1](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/contracts/Publisher.sol), [2](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/contracts/PublisherSubscription.sol) [3](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/contracts/Supporteth_V0.sol)\]
* SafeMath.sol: for safe uint operations \[[1](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/contracts/Publisher.sol), [2](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/contracts/PublisherSubscription.sol), [3](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/contracts/Supporteth_V0.sol)\]
* ECDSA.sol: cryptographic functions to manipulate trx hashes and get trx signer \[[1](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/contracts/PublisherSubscription.sol)\]

On the other hand, a custom library was also implemented:

* DLL.sol [1](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/contracts/DLL.sol): Double linked list to store Publisher's post [2](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/contracts/Publisher.sol) efficiently. See more info in the [design pattern decision](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/design_patterns_decisions.md)

## Additional Requirements

* **Smart Contract code should be commented according to the specs in the documentation**: all smart contracts have comments according to the natspec
* **Testnet Deployment:  The addresses provided in deployed_addresses.txt correctly point to deployed contracts on the rinkeby testnet. Check by calling a function at the provided address on..**: you can find them [here](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/deployed_addresses.md)

## Stretch Goals (for bonus points)

* **Project uses IPFS**: Yes. It is being used for [dApp deployment](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/publish-to-ipfs.js) and for storing Publisher's posts.
* **Project uses uPort**: Login implemented by not being used for signing Trxs
* **Project uses the Ethereum Name Service**: No
* **Project uses an Oracle**: No
* **Project implements an Upgradable Pattern Registry or Delegation**: It implements the OwnedUpgradabilityProxy pattern. See more info in the [design pattern decision](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/design_patterns_decisions.md). Implementation can be found [here](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/contracts/SEOwnedUpgradabilityProxy.sol)
* **Project includes one smart contract implemented in LLL / Vyper**: certain portions of the [PublisherSubscription.sol](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/contracts/PublisherSubscription.sol#L314) and [UpgradableProxy](https://github.com/dev-bootcamp-2019/final-project-santteegt/blob/master/contracts/SEProxy.sol#L18)
