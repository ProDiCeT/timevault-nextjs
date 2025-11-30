'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { Loader2, Flame, DollarSign } from 'lucide-react';
import { CONTRACT_ADDRESS } from '../config/wagmi';
import { VAULT_ABI } from '../config/abi';
import { formatEther } from 'viem';

export default function WithdrawVault() {
  const [vaultId, setVaultId] = useState('');
  const [step, setStep] = useState<'withdraw' | 'burn' | 'done'>('withdraw');
  
  const { writeContract, data: withdrawHash, isPending: isWithdrawPending } = useWriteContract();
  const { writeContract: writeBurn, data: burnHash, isPending: isBurnPending } = useWriteContract();
  
  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } = 
    useWaitForTransactionReceipt({ hash: withdrawHash });
  const { isLoading: isBurnConfirming, isSuccess: isBurnSuccess } = 
    useWaitForTransactionReceipt({ hash: burnHash });

  // Get vault info
  const { data: vaultInfo } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: VAULT_ABI,
    functionName: 'getVaultInfo',
    args: vaultId ? [BigInt(vaultId)] : undefined,
  });

  // Get token ID
  const { data: tokenId } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: VAULT_ABI,
    functionName: 'getTokenIdByVault',
    args: vaultId ? [BigInt(vaultId)] : undefined,
  });

  const handleWithdraw = async () => {
    if (!vaultId) return;

    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: VAULT_ABI,
        functionName: 'withdraw',
        args: [BigInt(vaultId)],
      });
    } catch (error) {
      console.error('Withdraw error:', error);
    }
  };

  const handleBurn = async () => {
    if (!tokenId) return;

    try {
      await writeBurn({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: VAULT_ABI,
        functionName: 'burn',
        args: [tokenId as bigint],
      });
    } catch (error) {
      console.error('Burn error:', error);
    }
  };

  // Auto-burn after successful withdrawal
  if (isWithdrawSuccess && step === 'withdraw' && tokenId) {
    setTimeout(() => {
      setStep('burn');
      handleBurn();
    }, 3000);
  }

  if (isBurnSuccess && step === 'burn') {
    setStep('done');
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Withdraw ETH</h2>

      <div className="bg-red-500/10 border border-red-500 rounded-xl p-4 mb-6">
        <p className="text-red-400 text-sm">
          ⚠️ <strong>Warning:</strong> The NFT will be automatically burned after withdrawal. This action is irreversible!
        </p>
      </div>

      {/* Vault ID Input */}
      <div>
        <label className="block text-white font-semibold mb-2">Vault ID</label>
        <input
          type="number"
          value={vaultId}
          onChange={(e) => setVaultId(e.target.value)}
          placeholder="Enter vault ID"
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
        />
      </div>

      {/* Vault Info Display */}
      {vaultInfo && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-6 space-y-3">
          <h3 className="text-white font-semibold mb-4">Vault Information</h3>
          
          <div className="flex justify-between">
            <span className="text-purple-300">Owner:</span>
            <span className="text-white font-mono">
              {(vaultInfo[0] as string).substring(0, 6)}...{(vaultInfo[0] as string).substring(38)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-purple-300">Amount:</span>
            <span className="text-white font-semibold">
              {formatEther(vaultInfo[1] as bigint)} ETH
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-purple-300">Unlock Date:</span>
            <span className="text-white">
              {new Date(Number(vaultInfo[2] as bigint) * 1000).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-purple-300">Status:</span>
            <span className={`font-semibold ${vaultInfo[4] ? 'text-green-400' : 'text-orange-400'}`}>
              {vaultInfo[4] ? '🔓 Unlocked' : '🔒 Locked'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-purple-300">Withdrawn:</span>
            <span className={`font-semibold ${vaultInfo[3] ? 'text-gray-400' : 'text-green-400'}`}>
              {vaultInfo[3] ? '✅ Yes' : '❌ No'}
            </span>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {(isWithdrawPending || isWithdrawConfirming || step === 'burn' || step === 'done') && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <div className="space-y-4">
            {/* Step 1: Withdraw */}
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isWithdrawSuccess ? 'bg-green-500' : 'bg-purple-500'
              }`}>
                {isWithdrawSuccess ? '✓' : '1'}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">Withdraw ETH</p>
                <p className="text-purple-300 text-sm">
                  {isWithdrawPending && 'Confirm in wallet...'}
                  {isWithdrawConfirming && 'Processing transaction...'}
                  {isWithdrawSuccess && 'ETH withdrawn successfully!'}
                </p>
              </div>
              {(isWithdrawPending || isWithdrawConfirming) && (
                <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              )}
            </div>

            {/* Step 2: Burn */}
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isBurnSuccess ? 'bg-green-500' : step === 'burn' ? 'bg-orange-500' : 'bg-gray-600'
              }`}>
                {isBurnSuccess ? '✓' : '2'}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">Burn NFT</p>
                <p className="text-purple-300 text-sm">
                  {step === 'withdraw' && 'Waiting for withdrawal...'}
                  {(isBurnPending || isBurnConfirming) && 'Burning NFT...'}
                  {isBurnSuccess && 'NFT burned successfully!'}
                </p>
              </div>
              {(isBurnPending || isBurnConfirming) && (
                <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {step === 'withdraw' && !isWithdrawSuccess && (
        <button
          onClick={handleWithdraw}
          disabled={!vaultId || isWithdrawPending || isWithdrawConfirming || !vaultInfo?.[4]}
          className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          {isWithdrawPending || isWithdrawConfirming ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {isWithdrawPending ? 'Confirm in wallet...' : 'Withdrawing...'}
            </>
          ) : (
            <>
              <DollarSign className="w-5 h-5" />
              Withdraw ETH & Burn NFT
            </>
          )}
        </button>
      )}

      {/* Success Message */}
      {step === 'done' && (
        <div className="bg-green-500/20 border border-green-500 rounded-xl p-6 text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h3 className="text-2xl font-bold text-white">Success!</h3>
          <p className="text-green-400">
            ETH withdrawn and NFT burned successfully
          </p>
          
          {withdrawHash && (
            <div className="text-sm text-purple-200">
              <p className="mb-1">Withdraw TX: {withdrawHash.substring(0, 10)}...</p>
              {burnHash && <p>Burn TX: {burnHash.substring(0, 10)}...</p>}
            </div>
          )}

          <button
            onClick={() => {
              setVaultId('');
              setStep('withdraw');
            }}
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            Withdraw Another Vault
          </button>
        </div>
      )}

      {/* Info */}
      {!vaultId && (
        <div className="bg-blue-500/10 border border-blue-500 rounded-xl p-4">
          <p className="text-blue-400 text-sm">
            💡 <strong>Tip:</strong> Enter your vault ID to see details and withdraw. The vault must be unlocked (past the unlock date) to withdraw.
          </p>
        </div>
      )}
    </div>
  );
}
