pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/Address.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./PublisherSubscription.sol";
import "./Publisher.sol";
import "./SupportethToken.sol";

// contract Supporteth_V0 is Ownable, SupportEthToken {
/// @title Supporteth smart contract
/// @dev Holds system data
contract Supporteth_V0 is Ownable {

    /// Libraries
    using Address for address;
    using SafeMath for uint256;

    /// To check if contract was already initialized by an upgradable proxy
    bool internal _initialized;

    /// List of publishers
    /// EOAAddress => address(Publisher)
    mapping(address => address) public publishers;

    /// List of subscribers
    /// EOAAddress => address(PublisherSubscription)
    mapping(address => address) public subscribers;

    /// System relayer properties
    struct Relayer {
        bool active;
        uint256 expendedGas;
    }

    /// Relayer expended Gas
    /// relayerAddress => expendedGas
    mapping(address => Relayer) public relayers;

    /// Validate if an address belong to a Contract account
    modifier isContract(address _addr) {
        require(_addr.isContract());
        _;
    }

    /// Validate if msg.sender is the Owner of the PublisherSubscription contract
    modifier isSubscriptionOwner(address _addr) {
        require(PublisherSubscription(_addr).subscriber() == msg.sender);
        _;
    }

    constructor() public {

    }

    /**
     * @dev Initialize method to set the owner when using a Upgradable proxy
     * @param _owner address of the owner of the contract
     */
    function initialize(address _owner) public {
        require(!_initialized);
        transferOwnership(_owner);
        _initialized = true;


    }

    /**
     * @dev register a Publisher into the system
     * @param _pubContract Publisher contract address
     */
    function addPublisher(address _pubContract) public isContract(_pubContract) {
            address owner = Publisher(_pubContract).owner();
            require(owner == msg.sender, "Sender does not own Publisher contract");
            publishers[owner] = _pubContract;
    }

    /**
     * @dev register a Subscriber into the system
     * @param _subContract PublisherSubscription contract address
     */
    function addSubscriber(address _subContract) public isContract(_subContract) {
            address owner = PublisherSubscription(_subContract).subscriber();
            require(owner == msg.sender, "Sender does not own Publisher contract");
            subscribers[owner] = _subContract;
    }

    /**
     * @dev Register a relayer to process transactions for onboarding
     * @notice a relayer can be used to process trx of new users with no ether
     * @ @param _relayer Relayer account address
     */
    function addRelayer(address _relayer) public onlyOwner {
        require(!relayers[_relayer].active, "Relayer already registered");
        relayers[_relayer] = Relayer(true, 0);
    }

    /**
     * @dev Remove a relayer from the registry
     * @param _relayer Relayer account address
     */
    function removeRelayer(address _relayer) public onlyOwner {
        require(relayers[_relayer].active, "Relayer does not exist");
        delete relayers[_relayer];
    }

    /**
     * @dev sum gas expended by a relayer
     * @param _relayer Relayer account address
     * @param _expendedGas expended Gas on a relayed trx
     */
    function sumExpendedGas(address _relayer, uint256 _expendedGas) public onlyOwner {
        relayers[_relayer].expendedGas = relayers[_relayer].expendedGas.add(_expendedGas);
    }

    // function() external payable {

    // }

}
