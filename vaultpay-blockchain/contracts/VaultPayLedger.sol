// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VaultPayLedger {
    struct Transaction {
        address sender;
        bytes32 recipientHash; // ✅ store hashed recipient instead of string
        uint256 amount;
        string riskLevel;
        uint256 timestamp;
    }

    Transaction[] public transactions;

    event TransactionLogged(
        address indexed sender,
        bytes32 recipientHash, // ✅ changed from string to bytes32
        uint256 amount,
        string riskLevel,
        uint256 timestamp
    );

    /**
     * Log transaction with hashed recipient
     */
    function logTransaction(
        bytes32 recipientHash,
        uint256 amount,
        string memory riskLevel
    ) public {
        transactions.push(Transaction(msg.sender, recipientHash, amount, riskLevel, block.timestamp));
        emit TransactionLogged(msg.sender, recipientHash, amount, riskLevel, block.timestamp);
    }

    /**
     * Retrieve all transactions
     */
    function getAllTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }
}
