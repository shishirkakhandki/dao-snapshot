// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.19;

contract Box is Ownable {
    uint value;

    event valueChanged(uint);

    function store(uint _value) public onlyOwner {
        value = _value;
        emit valueChanged(value);
    }

    function retreive() public view returns (uint) {
        return value;
    }
}
