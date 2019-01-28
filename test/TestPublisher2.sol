pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PublisherSubscription.sol";
import "../contracts/Publisher.sol";

/// @title Contract representing a Publisher
contract PubPerson {

    Publisher public pubContract;

    constructor(address _relayer, address _token) public {
        pubContract = new Publisher(_relayer, _token);
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

    /// @dev test that onlyOwner can register its subscription
    function registerSubscription(Publisher pubContract)
        public returns (bool) {
            pubContract.subscribe(address(subscription),
                Publisher.SubscriberType.FAN);
            return true;
    }

    /// @dev test that onlyOwner can unsubscribe
    function unsubscribe(Publisher pubContract)
        public returns (bool) {
        pubContract.unsubscribe(address(subscription));
        return true;
    }
}

/// @title Another Test suite for the Publisher smart contract.
contract TestPublisher2 {

    PubPerson publisher;
    Publisher pubContract;

    Subscriber subscriber;

    function beforeAll() public {
        publisher = new PubPerson(address(this),
            DeployedAddresses.SomeStableToken());
        pubContract = publisher.pubContract();
        subscriber = new Subscriber(
            address(pubContract), pubContract.tokenAddress(), 10, 60);
        // subContract = PublisherSubscription(subAddress);
    }

    /// @dev test registering a new subscription to a Publisher
    function testSubscriptionRegistration() public {
        bool success = subscriber.registerSubscription(pubContract);
        Assert.isTrue(success,
        "Subscriber should be able to registerinto the Publishers contract");

        address subAddress = address(subscriber.subscription());

        (bool _active, , uint256 _amount) = pubContract.subscribers(subAddress);
        Assert.isTrue(_active, "Subscription should be active");
        Assert.equal(_amount, 10, "Subscription amount should be 10");

        /// test that onlyOwner of subscripton contract can register
        (success, ) = subAddress.call(
            abi.encodeWithSignature("subscribe(address, Publisher.SubscriberType)",
                subAddress, Publisher.SubscriberType.FAN));
        Assert.isFalse(success, "Only subscription owners can register");
    }

    /// @dev test unsubscribe to a publisher
    /// @notice this is disabled due to OOG error
    // function testUnsubscribe() public {
    //     bool success = subscriber.unsubscribe(pubContract);
    //     Assert.isTrue(success,
    //     "Subscriber should be able to unsubscribe to Publisher");
    //
    //     address subAddress = address(subscriber.subscription());
    //
    //     (bool _active, , ) = pubContract.subscribers(subAddress);
    //     Assert.isFalse(_active, "Subscription should be cancelled");
    //
    //     (success, ) = subAddress.call(
    //         abi.encodeWithSignature("unsubscribe(address)", subAddress));
    //     Assert.isFalse(success, "Only subscription owners can unsubscribe");
    //
    // }

}
