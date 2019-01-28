
# Avoiding Common Attacks

Smart contracts were audited for security vulnerabilities using static code analysis tool such as `Mythril` and `SmartCheck`. Reports were taken into account to fix data and methods visibility, and other recommendations. Following checklist details some consideration taken into account during security analysis of SupportEth smart contracts.

### Reentrancy

`PublisherSubscription` smart contract manages a registry of subscription signatures and next block timestamp that avoid the possibility of a possible reentrancy attack, due to a payment is available for processing only after the block timestamp is greater than period. Moreover, before payment is processed, this timestamp registry is updated to the next period, so internal work is finished before in case the transfer fails.

### Cross Function Race conditions

Contracts methods not marked as view-pure are called by the respective owner only, so no mutual exclusion vulnerability could happen.

### Transaction Ordering & Timestamp Dependence

Even if the PublisherSubscription is dependent on the block timestamp, a payment will suddenly be processed, even if the attacker delays the block time. This vulnerability will be dangerous only in the case that a subscription payment should be processed every second, however, subscription services usually setup weekly or monthly payments.

### Integer Over / Underflow

All uint calculations are being processed using the SafeMath library from OpenZeppelin.

### Denial of Service

There is no method requiring intensive processing needs in SupportEth contract. Publisher handles a DoubleLinkList (`DLL`) structure but any read/write method is always processed per node, while ordering is maintained during each operation.

### Force send Ether

SupportEth currently does not handle Ether transactions (payable functions).

### Poison Data

Require statements are always used before processing internal work.

### Exposed Functions

Some functions exposition were fixed after using static analysis tools.

### Malicious Admins

Only contract owners are able to add/remove admins in certain smart contracts such as `SEOwnedUpgradabilityProxy`, `PublisherSubscription` contracts, and any other contract that inherits from `Ownable`.

### Failed Sends

Relayers guarantee including a reasonable amount of gas with each payment sent.

### Tx.Origin Problem

All smart contracts always use `msg.sender`

### Incorrect use of Cryptography

`PublisherSubscription` contract uses OpenZeppelin `ECDSA` Library to call the <subcriptionHash>.toEthSignedMessageHash().recover(<signature>) and obtain the address of the subscriber. Moreover, to generate subscription hashes, the contact follows the [EIP-191](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-191.md) and [EIP-1077](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1077.md) standards.

### Avoid state changes after external calls

Currently, all smart contacts perform external call to view functions.

### Don't delegatecall to untrusted code

`SEOwnedUpgradabilityProxy` only executes a `delegatecall` to the implementation set by the proxy owner.
