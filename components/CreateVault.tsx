'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Upload, Lock, Loader2 } from 'lucide-react';
import { CONTRACT_ADDRESS, PINATA_API_KEY, PINATA_SECRET_KEY } from '../config/wagmi';
import { VAULT_ABI } from '../config/abi';
import axios from 'axios';

export default function CreateVault() {
  const { address } = useAccount();
  const [ethAmount, setEthAmount] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [encryptImage, setEncryptImage] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [includeGasReserve, setIncludeGasReserve] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState('');
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToIPFS = async () => {
    if (!imageFile) return;

    setUploading(true);
    try {
      // Upload image to Pinata
      const formData = new FormData();
      formData.append('file', imageFile);

      const imageRes = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
          },
        }
      );

      const imageHash = imageRes.data.IpfsHash;

      // Create metadata
      const metadata = {
        name: 'TimeVault Lock NFT',
        description: `Proof of ${ethAmount} ETH locked until ${unlockDate}${encryptImage ? ' 🔒 Contains encrypted surprise!' : ''}`,
        image: `ipfs://${imageHash}`,
        attributes: [
          { trait_type: 'Unlock Date', value: unlockDate },
          { trait_type: 'Amount', value: `${ethAmount} ETH` },
          { trait_type: 'Network', value: 'Base' },
        ],
      };

      // Upload metadata
      const metadataRes = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        metadata,
        {
          headers: {
            'Content-Type': 'application/json',
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
          },
        }
      );

      const metadataHash = metadataRes.data.IpfsHash;
      setIpfsHash(metadataHash);
      alert('✅ Image uploaded to IPFS successfully!');
    } catch (error) {
      console.error('IPFS upload error:', error);
      alert('❌ Failed to upload to IPFS');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateVault = async () => {
    if (!ipfsHash || !ethAmount || !unlockDate) {
      alert('Please fill all fields and upload image');
      return;
    }

    const unlockTimestamp = Math.floor(new Date(unlockDate).getTime() / 1000);
    const tokenURI = `ipfs://${ipfsHash}`;
    const value = parseEther(ethAmount);

    try {
      if (isGift && recipientAddress) {
        // Gift to someone else
        await writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: VAULT_ABI,
          functionName: 'depositFor',
          args: [recipientAddress as `0x${string}`, BigInt(unlockTimestamp), tokenURI, includeGasReserve],
          value: includeGasReserve ? value + parseEther('0.001') : value,
        });
      } else {
        // Mint for yourself
        await writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: VAULT_ABI,
          functionName: 'deposit',
          args: [BigInt(unlockTimestamp), tokenURI, false],
          value,
        });
      }
    } catch (error) {
      console.error('Transaction error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Create Time-Locked Vault</h2>

      {/* Image Upload */}
      <div>
        <label className="block text-white font-semibold mb-2">NFT Image</label>
        <div className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center hover:border-purple-400 transition-all">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
            ) : (
              <div className="text-purple-200">
                <Upload className="w-12 h-12 mx-auto mb-2" />
                <p>Click to upload image</p>
              </div>
            )}
          </label>
        </div>

        {imageFile && !ipfsHash && (
          <button
            onClick={uploadToIPFS}
            disabled={uploading}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading to IPFS...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload to IPFS
              </>
            )}
          </button>
        )}

        {ipfsHash && (
          <div className="mt-4 bg-green-500/20 border border-green-500 rounded-lg p-3">
            <p className="text-green-400 text-sm">✅ Uploaded: ipfs://{ipfsHash}</p>
          </div>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-white font-semibold mb-2">ETH Amount</label>
        <input
          type="number"
          step="0.001"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          placeholder="0.1"
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
        />
      </div>

      {/* Unlock Date */}
      <div>
        <label className="block text-white font-semibold mb-2">Unlock Date</label>
        <input
          type="date"
          value={unlockDate}
          onChange={(e) => setUnlockDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400"
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 text-white cursor-pointer">
          <input
            type="checkbox"
            checked={encryptImage}
            onChange={(e) => setEncryptImage(e.target.checked)}
            className="w-5 h-5 rounded"
          />
          <span>🔒 Encrypt image (reveal only at unlock)</span>
        </label>

        <label className="flex items-center gap-3 text-white cursor-pointer">
          <input
            type="checkbox"
            checked={isGift}
            onChange={(e) => setIsGift(e.target.checked)}
            className="w-5 h-5 rounded"
          />
          <span>🎁 Gift to someone else</span>
        </label>

        {isGift && (
          <>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="Recipient address (0x...)"
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
            />
            
            <label className="flex items-center gap-3 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={includeGasReserve}
                onChange={(e) => setIncludeGasReserve(e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <span>💰 Include gas reserve (+0.001 ETH)</span>
            </label>
          </>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={handleCreateVault}
        disabled={!ipfsHash || isPending || isConfirming}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
      >
        {isPending || isConfirming ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {isPending ? 'Confirm in wallet...' : 'Creating vault...'}
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Lock ETH & Mint NFT
          </>
        )}
      </button>

      {isSuccess && (
        <div className="bg-green-500/20 border border-green-500 rounded-xl p-4 text-center">
          <p className="text-green-400 font-semibold">🎉 Vault created successfully!</p>
          <p className="text-white text-sm mt-2">Transaction: {hash}</p>
        </div>
      )}
    </div>
  );
}
