# 🔒 TimeVault NFT - Next.js App

> Complete Web3 app with native WalletConnect, MetaMask, and multi-wallet support

## ✨ Features

- 🦊 **Native WalletConnect** - MetaMask, Trust Wallet, Coinbase, Rainbow, etc.
- 🔐 **Time-locked vaults** with automatic NFT minting
- 🎁 **Gift mode** - Mint directly to recipients
- 🔒 **Encrypted images** - Reveal surprises after unlock
- 🔥 **Auto-burn** - NFT destroyed after withdrawal
- 📱 **Responsive** - Works on mobile and desktop
- ⚡ **Base Network** - Fast and cheap transactions

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- A wallet (MetaMask, Trust Wallet, etc.)
- Base ETH for gas fees

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/timevault-nft.git
cd timevault-nft

# Install dependencies
npm install
# or
yarn install
```

### 3. Configuration

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Fill in your environment variables:

#### **A. Get WalletConnect Project ID**
1. Go to https://cloud.walletconnect.com
2. Create a new project
3. Copy the Project ID
4. Add to `.env.local`: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id`

#### **B. Get Pinata API Keys**
1. Go to https://pinata.cloud
2. Sign up (free tier is enough)
3. Go to API Keys → New Key
4. Enable `pinFileToIPFS` and `pinJSONToIPFS`
5. Copy both keys to `.env.local`

#### **C. Deploy Smart Contract**
1. Deploy `Vault.sol` to Base Sepolia (testnet) or Base Mainnet
2. Copy the contract address
3. Add to `.env.local`: `NEXT_PUBLIC_CONTRACT_ADDRESS=0x...`

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
timevault-nft/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page
│   ├── providers.tsx        # Wagmi + WalletConnect setup
│   └── globals.css          # Global styles
├── components/
│   ├── CreateVault.tsx      # Create vault form
│   ├── WithdrawVault.tsx    # Withdraw & burn
│   └── DecryptImage.tsx     # Decrypt encrypted images
├── config/
│   ├── wagmi.ts             # Wagmi configuration
│   └── abi.ts               # Contract ABI
├── public/                  # Static assets
├── .env.local.example       # Environment template
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind CSS config
└── next.config.js           # Next.js config
```

## 🔧 Configuration Details

### Wagmi Setup (`config/wagmi.ts`)

The app uses Wagmi v2 with WalletConnect v2:

```typescript
import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});
```

### Contract ABI (`config/abi.ts`)

Make sure to include all functions from your deployed contract:
- `deposit(unlockTime, tokenURI, includeGasReserve)`
- `depositFor(recipient, unlockTime, tokenURI, includeGasReserve)`
- `withdraw(vaultId)`
- `burn(tokenId)`
- `getVaultInfo(vaultId)`
- `getTokenIdByVault(vaultId)`

## 🎯 Usage

### Create a Vault

1. **Connect Wallet** - Click "Connect Wallet" and choose your wallet
2. **Upload Image** - Select an NFT image
3. **Upload to IPFS** - Click "Upload to IPFS" and wait
4. **Set Parameters**:
   - ETH amount to lock
   - Unlock date
   - Optional: Encrypt image
   - Optional: Gift to someone else
5. **Lock & Mint** - Confirm transaction in your wallet

### Withdraw & Burn

1. Go to "Withdraw" tab
2. Enter your Vault ID
3. View vault information
4. Click "Withdraw ETH & Burn NFT"
5. Automatic 2-step process:
   - Step 1: Withdraw ETH
   - Step 2: Burn NFT (automatic)

### Decrypt Encrypted Image

1. Go to "Decrypt Image" tab
2. Enter Vault ID
3. Enter encrypted image IPFS hash
4. Click "Decrypt & View Image"
5. Download the revealed image

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables
5. Deploy!

### Other Platforms

The app works on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted

## 🔐 Security Notes

- **Private keys never exposed** - Using WalletConnect/MetaMask
- **Client-side signing** - All transactions signed in user's wallet
- **No backend required** - Fully decentralized
- **IPFS storage** - Images stored on decentralized network

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'vault-purple': '#667eea',  // Change this
      'vault-pink': '#764ba2',     // And this
    },
  },
}
```

### Change Network

Edit `config/wagmi.ts`:

```typescript
chains: [base, baseSepolia, mainnet, polygon]
```

## 🐛 Troubleshooting

### "Module not found" error

```bash
rm -rf node_modules package-lock.json
npm install
```

### WalletConnect not working

1. Check your Project ID is correct
2. Make sure it's in `.env.local` (not `.env`)
3. Restart the dev server

### Transactions failing

1. Check you're on the correct network (Base)
2. Make sure contract address is correct
3. Verify you have enough ETH for gas

### IPFS upload failing

1. Check Pinata API keys
2. Verify image size < 5MB
3. Check console for errors

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Project ID | ✅ Yes |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed contract address | ✅ Yes |
| `NEXT_PUBLIC_PINATA_API_KEY` | Pinata API key | ✅ Yes |
| `NEXT_PUBLIC_PINATA_SECRET_KEY` | Pinata secret key | ✅ Yes |

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📄 License

MIT License - see LICENSE file

## 🙏 Credits

- [Wagmi](https://wagmi.sh) - React Hooks for Ethereum
- [WalletConnect](https://walletconnect.com) - Wallet connection
- [Pinata](https://pinata.cloud) - IPFS pinning
- [Base](https://base.org) - Ethereum L2

---

**⭐ Star this repo if you find it useful!**

Made with ❤️ for the Web3 community
