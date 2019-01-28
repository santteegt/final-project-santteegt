pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PublisherSubscription.sol";
import "../contracts/Publisher.sol";
import "../contracts/Supporteth_V0.sol";
import "../contracts/Supporteth_V1.sol";
import "../contracts/SEOwnedUpgradabilityProxy.sol";

/// @title Contract representing a Publisher
contract PubPerson {

    Publisher public pubContract;

    constructor(address _relayer, address _token) public {
        pubContract = new Publisher(_relayer, _token);
    }

    /// @dev test that onlyOwner of the Publisher contract can register
    function registerToSystem(address system) public returns (bool success) {
        (success, ) = system.call(
            abi.encodeWithSignature("addPublisher(address)", address(pubContract)));
    }
}

/// @title Contract representing a Subscriber
contract Subscriber {

    PublisherSubscription public subscription;

    constructor(address publisher, address someToken,
        uint256 _amount, uint256 _subscriptionPeriod) public {

        subscription = new PublisherSubscription(
            publisher, someToken,
            _amount, _subscriptionPeriod);

    }

    /// @dev test that onlyOwner of the PublisherSubscription contract can register
    function registerToSystem(address system) public returns (bool success) {
        (success, ) = system.call(
            abi.encodeWithSignature("addSubscriber(address)", address(subscription)));
    }
}

/// @title Test suite for the Supporteth_VX smart contract
contract TestSupporteth {

    PubPerson publisher;
    address pubContract;
    Subscriber subscriber;

    Supporteth_V1 supportEth;
    SEOwnedUpgradabilityProxy upgradableProxy;

    function beforeAll() public {
        supportEth = new Supporteth_V1();
        upgradableProxy = new SEOwnedUpgradabilityProxy();
        upgradableProxy.upgradeTo(address(supportEth));
    }

    /// @dev test that current implementation in Registry is v0
    function testImplementationVersion() public {
        Assert.equal(upgradableProxy.implementation(), address(supportEth),
            "Supporteth_V1 is not registered in the upgradableProxy");
    }

    /// @dev test adding a publisher to the system
    function testAddPublisher() public {
        publisher = new PubPerson(address(this), DeployedAddresses.SomeStableToken());
        pubContract = address(publisher.pubContract());
        address system = upgradableProxy.implementation();
        bool success = publisher.registerToSystem(system);
        Assert.isTrue(success, "Should be able to register as a Publisher");
    }

    /// @dev test adding a system relayer address
    function testRelayer() public {
        address system = upgradableProxy.implementation();
        (bool success, ) = system.call(
            abi.encodeWithSignature("addRelayer(address)", address(this)));
        Assert.isTrue(success, "Should be able to register a relayer");

        supportEth.sumExpendedGas(address(this), 1000);
        (bool _active, uint _gas) = supportEth.relayers(address(this));
        // Assert.isTrue(success, "Should be able to register relayed expended gas");
        Assert.isTrue(_active, "Should be an active relayer");
        Assert.equal(_gas, uint(1000), "Expended gas should be equal to 1000");

    }

    /// @dev test adding a subscriber to the system
    /// @notice this is disabled due to a OOG error
    // function testAddSubscriber() public {
    //     subscriber = new Subscriber(pubContract,
    //         DeployedAddresses.SomeStableToken(), 10, 60);
    //     address system = upgradableProxy.implementation();
    //     bool success = subscriber.registerToSystem(system);
    //     Assert.isTrue(success, "Should be able to register as a Subscriber");
    // }

}
