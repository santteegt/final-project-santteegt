pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

/// @title Supporteth ERC20 token for governance
contract SupportEthToken is ERC20Detailed("SupportEth", "SETH", 18), ERC20Mintable {

}
