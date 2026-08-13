// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DigitalTwinRegistry
 * @dev Manages Digital Twin ownership, on-chain pricing references, and licensing.
 */
contract DigitalTwinRegistry {
    struct TwinRecord {
        string digitalTwinId;
        address creatorWallet;
        uint256 priceMicroUsdc;
        bool isActive;
    }

    mapping(string => TwinRecord) public twins;
    event TwinRegistered(string indexed digitalTwinId, address indexed creatorWallet, uint256 priceMicroUsdc);

    function registerTwin(string memory digitalTwinId, uint256 priceMicroUsdc) external {
        require(twins[digitalTwinId].creatorWallet == address(0), "Twin already registered");

        twins[digitalTwinId] = TwinRecord({
            digitalTwinId: digitalTwinId,
            creatorWallet: msg.sender,
            priceMicroUsdc: priceMicroUsdc,
            isActive: true
        });

        emit TwinRegistered(digitalTwinId, msg.sender, priceMicroUsdc);
    }
}
