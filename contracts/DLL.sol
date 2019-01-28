pragma solidity ^0.5.0;

/** @title Double Link List library
 *  @notice inspired by work found in https://github.com/skmgoldin/sol-dll
 */
library DLL {

    uint constant NULL_NODE_ID = 0;

    /// IPFS Multihash
    struct Node {
        uint next;
        uint prev;
        uint256 timestamp;
        bytes32 digest;
        uint hashFunction;
        uint size;
    }

    /// DLL Structure
    struct Data {
        mapping(uint => Node) dll;
    }

    /**
     * @dev check if list is isEmpty (only NULL node is present)
     * @param self DLL
     * @return bool true if exists
     */
    function isEmpty(Data storage self) public view returns (bool) {
        return getStart(self) == NULL_NODE_ID;
    }

    /**
     * @dev check if certain node has data
     * @param self DLL
     * @param _curr node id to find
     * @return bool true if node is in the DLL
     */
    function contains(Data storage self, uint _curr) public view returns (bool) {
        if (isEmpty(self) || _curr == NULL_NODE_ID) {
          return false;
        }

        bool isSingleNode = (getStart(self) == _curr) && (getEnd(self) == _curr);
        bool isNullNode = (getNext(self, _curr) == NULL_NODE_ID) && (getPrev(self, _curr) == NULL_NODE_ID);
        return isSingleNode || !isNullNode;
    }

    /**
     * @dev Get next node in DLL
     * @param self DLL
     * @param _curr current Node
     * @return int next node id
     */
    function getNext(Data storage self, uint _curr) public view returns (uint) {
        return self.dll[_curr].next;
    }

    /**
     * @dev Get prev node in DLL
     * @param self DLL
     * @param _curr current Node
     * @return int previous node id
     */
    function getPrev(Data storage self, uint _curr) public view returns (uint) {
        return self.dll[_curr].prev;
    }

    /**
     * @dev Get initial node in DLL
     * @param self DLL
     * @return initial node id
     */
    function getStart(Data storage self) public view returns (uint) {
        return getNext(self, NULL_NODE_ID);
    }

    /**
     * @dev Get final node in DLL
     * @param self DLL
     * @return final node id
     */
    function getEnd(Data storage self) public view returns (uint) {
        return getPrev(self, NULL_NODE_ID);
    }

    /**
     * @dev Inserts a new node between _prev and _next. When inserting a node already existing in
     * the list it will be automatically removed from the old position.
     * @param self DLL
     * @param _prev the node which _new will be inserted after
     * @param _curr the id of the new node being inserted
     * @param _next the node which _new will be inserted before
     * @param _timestamp timestamp of node being inserted
     * @param _digest digest of IPFS Multihash
     * @param _hashFunction hashFcn of IPFS Multihash
     * @param _size size of IPFS Multihash
     */
    function insert(Data storage self, uint _prev, uint _curr, uint _next,
        uint256 _timestamp, bytes32 _digest, uint _hashFunction, uint _size) public {

        require(_curr != NULL_NODE_ID);

        remove(self, _curr);

        require(_prev == NULL_NODE_ID || contains(self, _prev));
        require(_next == NULL_NODE_ID || contains(self, _next));

        require(getNext(self, _prev) == _next);
        require(getPrev(self, _next) == _prev);

        self.dll[_curr].prev = _prev;
        self.dll[_curr].next = _next;
        /// Fill custom IPFS Multihash data
        self.dll[_curr].timestamp = _timestamp;
        self.dll[_curr].digest = _digest;
        self.dll[_curr].hashFunction = _hashFunction;
        self.dll[_curr].size = _size;

        self.dll[_prev].next = _curr;
        self.dll[_next].prev = _curr;
    }

    /**
     * @dev remove a node from DLL
     * @param self DLL
     * @param _curr id of node to remove
     */
    function remove(Data storage self, uint _curr) public {
        if (!contains(self, _curr)) {
          return;
        }

        uint next = getNext(self, _curr);
        uint prev = getPrev(self, _curr);

        self.dll[next].prev = prev;
        self.dll[prev].next = next;

        delete self.dll[_curr];
    }
}
