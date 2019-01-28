
# Consensys Developer Program Autumn 2018

## Final Project: SupportEth - A Decentralized Patreon

* **Author**: Santiago Gonzalez Toral ([Github](https://github.com/santteegt)|[email](mailto:hernangt12re3@gmail.com))

### What is this project about?

SupportEth is a dApp which aims to serve as a decentralized Patreon platform where Publishers can share their contents and earn money with recurring payment subscriptions in any ERC20 token, and without any kind censorship from a central authority.

#### User stories

![User Stories](resources/user_stories.png)

* In the website, any content creator can register a new `Publisher` account (smart contract), and start creating blog posts, which are not stored on a typical centralized storage but on IPFS. With his/her account, it is also possible to monitor the people that subscribe to their content, and receive recurring payment contributions from them on specific periods of time (e.g. monthly). Payments can be made in any ERC20 token the publisher prefers, and can be withdrawn at any time from the contract.

* Any person can create a `Fan` account (smart contract) to subscribe and contribute to publisher's content. To initialize a subscription, the user only needs to sign a transaction to authorize a relayer to process the payments through each subscription period he/she specified. Subscriptions cannot only be explicitly cancelled by the user, but in case their accounts is out of funds, the relayer will wait until the next period to try to process a new payment, so users don't need to lock a specific amount of funds prior authorizing the subscription. Int this way, SupportEth does not act as an escrow for subscriptions.

* Recurring payments need to be processed during different periods of time. Having a single relayer to process these transactions introduce some sort of centralization to the system. For this reason, any person can create a `Relayer` supporter account and contribute in some way (by paying the gas cost for processing the recurring payment) to the Publisher to keep delivering content. A relayer supporter can register their account address and download the relayer software to start processing recurring transactions for a specific Publisher. In exchange, the user have full access to published content, and earn some SupportEth tokens proportional to the gas they spend.

### How to Setup the project locally?

#### Software Requirements

* truffle v5.x.x
* Solc 0.5.0 +
* Node v8.11.3 +
* IPFS
* Local testnet (e.g. Ganache, ganache-cli, truffle develop, Geth, Parity, etc.) with a RPC running at http://localhost:8545
* Browser with Metamask plugin installed

#### Installation instructions

* On a terminal window, start the IPFS local node by running:

```bash
ipfs daemon
```

In case IPFS wasn't configured before, you can read this [article](https://medium.com/coinmonks/how-to-add-site-to-ipfs-and-ipns-f121b4cfc8ee)

* Then, on a command line run the following

```bash
git clone https://github.com/dev-bootcamp-2019/final-project-santteegt
cd final-project-santteegt
npm install
truffle compile
truffle migrate
```

* Once truffle migrate finishes, run the following command to deploy the dApp on IPFS

```bash
npm run deploy-ipfs-dev
```

* Once the script finishes, you will obtain as output a message similar to:

```
...
...
dApp is published at http://localhost:8080/ipns/QmXrERdCi7yuxrjiYcUG6wE9GbJW3a82tRyAMJTZVD2uPA
or https://ipfs.io/ipns/QmXrERdCi7yuxrjiYcUG6wE9GbJW3a82tRyAMJTZVD2uPA
```

On the terminal, please copy the URL pointing to your `localhost` node (for faster testing purposes), and open it on your preferred browser. Remember that it needs to have Metamask installed to interact with the dApp.

**NOTE**: within the dApp, you can see an option to login with uPort. You can authorize the login using their mobile app, but the dApp interaction with the smart contracts is not supported yet, so Metamask is the only alternative to transact within Ethereum.

* For development purposes, it is possible to deploy the dApp by running the command `npm run start`. The dApp will be deployed at http://localhost:3000

### How to use the dApp on a public testnet?

Currently, all smart contracts are deployed on the Ethereum `Rinkeby` testnet. You can find the corresponding addresses and Etherscan URLs pointing to the verified code in [deployed_addresses](deployed_addresses.md)

In case you want to test the deployment to Rinkeby, make sure you fund your test account using the [Faucet server](https://faucet.rinkeby.io). Then, copy the mnemonic words of your Metamask account and paste them in a `.secret` file on the root directory of the project. Finally, you can run the following migration command:

```bash
npm run migrate-rinkeby
```

### How to run the tests?

To run all developed smart contract test cases, you need to run the following command:

```bash
truffle test
```

Smart contracts and unit tests were properly documented using the [natspec style guidelines for comments](https://solidity.readthedocs.io/en/v0.5.2/style-guide.html#natspec). A detailed explanation of each test suite is provided on each of the test source code files in the [test](test/) directory.

### Design Patterns decisions

A detailed explanation of the design patterns used in SupportEth can be found [here](design_patterns_decisions.md)

### Avoiding common attacks

A detailed explanation of what measures were taken to ensure SupportEth contracts are not susceptible to common attacks can be found [here](avoiding_common_attacks.md)

### Grading Rubric Checklist

In order to help you evaluate the project, you can find the grading rubric checklist with comments and references to the source code [here](grading_rubric.md)

### License

[Licence](LICENSE)

### Further development

After the Consensys DP finishes, further development will take place in the [fork](https://github.com/santteegt/final-project-santteegt) on my Github account
