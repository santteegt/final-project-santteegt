pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PublisherSubscription.sol";
import "../contracts/Publisher.sol";

/// @title Contract representing a Publisher
contract PubPerson {

    Publisher pubContract;

    constructor() public {

    }

    function createContract(address _relayer, address _token)
        public returns (address) {
        pubContract = new Publisher(_relayer, _token);
        return address(pubContract);
    }

    function post(bytes32 _digest, uint256 _hashFunction, uint256 _size)
        public returns (bool success) {
        pubContract.addPost(_digest, _hashFunction, _size);
        success = true;
    }

    function updatePost(uint _id, bytes32 _digest, uint256 _hashFunction,
        uint256 _size) public returns (bool success) {
        success = pubContract.updatePost(_id, _digest, _hashFunction, _size);
    }

    function deletePost(uint _id)
        public returns (bool success) {
        success = pubContract.deletePost(_id);
    }


}

/// @title Test suite for the Publisher smart contract
contract TestPublisher {

    Publisher pubContract;
    PubPerson publisher;

    struct IPFSHash {
        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
    }

    /// A post example
    IPFSHash post1 = IPFSHash(
        keccak256("someHash"),
        18, 32);

    /// Another post example
    IPFSHash post2 = IPFSHash(
        keccak256("someOtherHash"),
        18, 32);

    function beforeAll() public {
        publisher = new PubPerson();
        address pubAddress = publisher
            .createContract(address(this), DeployedAddresses.SomeStableToken());
        pubContract = Publisher(pubAddress);
    }

    /// @dev test adding a post to the Publisher registry
    function testAddPost() public {
        Assert.equal(pubContract.totalPosts(), 0, "Publisher should have zero posts");
        bool success = publisher.post(post1.digest, post1.hashFunction, post1.size);
        Assert.isTrue(success, "Publisher should be able to post an IPFS pointer");
        Assert.equal(pubContract.totalPosts(), 1, "Publisher should have one post");

        /// test the onlyOwner modifier
        (success, ) = address(pubContract).call(
            abi.encodeWithSignature("addPost(bytes32, uint8, uint8)",
                post1.digest, post1.hashFunction, post1.size));
        Assert.isFalse(success, "New posts cannot be inserted by other individuals");

    }

    /// @dev test CRUD features of DLL library used to store publisher posts
    function testPostsDoubleLinkedLIstCRUD() public {
        Assert.equal(pubContract.totalPosts(), 1, "Publisher should have one posts");

        /// Check DLL structure
        (uint _prev, uint _next, bytes32 _digest, uint _hashFcn,
            uint _size, uint _timestamp) = pubContract.getPost(1);
        Assert.equal(_digest, keccak256("someHash"), "Post1 Node digest differ");
        Assert.equal(_prev, 0, "Post1 Previous node should be zero");
        Assert.equal(_next, 0, "Post1 Previous node should be zero");

        /// Add new Post
        bool success = publisher.post(post2.digest, post2.hashFunction, post2.size);
        Assert.isTrue(success, "Publisher should be able to post an IPFS pointer");
        Assert.equal(pubContract.totalPosts(), 2, "Publisher should have two posts");

        /// Check DLL structure
        (_prev, _next, _digest, _hashFcn,
            _size, _timestamp) = pubContract.getPost(1);
        Assert.equal(_prev, 0, "Post1 Previous node should be 0");
        Assert.equal(_next, 2, "Post1 Previous node should be 2");
        (_prev, _next, _digest, _hashFcn,
            _size, _timestamp) = pubContract.getPost(2);
        Assert.equal(_digest, keccak256("someOtherHash"), "Post2 Node digest differ");
        Assert.equal(_prev, 1, "Post2 Previous node should be 1");
        Assert.equal(_next, 0, "Post2 Previous node should be 0");

        /// Update a post
        success = publisher.updatePost(1, keccak256("newHash"),
            post1.hashFunction, post1.size);
        Assert.isTrue(success, "Publisher should be able to update a post");
        (_prev, _next, _digest, _hashFcn,
            _size, _timestamp) = pubContract.getPost(1);
        Assert.equal(_digest, keccak256("newHash"), "Post1 Node not updated");
        Assert.equal(_prev, 0, "Post1 Previous node should be 0");
        Assert.equal(_next, 2, "Post1 Previous node should be 2");

        /// Remove a post
        success = publisher.deletePost(1);
        Assert.isTrue(success, "Publisher should be able to delete a post");
        (_prev, _next, _digest, _hashFcn,
            _size, _timestamp) = pubContract.getPost(1);
        Assert.notEqual(_digest, keccak256("someHash"), "Post1 Node not deleted");
        Assert.equal(_prev, 0, "Post1 Previous node should be 0");
        Assert.equal(_next, 0, "Post1 Previous node should be 0");
        (_prev, _next, _digest, _hashFcn,
            _size, _timestamp) = pubContract.getPost(2);
        Assert.equal(_prev, 0, "Post2 Previous node should be 0");
        Assert.equal(_next, 0, "Post2 Previous node should be 0");
    }

    /// @dev test that default system relayer cannot be a suscriber
    function testDefaultRelayNotASubscriber() public {
        (bool isRelayer, )  = pubContract.relayers(address(this));
        Assert.isTrue(isRelayer, "Default relayer not found");
        Assert.isFalse(pubContract.isActiveRelay(address(this)),
            "Default relay should not be considered as a subscriber");
    }

}
