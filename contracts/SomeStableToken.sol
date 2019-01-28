pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

/// @title This is just some stable token to test subscription payments using an ERC20 token
contract SomeStableToken is ERC20Detailed("SomeStableToken", "SST", 18), ERC20Mintable {

  constructor() public { }

}
