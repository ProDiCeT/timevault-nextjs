
# 🔒 TimeVault NFT - Next.js Web3 App

> Complete decentralized app with native WalletConnect, encrypted NFT gifts, and auto-burn on withdrawal

## ✨ Features

### 🔐 Core Features
- **Time-locked vaults** - Lock ETH until a specific date with smart contract security
- **NFT proof-of-lock** - ERC-721 NFT minted as proof (metadata on IPFS)
- **Auto-burn mechanism** - NFT automatically destroyed after withdrawal
- **Gas reserve option** - Pay recipient's gas fees in advance

### 🎁 Gift Features
- **Direct minting** - Mint NFT directly to recipient's address
- **Transfer support** - Transfer existing vault NFTs to others
- **Encrypted images** - Hide real image until unlock date (perfect for surprises)
- **Decryption tool** - Reveal encrypted images after withdrawal

### 🦊 Wallet Support
- **WalletConnect v2** - Connect with 300+ wallets
- **MetaMask** - Browser extension and mobile
- **Trust Wallet** - Mobile wallet
- **Coinbase Wallet** - Integrated exchange wallet
- **Rainbow, Argent, Safe** - And many more!

### ⚡ Technical
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe code
- **Wagmi v2** - Modern React hooks for Ethereum
- **Web3Modal v4** - Beautiful wallet connection UI
- **Tailwind CSS** - Utility-first styling
- **Base Network** - Fast and cheap L2 transactions

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Deployment](#-deployment)
- [Customization](#-customization)




---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** installed
- **npm** or **yarn**
- A **wallet** (MetaMask, Trust Wallet, etc.)
- **Base ETH** for gas fees (or Base Sepolia testnet ETH)

### 5-Minute Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/timevault-nft.git
cd timevault-nft

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your keys

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

---

## 📦 Installation

### Step 1: Create Project

```bash
# Option A: Clone this repo
git clone https://github.com/yourusername/timevault-nft.git
cd timevault-nft

# Option B: Start from scratch
mkdir timevault-nft && cd timevault-nft
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
```

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install wagmi@^2.5.7 viem@^2.7.13 @tanstack/react-query@^5.0.0

# WalletConnect
npm install @web3modal/wagmi@^4.0.0

# UI and utilities
npm install lucide-react axios crypto-js

# TypeScript types
npm install -D @types/crypto-js
```

### Step 3: Create Folder Structure

```bash
mkdir -p config components
```

---

## ⚙️ Configuration

### 1. Get WalletConnect Project ID

1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Sign up (free)
3. Create New Project
4. Copy your **Project ID**

### 2. Get Pinata API Keys

1. Go to [pinata.cloud](https://pinata.cloud)
2. Sign up (free tier: 1GB storage)
3. Go to **API Keys** → **New Key**
4. Enable `pinFileToIPFS` and `pinJSONToIPFS`
5. Copy both keys

### 3. Deploy Smart Contract

Deploy `Vault.sol` to Base Sepolia (testnet) or Base Mainnet:

```bash
# Using Hardhat
npx hardhat run scripts/deploy.js --network baseSepolia

# Using Foundry
forge create Vault --rpc-url $BASE_RPC --private-key $PRIVATE_KEY
```

Copy the deployed contract address.

### 4. Configure Environment Variables

Create `.env.local`:

```bash
# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_from_walletconnect

# Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress

# IPFS (Pinata)
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key
```

⚠️ **Important**: Never commit `.env.local` to Git!

---

## 📁 Project Structure

```
timevault-nft/
├── app/
│   ├── layout.tsx           # Root layout with Providers
│   ├── page.tsx             # Main app page (tabs)
│   ├── providers.tsx        # Wagmi + WalletConnect setup
│   └── globals.css          # Global styles
├── components/
│   ├── CreateVault.tsx      # Create vault form + IPFS upload
│   ├── WithdrawVault.tsx    # Withdraw ETH + auto burn NFT
│   └── DecryptImage.tsx     # Decrypt encrypted images
├── config/
│   ├── wagmi.ts             # Wagmi configuration + chains
│   └── abi.ts               # Smart contract ABI
├── public/                  # Static assets
├── .env.local               # Environment variables (gitignored)
├── .env.local.example       # Environment template
├── package.json             # Dependencies
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
└── README.md                # This file
```

---

## 📖 Usage Guide

### 1. Connect Wallet

Click **"Connect Wallet"** button → Choose your wallet (MetaMask, Trust, etc.)

### 2. Create a Vault

**Tab: Create Vault**

1. **Upload Image**
   - Click to upload PNG/JPG
   - Image will be stored on IPFS
   - Click "Upload to IPFS"

2. **Set Parameters**
   - ETH amount to lock (e.g., 0.1 ETH)
   - Unlock date (future date)

3. **Options**
   - ☐ Encrypt image (reveal only at unlock)
   - ☐ Gift to someone else
     - Enter recipient address
     - ☑ Include gas reserve (+0.001 ETH)

4. **Lock & Mint**
   - Click "Lock ETH & Mint NFT"
   - Confirm transaction in wallet
   - Wait for confirmation (5-10 seconds)

### 3. Withdraw ETH

**Tab: Withdraw**

1. Enter your **Vault ID**
2. View vault information:
   - Owner address
   - Locked amount
   - Unlock date
   - Status (locked/unlocked)

3. Click **"Withdraw ETH & Burn NFT"**
4. Two automatic transactions:
   - Transaction 1: Withdraw ETH
   - Transaction 2: Burn NFT (automatic after 3 seconds)

5. Done! ETH received, NFT destroyed

### 4. Decrypt Encrypted Image

**Tab: Decrypt Image**

1. Enter **Vault ID**
2. Enter **Encrypted Image IPFS Hash**
   - Provided by the sender
   - Format: `Qm...` or `baf...`

3. Click **"Decrypt & View Image"**
4. Image revealed! Download it to keep forever

---

## 🌐 Deployment

### Option 1: Vercel (Recommended)

**1. Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/timevault-nft.git
git push -u origin main
```

**2. Deploy on Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Import Project"**
3. Connect your GitHub repo
4. Add environment variables:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_PINATA_API_KEY`
   - `NEXT_PUBLIC_PINATA_SECRET_KEY`
5. Click **Deploy**!

Your app is live at `https://your-project.vercel.app` 🎉

### Option 2: Other Platforms

**Netlify**

```bash
npm run build
netlify deploy --prod
```

**Cloudflare Pages**

```bash
npm run build
# Connect via Cloudflare dashboard
```

**Self-hosted (VPS)**

```bash
npm run build
npm start
# Setup Nginx reverse proxy + SSL
```

---

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'vault-purple': '#667eea',  // Primary color
      'vault-pink': '#764ba2',    // Secondary color
    },
  },
}
```

### Add More Chains

Edit `config/wagmi.ts`:

```typescript
import { mainnet, polygon, arbitrum } from 'wagmi/chains';

export const config = createConfig({
  chains: [base, baseSepolia, mainnet, polygon, arbitrum],
  // ...
});
```

### Customize WalletConnect Modal

Edit `app/providers.tsx`:

```typescript
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'dark',           // 'light' | 'dark'
  themeVariables: {
    '--w3m-accent': '#667eea',
  },
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
  ],
});
```

### Change Network

Update `.env.local`:

```bash
# For Base Mainnet
NEXT_PUBLIC_CHAIN_ID=8453

# For Base Sepolia Testnet
NEXT_PUBLIC_CHAIN_ID=84532
```

---

## 🐛 Troubleshooting

### "Module not found" error

```bash
rm -rf node_modules package-lock.json
npm install
```

### WalletConnect not connecting

1. **Check Project ID**
   - Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `.env.local`
   - Make sure it starts with `NEXT_PUBLIC_`

2. **Restart dev server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Clear browser cache**
   - Open DevTools (F12)
   - Application → Clear storage

### Transactions failing

1. **Wrong network**
   - Switch to Base in your wallet
   - Check contract is deployed on Base

2. **Insufficient gas**
   - Make sure you have enough ETH for gas
   - Base: ~$0.01-0.05 per transaction

3. **Contract address wrong**
   - Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`
   - Check it's the correct address on Base

### IPFS upload failing

1. **Check Pinata keys**
   - Verify both API key and secret in `.env.local`
   - Test keys at [pinata.cloud/keys](https://pinata.cloud/keys)

2. **Image too large**
   - Reduce image size < 5MB
   - App auto-optimizes to ~500KB

3. **Network error**
   - Check internet connection
   - Try again in a few minutes

### Build errors

```bash
# Test build locally
npm run build

# Common fixes:
npm install --save-dev typescript @types/react @types/node
rm -rf .next
npm run build
```

---

## 🔐 Security

### Best Practices

- ✅ **Never commit `.env.local`** to Git
- ✅ **Never share private keys**
- ✅ **Test on testnet first** (Base Sepolia)
- ✅ **Verify contract** on BaseScan before using
- ✅ **Use hardware wallet** for large amounts
- ✅ **Audit smart contract** before mainnet deployment

### Security Features

- 🔒 **ReentrancyGuard** on all state-changing functions
- 🔒 **OpenZeppelin contracts** (industry standard)
- 🔒 **Owner-only withdrawals** (only NFT owner can withdraw)
- 🔒 **Time-lock validation** (max 10 years)
- 🔒 **Withdrawal before burn** (must withdraw before burning NFT)

---

## 📊 Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js | 14.0.4 |
| **Language** | TypeScript | 5.3.3 |
| **Web3** | Wagmi | 2.5.7 |
| **Web3** | Viem | 2.7.13 |
| **Wallet** | Web3Modal | 4.0.0 |
| **UI** | Tailwind CSS | 3.3.6 |
| **Icons** | Lucide React | 0.294.0 |
| **Storage** | IPFS (Pinata) | - |
| **Blockchain** | Base (Ethereum L2) | - |

---

## 🎯 Use Cases

### Personal Use
- 💰 **Savings goals** - Lock ETH until target date
- 🎯 **DCA strategy** - Time-locked investment releases
- 🔒 **Cold storage** - Extra security layer

### Gifting
- 🎂 **Birthday gifts** - ETH unlocks on birthday + encrypted message
- 🎓 **Graduation gifts** - Locked until graduation day
- 💍 **Engagement/Wedding** - Romantic surprise with hidden message
- 👶 **Baby trust fund** - Lock until child turns 18
- 🎄 **Holiday gifts** - Christmas/New Year surprises

### Business
- 💼 **Vesting schedules** - Employee token vesting
- 🤝 **Escrow services** - Time-locked payments
- 📅 **Subscription models** - Prepaid time-locked access

---

## 🧪 Testing

### Test Locally

```bash
# Run dev server
npm run dev

# Test build
npm run build
npm start
```

### Test on Base Sepolia

1. Get testnet ETH from [Base Sepolia faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Deploy contract to Base Sepolia
3. Update `.env.local` with testnet contract address
4. Test all features with small amounts

### Test Checklist

- [ ] Wallet connects (MetaMask, WalletConnect)
- [ ] Image uploads to IPFS
- [ ] Vault creation works
- [ ] NFT mints correctly
- [ ] Can view vault info
- [ ] Withdrawal works after unlock date
- [ ] NFT burns automatically
- [ ] Encrypted image decrypts correctly
- [ ] Gift mode works (mint to another address)
- [ ] Transfer NFT works

---

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Wagmi Docs](https://wagmi.sh)
- [WalletConnect Docs](https://docs.walletconnect.com)
- [Base Docs](https://docs.base.org)
- [Viem Docs](https://viem.sh)

### Tools
- [BaseScan](https://basescan.org) - Block explorer
- [Pinata](https://pinata.cloud) - IPFS pinning
- [WalletConnect Cloud](https://cloud.walletconnect.com) - Project management
- [Remix IDE](https://remix.ethereum.org) - Smart contract testing

### Community
- [Base Discord](https://discord.gg/buildonbase)
- [WalletConnect Discord](https://discord.walletconnect.com)
- [Wagmi GitHub](https://github.com/wevm/wagmi)
---

## 📝 License

This project is licensed under the **MIT License**.

```

## 🙏 Acknowledgments

- **OpenZeppelin** - Secure smart contract libraries
- **WalletConnect** - Universal wallet connection protocol
- **Wagmi Team** - Excellent React hooks for Ethereum
- **Base Team** - Fast and cheap L2 network
- **Pinata** - Reliable IPFS pinning service
- **Vercel** - Best hosting for Next.js 

---

<div align="center">

---

**Made with ❤️ by dnapog.base.eth**
