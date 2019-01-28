pragma solidity ^0.5.0;

import "./Supporteth_V0.sol";

/// @title Supporteth smart contract
/// @dev Holds system data
/// @notice This contract purpose is to show the Upgradable Proxy contract functionality
contract Supporteth_V1 is Supporteth_V0 {

    event AddedRelayer(address relayer);
    event RemovedRelayer(address relayer);

    /**
     * @dev Register a relayer to process transactions for onboarding
     * @notice a relayer can be used to process trx of new users with no ether
     * @ @param _relayer Relayer account address
     */
    function addRelayer(address _relayer) public onlyOwner {
        require(!relayers[_relayer].active, "Relayer already registered");
        relayers[_relayer] = Relayer(true, 0);
        emit AddedRelayer(_relayer);
    }

    /**
     * @dev Remove a relayer from the registry
     * @param _relayer Relayer account address
     */
    function removeRelayer(address _relayer) public onlyOwner {
        require(relayers[_relayer].active, "Relayer does not exist");
        delete relayers[_relayer];
        emit RemovedRelayer(_relayer);
    }

}
