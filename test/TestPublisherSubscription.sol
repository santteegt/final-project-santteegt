pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SomeStableToken.sol";
import "../contracts/Publisher.sol";
import "../contracts/PublisherSubscription.sol";

/// @title Contract representing a Subscriber individual
contract Subscriber {

    PublisherSubscription public subscription;

    constructor() public {

    }

    function createSubscription (
            address publisher, address someToken,
            uint256 _amount, uint256 _subscriptionPeriod)
            public returns (address) {
        subscription = new PublisherSubscription(
                publisher, someToken,
                _amount, _subscriptionPeriod);
        return address(subscription);
    }

    /// @dev test that onlyOwner with PausableRole can trigger the emergency stop signal
    function triggerEmergencyStop() public returns (bool) {
        subscription.pause();
        return true;
    }

    function getPubSettings() public view returns (address _publisher, address _token,
        uint256 _value, uint256 _subPeriod) {
        (_publisher, _token, _value, _subPeriod) = subscription.getSettings();
    }

}

/// @title Test suite for the PublisherSubscription contract
contract TestPublisherSubscription {

    Subscriber subscriber;
    SomeStableToken someToken;
    Publisher publisher;
    PublisherSubscription subscription;

    function beforeAll() public {
        subscriber = new Subscriber();
        // someToken = new SomeStableToken();
        // publisher = new Publisher(address(defaultRelayer), address(someToken));
        publisher = new Publisher(address(this), DeployedAddresses.SomeStableToken());

        address subAddress = subscriber.createSubscription(
            address(publisher),
            publisher.tokenAddress(),
            10, 60);
        subscription = PublisherSubscription(subAddress);
    }

    /**
     * @dev Test contract is setup correctly
     * @notice Verify the correctness of settings and who can see it
     */
    function testSubscriptionSetup() public {
        (bool success, ) = address(subscription)
            .call(abi.encodeWithSignature("getSettings"));
        Assert.isFalse(success, "getSettings should only be called by the owner");

        (address _publisher, address _token,
            uint256 _value, uint256 _subPeriod) = subscriber.getPubSettings();
        Assert.equal(_publisher, address(publisher), "Error in publisher address");
        Assert.equal(_token, publisher.tokenAddress(), "Error in token address");
        Assert.equal(_value, 10, "Error in subscription value");
        Assert.equal(_subPeriod, 60, "Error in subscription period");
    }

    /**
     * @dev Test curcuit breaker functionality
     * @notice It uses the OpenZeppelin Pausable contract
     */
    function testCircuitBreaker() public {
        Assert.isFalse(subscription.paused(), "Contract should not be paused");

        /// onlyOwner with PausableRole can trigger the emergency stop signal
        (bool success, ) = address(subscription)
            .call(abi.encodeWithSignature("pause"));
        Assert.isFalse(success, "Emergency stop should only be called by the owner");

        success = subscriber.triggerEmergencyStop();
        Assert.isTrue(success, "Emergency stop should callable by the owner");
        Assert.isTrue(subscription.paused(), "Contract should be paused");

    }
}
