pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "openzeppelin-solidity/contracts/utils/Address.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

/** @author santteegt
  * @title SuportEth Subscription contract to a publisher content.
  * @dev Based on the EIP-1337 spec
  */
contract PublisherSubscription is Pausable {

    /// Libraries
    using Address for address;
    using SafeMath for uint256;
    using ECDSA for bytes32;

    /// Subscriber address
    address public subscriber;

    /// Subscription status
    enum SubscriptionStatus {
        /// Active Subscription
        ACTIVE,
        /// Subscriber does not have enough funds (Unused)
        INACTIVE,
        /// Subscriber cancelled the subscription
        CANCELLED
    }

    /// Subscription status
    SubscriptionStatus public subStatus;

    /// Next valid timestamp to process subscription
    /// Similar to a nonce that avoids replay attack
    /// subscriptionHash  => next valid block number in terms of timestamp
    mapping(bytes32 => uint256) public nextValidTimestamp;

    /// Subscription settings
    struct Settings {
        /// publisher contract
        address publisher;
        /// token address to process subscription payments
        address tokenAddress;
        /// subscription token amount
        uint256 tokenAmount;
        /// subscription period in seconds
        uint256 subscriptionPeriod;
    }

    /// Subscription configuration
    Settings public settings;

    /// Event fired when subscription payment has been executed
    event ExecuteSubscription(
        address indexed subscriber, //subscriber
        address indexed publisher, //publisher
        address tokenAddress, //token address
        uint256 tokenAmount, //token amount
        uint256 subscriptionPeriod, //subscription period in seconds between payments
        uint256 gasPrice //the amount of tokens to pay relayer
    );

    /// Event fired when subscription is cancelled
    event CancelSubscription(
        address indexed subscriber, //subscriber
        address indexed publisher, //publisher
        address tokenAddress, //token address
        uint256 tokenAmount, //token amount
        uint256 subscriptionPeriod //subscription period in seconds between payments
    );

    /// Validate if an address belong to a Contract account
    modifier isContract(address _addr) {
        require(_addr.isContract());
        _;
    }

    /// Validate if contract function caller is the owner
    modifier onlyOwner() {
        require(msg.sender == subscriber);
        _;
    }

    /// Validate if publisher is calling a method
    modifier onlyPublisher() {
        require(msg.sender == settings.publisher);
        _;
    }

    /// Validate if the subscription is not cancelled
    modifier subscriptionNotCancelled() {
        require(subStatus != SubscriptionStatus.CANCELLED, "Subscription is cancelled");
        _;
    }

    /**
      * @dev Contract constructor
      * @param _publisher Publisher Contract
      * @param _tokenAddress Token address
      * @param _tokenAmount token amount to pay
      * @param _subscriptionPeriod subscription period
      */
    constructor(
        address _publisher,
        address _tokenAddress,
        uint256 _tokenAmount,
        uint256 _subscriptionPeriod
        ) public isContract(_publisher) isContract(_tokenAddress) {

            subscriber = msg.sender;
            settings = Settings(
                _publisher,
                _tokenAddress,
                _tokenAmount,
                _subscriptionPeriod);

    }

    /** @dev Executes subscription payment
      * @param _subscriber Subscriber address
      * @param _publisher Publisher address
      * @param _tokenAddress Token address
      * @param _tokenAmount Token amount
      * @param _subscriptionPeriod Subscription period in seconds
      * @param _signature Proof the subscriber signed the meta trasaction
      * @return bool true if processed
      */
    function executeSubscription(
        address _subscriber,
        address _publisher,
        address _tokenAddress,
        uint256 _tokenAmount,
        uint256 _subscriptionPeriod,
        bytes memory _signature
    ) public
        whenNotPaused
        subscriptionNotCancelled
        returns (bool success) {

        // Validate subscription
        // pulled this out so I have the hash, should be exact code as "isSubscriptionReady"
        bytes32 subscriptionHash = getSubscriptionHash(
            _subscriber, _publisher, _tokenAddress,
            _tokenAmount, _subscriptionPeriod);
        address signer = getSubscriptionSigner(subscriptionHash, _signature);

        require(_subscriber == signer, "Invalid Signature");
        require(block.timestamp >= nextValidTimestamp[subscriptionHash], "Subscription is not ready");

        // if there are requirements from the deployer, let's make sure
        // those are met exactly
        // require(settings.publisher == address(0x0) || settings.publisher == _publisher);
        // require(settings.tokenAddress == address(0x0) || settings.tokenAddress == _tokenAddress);
        // require(settings.tokenAmount == 0 || settings.tokenAmount == _tokenAmount);
        // require(settings.subscriptionPeriod == 0 || settings.subscriptionPeriod == _subscriptionPeriod);
        // require( requiredGasPrice == 0 || gasPrice == requiredGasPrice );

        //increment the timestamp by the period so it wont be valid until then
        nextValidTimestamp[subscriptionHash] = block.timestamp.add(settings.subscriptionPeriod);

        // now, let make the transfer from the subscriber to the publisher
        uint256 startingBalance = ERC20(_tokenAddress).balanceOf(_publisher);
        require(ERC20(_tokenAddress).transferFrom(_subscriber, _publisher, _tokenAmount), "Transfer Failed");
        require((startingBalance + _tokenAmount) == ERC20(_tokenAddress).balanceOf(_publisher), "Fatal error during Token Transfer");

        uint256 gasPrice = 0; //TODO: include incentives to Relayers based on Oracle and ETH current prize

        emit ExecuteSubscription(
            _subscriber, _publisher, _tokenAddress,
            _tokenAmount, _subscriptionPeriod, gasPrice
        );

        // it is possible for the subscription execution to be run by a third party
        // incentivized in the terms of the subscription with a gasPrice of the tokens
        //  - pay that out now...
        if (gasPrice > 0) {
            //the relayer is incentivized by a little of the same token from
            // the subscriber ... as far as the subscriber knows, they are
            // just sending X tokens to the publisher, but the publisher can
            // choose to send Y of those X to a relayer to run their transactions
            // the publisher will receive X - Y tokens
            // this must all be setup in the constructor
            // if not, the subscriber chooses all the params including what goes
            // to the publisher and what goes to the relayer

            require(ERC20(_tokenAddress).transferFrom(_subscriber, msg.sender, gasPrice), "Failed to pay incentive gas token to the relayer");
        }

        return true;
    }

    /** @dev Check if a subscription is signed correctly and ready for next execution
      * @param _subscriber Subscriber address
      * @param _publisher Publisher address
      * @param _tokenAddress Token address
      * @param _tokenAmount Token amount
      * @param _subscriptionPeriod Subscription period in seconds
      * @param _signature Proof the subscriber signed the meta trasaction
      * @return bool true if subscription is ready for payment processing
      */
    function isSubscriptionReady(
        address _subscriber,
        address _publisher,
        address _tokenAddress,
        uint256 _tokenAmount,
        uint256 _subscriptionPeriod,
        bytes memory _signature)
        public view returns (bool) {

        bytes32 subscriptionHash = getSubscriptionHash(
            _subscriber, _publisher, _tokenAddress,
            _tokenAmount, _subscriptionPeriod);
        address signer = getSubscriptionSigner(subscriptionHash, _signature);

        uint256 allowance = ERC20(_tokenAddress).allowance(_subscriber, address(this));
        uint256 balance = ERC20(_tokenAddress).balanceOf(_subscriber);

        return (
            signer == _subscriber &&
            _subscriber != _publisher &&
            block.timestamp >= nextValidTimestamp[subscriptionHash] &&
            allowance >= _tokenAmount &&
            balance >= _tokenAmount
        );
    }

    /** @dev Explicitly cancel the subscription
      * @notice Subscriber can cancel a subscription any time by not having funds
      * @param _subscriber Subscriber address
      * @param _publisher Publisher address
      * @param _tokenAddress Token address
      * @param _tokenAmount Token amount
      * @param _subscriptionPeriod Subscription period in seconds
      * @param _signature Proof the subscriber signed the meta trasaction
      * @return success true if processed
      */
    function cancelSubscription(
        address _subscriber,
        address _publisher,
        address _tokenAddress,
        uint256 _tokenAmount,
        uint256 _subscriptionPeriod,
        bytes memory _signature)
        public onlyOwner subscriptionNotCancelled
        returns (bool success) {

        bytes32 subscriptionHash = getSubscriptionHash(
            _subscriber, _publisher, _tokenAddress,
            _tokenAmount, _subscriptionPeriod);
        address signer = getSubscriptionSigner(subscriptionHash, _signature);

        require(signer == _subscriber, "Invalid Signature");

        /// Perform an Integer underflow
        /// that date will never be reached during human existence
        nextValidTimestamp[subscriptionHash] = uint256(-1);
        /// To allow easy queries for subscription status
        subStatus = SubscriptionStatus.CANCELLED;

        emit CancelSubscription(
            _subscriber, _publisher, _tokenAddress,
            _tokenAmount, _subscriptionPeriod);

        return true;
    }

    /** @dev Generates a hash following the EIP-191 and EIP-1077 standards
      * @param _subscriber Subscriber address
      * @param _publisher Publisher address
      * @param _tokenAddress Token address
      * @param _tokenAmount Token amount
      * @param _subscriptionPeriod Subscription period in seconds
      * @return bytes32 hash from subscription data
      */
    function getSubscriptionHash(
        address _subscriber,
        address _publisher,
        address _tokenAddress,
        uint256 _tokenAmount,
        uint256 _subscriptionPeriod
    ) public view returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                byte(0x19),
                byte(0),
                address(this),
                _subscriber,
                _publisher,
                _tokenAddress,
                _tokenAmount,
                _subscriptionPeriod));
    }

    /** @dev Executes the ecrecover to get the signer from hash and signature
      * @param _subscriptionHash Hash of subscription
      * @param _signature Proof the subscriber signed the meta trasaction
      * @return address signer address
      */
    function getSubscriptionSigner(bytes32 _subscriptionHash, bytes memory _signature)
        public pure returns (address) {
        return _subscriptionHash.toEthSignedMessageHash().recover(_signature);
    }

    /**
     * @dev Low lever version of getSubscriptionSigner method
     * @notice This function is only intended to show some knowledge on LLL code
     * @param _subscriptionHash Hash of subscription
     * @param _signature Proof the subscriber signed the meta trasaction
     * @return address signer address
     */
    function _getSigner(bytes32 _subscriptionHash, bytes memory _signature)
        public pure returns (address) {

        bytes32 r;
        bytes32 s;
        uint8 v;
        if (_signature.length != 65) {
            return address(0x0);
        }
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }
        if (v < 27) {
            v += 27;
        }
        if (v != 27 && v != 28) {
            return address(0x0);
        } else {
            return ecrecover(
                keccak256(
                    abi.encodePacked("\x19Ethereum Signed Message:\n32",
                    _subscriptionHash)
                ),
            v, r, s);
        }
    }

    /**
     * @dev Used by external smart contracts to verify on-chain that a
     * particular subscription is "paid" and "active"
     * @param _subscriptionHash subscription hash
     * @param _subscriptionPeriod subscription period in seconds
     * @return bool true if subscription is active
     */
    function isSubscriptionActive(bytes32 _subscriptionHash, uint256 _subscriptionPeriod)
        view external returns (bool) {
        return (block.timestamp
                <=
                nextValidTimestamp[_subscriptionHash].add(_subscriptionPeriod)
                );
    }

    /// @dev Get subscription settings
    /// @return (address, address, uint256, uint256) Subscription settings
    function getSettings() external view onlyOwner
        returns (address, address, uint256, uint256) {
            return (settings.publisher,
                settings.tokenAddress,
                settings.tokenAmount,
                settings.subscriptionPeriod);
    }

    // function getSubscriptionAmount() public view onlyPublisher() returns (uint256) {
    /// @dev Get subscription amount
    /// @return uint256 subscription amount
    function getSubscriptionAmount() public view returns (uint256) {
        return settings.tokenAmount;
    }

    /// @dev This contract does not receive Ether
    // function() external payable {
    //     revert();
    // }

}
