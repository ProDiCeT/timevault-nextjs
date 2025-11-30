'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Lock, Gift, Flame, Wallet, Upload, ArrowRight } from 'lucide-react';
import CreateVault from '../components/CreateVault';
import WithdrawVault from '../components/WithdrawVault';
import DecryptImage from '../components/DecryptImage';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [activeTab, setActiveTab] = useState<'create' | 'withdraw' | 'decrypt'>('create');

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-4">
            <Lock className="w-16 h-16" />
            TimeVault NFT
          </h1>
          <p className="text-purple-200 text-xl mb-8">
            Lock ETH with encrypted NFT gifts • Auto-burn on withdrawal
          </p>

          {/* Wallet Connection */}
          <div className="inline-block">
            {!isConnected ? (
              <w3m-button />
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-3 border border-white/20 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-mono">
                    {address?.substring(0, 6)}...{address?.substring(38)}
                  </span>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>

        {isConnected ? (
          <>
            {/* Features Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-purple-400 transition-all">
                <Lock className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Time Lock</h3>
                <p className="text-purple-200">
                  Lock ETH until a specific date with smart contract security
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-pink-400 transition-all">
                <Gift className="w-12 h-12 text-pink-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Encrypted Gifts</h3>
                <p className="text-purple-200">
                  Hide real image until unlock date - perfect for surprises
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-orange-400 transition-all">
                <Flame className="w-12 h-12 text-orange-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Auto Burn</h3>
                <p className="text-purple-200">
                  NFT automatically burns after withdrawal - clean & private
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 bg-white/5 p-2 rounded-xl">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                  activeTab === 'create'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-purple-200 hover:bg-white/10'
                }`}
              >
                🔒 Create Vault
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                  activeTab === 'withdraw'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-purple-200 hover:bg-white/10'
                }`}
              >
                💸 Withdraw
              </button>
              <button
                onClick={() => setActiveTab('decrypt')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                  activeTab === 'decrypt'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-purple-200 hover:bg-white/10'
                }`}
              >
                🔓 Decrypt Image
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              {activeTab === 'create' && <CreateVault />}
              {activeTab === 'withdraw' && <WithdrawVault />}
              {activeTab === 'decrypt' && <DecryptImage />}
            </div>
          </>
        ) : (
          /* Not Connected State */
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 text-center">
            <Wallet className="w-24 h-24 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Connect Your Wallet to Get Started
            </h2>
            <p className="text-purple-200 mb-8">
              Support for MetaMask, WalletConnect, Coinbase Wallet, and more
            </p>
            <w3m-button />
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-purple-300 text-sm">
          <p className="mb-2">
            🌐 Images on IPFS • 🔥 Auto-burn • 🎁 Perfect for gifting • 🔒 Encrypted reveals
          </p>
          <p>Built on Base Network</p>
        </div>
      </div>
    </main>
  );
}
