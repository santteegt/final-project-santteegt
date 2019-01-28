
# Design Patterns Decisions

## Design patterns used within SupportEth

The `<-` symbol means that Contract inherits from.

### SEOwnedUpgradabilityProxy (<-SEUpgradabilityProxy<-SEProxy)

The OwnedUpgradabilityProxy follows the `Unstructured Storage pattern` that has been initially developed by the Zeppelinos Lab group in order to enable the development of upgradable smart contracts. It uses a combination of a registry to store latest version of a contract, and a relayer (*DELEGATECALL*) to forward data and calls.

This is similar to Inherited Storage but doesn’t require the logic contract to inherit any state variables associated with upgradeability. In fact, it defines a constant variable that, when hashed, should give a random enough storage position to store the address of the logic contract that the proxy should call to. Since constant state variables do not occupy storage slots, there’s no concern of the implementationPosition being accidentally overwritten by the logic contract

This implementation also uses the concept of proxy ownership. A proxy owner is the only address that can upgrade a proxy to point to a new logic contract, and the only address that can transfer ownership.

 ![UnstructuredProxy](https://i2.wp.com/blog.zeppelinos.org/wp-content/uploads/2018/04/5Fixed.png?w=1610&ssl=1)

### Supporteth_Vx

Different versions of the SupportEth system smart contract is handled by the `OwnedUpgradabilityProxy`. This pattern was chosen as it has already gone through a full security audit by [Nomic Labs](https://medium.com/nomic-labs-blog/zeppelinos-smart-contracts-audit-dc772cfae224)

### Restricting Access

The contracts `Publisher PublisherSubscription Supporteth_Vx` inherits form the `Ownable` smart contract provided by OpenZeppelin, so their creators have access to main methods. On the other hand, the `SEOwnedUpgradabilityProxy` contract implements its own *ownable* behaviour.

### DLL

In order to be able to manage CRUD operations on a Publisher's posts efficiently, a Double Linked List library was implemented to represent this data in the blockchain. The DDL stores the Multihash representation of an IPFS identifier, as well as the insertion timestamp.

### Publisher

Publisher's main methods are accessible by the owner that deploy it. It uses the DLL library to store the publisher's posts stored on IPFS

### PublisherSubscription (<-Pausable)


This contract follows the [EIP-1337](https://github.com/ethereum/EIPs/pull/1337) standard for recurring payments in the blockchain. It enables  a user to subscribe to a *service* by signing a transaction that authorizes to process a payment transaction every *subscription period*. This transactions need to be processed by relayers when each period is reached. This standard allows to create subscripton services in the blockchain without the need of a user to lock funds (e.g. put them on an time-locked escrow contract).

Due to this contract is considered as the heart of the system, it implements a **Circuit Breaker** to stop payment executions if the user considers to or if new errors are discovered in future upgrades of Ethereum (e.g. the reentrancy bug found in ConstantiNOPEple). For this reason, the contract inherits from the `Pausable` smart contract provided by OpenZeppelin.

### SupportEthToken (<-ERC20Mintable<-ERC20)

The SupportEthToken is an ERC20 mintable token created for governance (e.g. for future DAO system development) and incentive for relayer supporters. The ERC20 contracts provided by OpenZeppelin offers a `Rate limiting` pattern that enables the allowance to spend tokens by a third party (e.g. publishers should be able to airdrop tokens to subscribers in the future)

### SomeStableToken

The SomeStableToken is an ERC20 mintable token for testing subscription payment transactions in a local testnet.

## Why not used these other design pattern?

### Upgradeability using Inherited Storage or Upgradeability using Eternal Storage

This other upgradable smart contract proxy patterns have not been fully audited yet, and are not recommended for production. Moreover, the Eternal Storage introduces complex data access, decreasing the readability of the code, and some increase in contract size.

### Speed Bumps

*Speed bumps slow down actions, so that if malicious actions occur, there is time to recover*: a better approach for SupportEth is to implement a circuit breaker on its subscription service smart contract so it can be triggered in case of emergency

### Contract Rollout

*During testing, you can force an automatic deprecation by preventing any actions*: this pattern should be implemented when the dApp application goes to staging and/or beta phases.

### pushing vs pulling transfers

Recurring subscription services process periodic transfers using EIP-1337 standard.

### State Machine

SupportEth does not have any feature (e.g. bidding) requiring state machine behaviour.
