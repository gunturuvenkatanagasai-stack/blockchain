// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ContentHashRegistry
 * @dev Registers immutable SHA-256 hashes of expert knowledge documents on-chain.
 */
contract ContentHashRegistry {
    struct Record {
        string digitalTwinId;
        string contentHashSha256;
        address creatorWallet;
        uint256 timestamp;
    }

    mapping(bytes32 => Record) public records;
    event DocumentRegistered(string indexed digitalTwinId, string contentHashSha256, address indexed creatorWallet, uint256 timestamp);

    function registerDocumentHash(string memory digitalTwinId, string memory contentHashSha256) external {
        bytes32 key = keccak256(abi.encodePacked(digitalTwinId, contentHashSha256));
        require(records[key].timestamp == 0, "Document hash already registered on-chain");

        records[key] = Record({
            digitalTwinId: digitalTwinId,
            contentHashSha256: contentHashSha256,
            creatorWallet: msg.sender,
            timestamp: block.timestamp
        });

        emit DocumentRegistered(digitalTwinId, contentHashSha256, msg.sender, block.timestamp);
    }
}
