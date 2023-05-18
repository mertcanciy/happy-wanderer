pragma solidity >=0.8.0 <0.9.0;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Happy is ERC20 {
    constructor() ERC20("Happy Wanderer", "HAPPY") {
        _mint(msg.sender, 1000000*10**18);
    }
}
