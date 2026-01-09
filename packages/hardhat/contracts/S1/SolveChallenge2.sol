//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IChallenge2 {
    function justCallMe() external;
}

contract SolveChallenge2 {
    function callChallenge2(address _challengeAddress) public {
        IChallenge2(_challengeAddress).justCallMe();
    }
}