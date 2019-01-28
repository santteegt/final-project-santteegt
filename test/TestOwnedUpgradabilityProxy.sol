pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PublisherSubscription.sol";
import "../contracts/Publisher.sol";
import "../contracts/Supporteth_V0.sol";
import "../contracts/Supporteth_V1.sol";
import "../contracts/SEOwnedUpgradabilityProxy.sol";

/// @title Contract representing a System owner
contract SystemOwner {

    constructor() public {
    }

    /// @dev to test modifier that only proxyOwner can upgrade
    function upgradeSystem(address upgradableProxy, address newVersion)
        public returns (bool success) {
        (success, ) = upgradableProxy.call(
            abi.encodeWithSignature("upgradeTo(address)", newVersion));
    }
}

/// @title Test suite for the OwnedUpgradabilityProxy contract
contract TestOwnedUpgradabilityProxy {

    SystemOwner owner;

    Supporteth_V0 supportEth;
    SEOwnedUpgradabilityProxy upgradableProxy;

    function beforeAll() public {
        owner = new SystemOwner();
        supportEth = new Supporteth_V0();
        upgradableProxy = new SEOwnedUpgradabilityProxy();
    }

    /// @dev test the Registry functionality for Upgradable contracts
    function testRegisterToUpgradableProxy() public {
        (bool success, ) = address(upgradableProxy).call(
            abi.encodeWithSignature("upgradeTo(address)", address(supportEth)));
        Assert.isTrue(success, "Should be able to register Supporteth impl.");

        Assert.equal(upgradableProxy.implementation(), address(supportEth),
            "Supporteth_V0 is not registered in the upgradableProxy");
    }

    /// @dev test the ownership functionality of the Upgradable proxy contract
    function testUpgradableProxyOwnership() public {
        Supporteth_V1 newVersion = new Supporteth_V1();

        /// NotAnOwnerYet is trying to update the implmentation
        bool success = owner.upgradeSystem(address(upgradableProxy),
            address(newVersion));
        Assert.isFalse(success, "Should NOT be able to register Supporteth impl.");

        Assert.equal(upgradableProxy.proxyOwner(), address(this),
            "UpgradableProxy should be owned by tester");

        /// transfer ownership to SystemOwner
        (success, ) = address(upgradableProxy).call(
            abi.encodeWithSignature("transferProxyOwnership(address)",
                address(owner)));
        Assert.isTrue(success, "Should be able to change ownership");
        success = owner.upgradeSystem(address(upgradableProxy), address(newVersion));
        Assert.isTrue(success, "New owner should be able to register a new Supporteth impl.");

        Assert.equal(upgradableProxy.implementation(), address(newVersion),
            "Supporteth_V1 is not registered in the upgradableProxy");
    }

}
