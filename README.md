# 💰 VaultPay

A decentralized payment system built using blockchain technology to enable secure, transparent, and trustless transactions.

<img width="1371" height="1003" alt="Screenshot 2026-05-04 230630" src="https://github.com/user-attachments/assets/ba286541-ee3c-400e-b276-a30739b8477d" />


<img width="1552" height="976" alt="Screenshot 2026-05-04 230753" src="https://github.com/user-attachments/assets/a18bd3a4-9d73-48bc-bafc-1e8d0848f521" />

---

## 🚀 Overview

VaultPay is a full-stack blockchain-based payment application that allows users to send and receive funds securely using smart contracts. The system ensures transparency and immutability while eliminating the need for intermediaries.

---

## 🧩 Tech Stack

### 🔹 Frontend

* React / Next.js
* Tailwind CSS
* JavaScript / TypeScript

### 🔹 Backend / Blockchain

* Solidity (Smart Contracts)
* Hardhat
* Web3.js / Ethers.js

### 🔹 Tools & Environment

* Node.js
* MetaMask
* Git & GitHub

---

## ✨ Features

* 🔐 Secure transactions using blockchain
* 📜 Smart contract-based payment system
* 👛 Wallet integration (MetaMask)
* ⚡ Real-time transaction interaction
* 🧾 Transparent and immutable transaction records

---

## 🏗️ Project Structure

```
vaultpay/
│
├── vaultpay-frontend/      # UI and client-side logic
├── vaultpay-blockchain/    # Smart contracts and blockchain setup
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/YOUR_USERNAME/vaultpay.git
cd vaultpay
```

---

### 2️⃣ Setup Blockchain

```
cd vaultpay-blockchain
npm install
npx hardhat compile
npx hardhat node
```

In a new terminal:

```
npx hardhat run scripts/deploy.js --network localhost
```

---

### 3️⃣ Setup Frontend

```
cd ../vaultpay-frontend
npm install
npm run dev
```

---

## 🔗 Usage

1. Connect your MetaMask wallet
2. Ensure you're on the correct network (Localhost / Testnet)
3. Interact with the UI to send/receive payments
4. Transactions are recorded on the blockchain

<img width="1371" height="1003" alt="Screenshot 2026-05-04 230630" src="https://github.com/user-attachments/assets/554d8781-7bf6-4e1a-ac15-60dcafe10c09" />


---

## 📌 Future Improvements

* Add authentication layer
* Improve UI/UX design
* Deploy on a public testnet (Goerli / Sepolia)
* Add transaction history dashboard

---


## 📄 License

This project is open-source and available under the MIT License.

---

## ⭐ Acknowledgements

* Ethereum Documentation
* Hardhat Framework
* Web3 Community

---
