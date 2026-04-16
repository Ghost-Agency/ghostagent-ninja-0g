// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/GhostAgentStorageLog.sol";

contract DeployGhostAgentStorageLog is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("ZEROG_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        GhostAgentStorageLog storageLog = new GhostAgentStorageLog();
        console.log("GhostAgentStorageLog deployed at:", address(storageLog));

        vm.stopBroadcast();
    }
}
