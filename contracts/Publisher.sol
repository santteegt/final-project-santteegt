pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/Address.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./DLL.sol";
import "./PublisherSubscription.sol";

/// @title Publisher smart contract
/// It Manages posts and subscriptions
contract Publisher is Ownable {

    /// Libraries
    using Address for address;
    using SafeMath for uint256;
    using DLL for DLL.Data;

    /// Types of subscribers
    enum SubscriberType {
        /// Relay Backer
        RELAY,
        /// Fan
        FAN
    }

    /// Subscriber properties
    struct Subscriber {
        bool active;
        SubscriberType subType;
        uint256 amount;
    }

    /// Relayer properties
    struct Relayer {
        bool active;
        uint256 expendedGas;
    }

    /// List of subscribers
    mapping(address => Subscriber) public subscribers;

    /// Relayer expended Gas
    /// relayerAddress => expendedGas
    mapping(address => Relayer) public relayers;

    /// Token address
    address public tokenAddress;

    /// Posts records
    DLL.Data posts;
    uint256 public totalPosts;

    /// Events
    event PostAdded(uint id, bytes32 digest, uint hashFunction, uint size);
    event PostUpdated(uint id, bytes32 digest, uint hashFunction, uint size);
    event PostDeleted(uint id, bytes32 digest, uint hashFunction, uint size);
    event Subscribed(address subscriber, SubscriberType subType, uint256 tokenAmount);
    event Unsubscribed(address subscriber, SubscriberType subType, uint256 tokenAmount);

    /// Validate if an address belong to a Contract account
    modifier isContract(address _addr) {
        require(_addr.isContract());
        _;
    }

    /// Validate if the msg.sender owns the PublisherSubscription contract
    modifier isSubscriptionOwner(address _addr) {
        require(PublisherSubscription(_addr).subscriber() == msg.sender);
        _;
    }

    /// Validate if correct SubscriberType is sent
    modifier isValidSubscriber(uint8 _subType) {
        require(_subType == uint8(SubscriberType.FAN)
            || _subType == uint8(SubscriberType.RELAY),
            "Subscriber must be FAN or RELAY");
        _;
    }

    /** @dev Contract constructor
      * @param _defaultRelayAddress register at least a relayer. In can be owned by the publisher or Supporteth
      * @param _tokenAddress Token address
      */
    constructor(
        address _defaultRelayAddress,
        address _tokenAddress
        ) public isContract(_tokenAddress) {

            relayers[_defaultRelayAddress] = Relayer(true, 0);
            tokenAddress = _tokenAddress;
            totalPosts = 0;
    }

    /**
     * @dev Add an IPFS Multihash pointer to the registry
     * @param _digest digest of IPFS Multihash
     * @param _hashFunction hashFcn of IPFS Multihash
     * @param _size size of IPFS Multihash
     */
    function addPost(bytes32 _digest, uint256 _hashFunction, uint256 _size)
        public onlyOwner {
        if(posts.isEmpty()) {
            posts.insert(0, totalPosts+1, 0, block.timestamp, _digest, _hashFunction, _size);
        } else {
            posts.insert(totalPosts, totalPosts+1, posts.dll[totalPosts].prev,
                block.timestamp, _digest, _hashFunction, _size);
        }
        totalPosts++;
        emit PostAdded(totalPosts, _digest, _hashFunction, _size);

    }

    /**
     * @dev Get a post with id
     * @param _id post id in registry
     * @return (uint, uint, bytes32, uint, uint, uint) post attributes in DLL
     */
    function getPost(uint32 _id)
        public view returns (uint, uint, bytes32, uint, uint, uint) {
        DLL.Node storage hash = posts.dll[_id];
        return (hash.prev, hash.next, hash.digest, hash.hashFunction, hash.size, hash.timestamp);
    }

    /**
     * @dev Update a post IPFS Multihash
     * @param _id post id
     * @param _digest digest of IPFS Multihash
     * @param _hashFunction hashFcn of IPFS Multihash
     * @param _size size of IPFS Multihash
     * @return bool true if processed
     */
    function updatePost(uint _id, bytes32 _digest, uint _hashFunction, uint _size)
        public onlyOwner returns (bool) {
        DLL.Node storage hash = posts.dll[_id];
        hash.digest = _digest;
        hash.hashFunction = _hashFunction;
        hash.size = _size;
        emit PostUpdated(_id, _digest, _hashFunction, _size);
        return true;
    }

    /**
     * @dev Delete a post from the registry
     * @param _id post id in registry
     * @return bool true if processed
     */
    function deletePost(uint _id) public onlyOwner returns (bool) {
        DLL.Node storage hash = posts.dll[_id];
        posts.remove(_id);
        totalPosts--;
        emit PostDeleted(_id, hash.digest, hash.hashFunction, hash.size);
        return true;
    }

    /**
     * @dev Register a subscriber
     * @param _subscription PublisherSubscription contract address
     * @param _subType SubscriberType
     */
    function subscribe(address _subscription, SubscriberType _subType)
        external isContract(_subscription) isSubscriptionOwner(_subscription)
        isValidSubscriber(uint8(_subType)) {

            if(_subType == SubscriberType.RELAY) {
                require(!relayers[_subscription].active, "Relayer subscriber already registered");
                subscribers[_subscription] = Subscriber(true, _subType, 0);
                relayers[_subscription] = Relayer(true, 0);
                emit Subscribed(_subscription, _subType, 0);
            } else { /// FAN
                require(!subscribers[_subscription].active, "Subscriber already registered");
                require(_subscription.isContract(), "Address must be a PublisherSubscription contract");
                uint256 amount = PublisherSubscription(_subscription).getSubscriptionAmount();
                subscribers[_subscription] = Subscriber(true, _subType, amount);
                emit Subscribed(_subscription, _subType, amount);
            }
    }

    /**
     * @dev Remove a subscription from the registry
     * @param _subscription PublisherSubscription contract address
     */
    function unsubscribe(address _subscription)
        external isContract(_subscription) isSubscriptionOwner(_subscription) {
        require(subscribers[_subscription].active, "Subscription is not active");

        Subscriber storage sub = subscribers[_subscription];
        emit Unsubscribed(_subscription, sub.subType, sub.amount);
        delete subscribers[_subscription];
    }

    /**
     * @dev Check if a Relayer is active
     * @param _relay Relayer account address
     * @return bool true if Relayer is active
     */
    function isActiveRelay(address _relay) public view returns (bool) {
        return subscribers[_relay].active &&
            subscribers[_relay].subType == SubscriberType.RELAY;
    }

}
