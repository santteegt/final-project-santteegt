pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SupportEthToken.sol";

/// @title Contract representing a token holder behaviour
contract TokenHolder {

    SupportEthToken token;

    constructor(address tokenAddress) public {
        token = SupportEthToken(tokenAddress);
    }

    /// @dev test that isMinter of the contract can add a minter
    function addMinter(address _to) public returns (bool success) {
        (success, ) = address(token)
            .call(abi.encodeWithSignature("addMinter(address)", _to));
    }

    /// @dev test that only token holders are able to transfer tokens
    function transfer(address _to, uint256 _value) public returns (bool success) {
        (success, ) = address(token)
            .call(abi.encodeWithSignature("transfer(address, uint256)", _to, _value));
    }

    /// @dev test that a token holder is able to approve spending to another indiviual
    function approve(address _to, uint256 _value) public returns (bool success) {
        (success, ) = address(token)
            .call(abi.encodeWithSignature("approve(address, uint256)", _to, _value));

    }
}

/// @title Contract representing a token holder/buyer behaviour
contract TokenBuyer {

    SupportEthToken token;

    constructor(address tokenAddress) public {
        token = SupportEthToken(tokenAddress);
    }

    /// @dev test that an indiviual with allowace is able to transfer tokens
    function transferFrom(address _from, address _to, uint256 _value)
        public returns (bool success) {
        (success, ) = address(token).call(
            abi.encodeWithSignature("transferFrom(address, address, uint256)",
                _from, _to, _value));
    }

}

/// @title Test suite for the TestSupportethToken contract
contract TestSupportethToken {

    SupportEthToken token;
    TokenHolder tokenHolder;
    TokenBuyer tokenBuyer;

    function beforeAll() public {
        token = new SupportEthToken();
        tokenHolder = new TokenHolder(address(token));
        tokenBuyer = new TokenBuyer(address(token));
    }

    /**
     * @dev Test token is setup correctly
     * @notice Verify token properties are correct and contract creator has a
     * minter role
     */
    function testTokenSetup() public {
        Assert.equal(token.name(), "SupportEth", "Wrong Token name");
        Assert.equal(token.symbol(), "SETH", "Wrong Token symbol");
        Assert.equal(uint(token.decimals()), uint(18), "Wrong Token decimal precision");
        Assert.equal(token.isMinter(address(this)), true, "Caller does not have a minter role");
    }

    /**
     * @dev Test minting rights
     * @notice Verify token cannot be minted by unauthorized addresses
     */
    function testTokenOwnership() public {
        Assert.isFalse(token.isMinter(address(tokenHolder)), "Unauthorized Token holder has a minter role");
        Assert.isFalse(tokenHolder.addMinter(address(tokenBuyer)), "Unauthorized Token holder has an add minter role");
        Assert.isTrue(token.mint(address(tokenHolder), 100), "Failed minting tokens");

    }

    /**
     * @dev Test token holder balance management
     * @notice Verify minted tokens are in balance and that cannot transfer
     * more tokens than current balance
     */
    function testTokenHolderBalance() public {
        Assert.equal(uint(token.balanceOf(address(tokenHolder))), uint(100),
            "Incorrect balance for token holder");
        Assert.isFalse(tokenHolder.transfer(address(tokenBuyer), 100),
            "Token should not transfer if insufficient funds");
    }

    /**
     * @dev Test token allowance features
     * @notice Verify that only allowed tokens can be transferred by another address
     */
    function testTokenAllowance() public {
        Assert.equal(uint(token.allowance(address(tokenHolder), address(tokenBuyer))),
            uint(0), "Token allowance should be zero");
        // Assert.isTrue(tokenHolder.approve(address(tokenBuyer), 10),
        //     "Failed to approve spending tokens to another address");
        // Assert.equal(uint(token.allowance(address(tokenHolder), address(tokenBuyer))),
        //     uint(10), "Incorrect token allowance");
        // Assert.isTrue(tokenBuyer.transferFrom(address(tokenHolder), address(this), 5),
        //     "Failed transfering tokens in regard of token holder");
        // Assert.equal(uint(token.balanceOf(address(this))), uint(5),
        //     "Tokens were not transfered");
        Assert.isFalse(tokenBuyer.transferFrom(address(tokenHolder), address(this), 10),
            "Tokens should not be transfered due to insufficient allowance");
    }

}
