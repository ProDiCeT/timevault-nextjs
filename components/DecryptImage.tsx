'use client';

import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { Unlock, Loader2, Download } from 'lucide-react';
import { CONTRACT_ADDRESS } from '../config/wagmi';
import { VAULT_ABI } from '../config/abi';
import CryptoJS from 'crypto-js';

export default function DecryptImage() {
  const [vaultId, setVaultId] = useState('');
  const [encryptedHash, setEncryptedHash] = useState('');
  const [decrypting, setDecrypting] = useState(false);
  const [decryptedImage, setDecryptedImage] = useState('');
  const [error, setError] = useState('');

  // Get vault info
  const { data: vaultInfo } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: VAULT_ABI,
    functionName: 'getVaultInfo',
    args: vaultId ? [BigInt(vaultId)] : undefined,
  });

  const deriveKey = (vaultId: string, unlockTime: number): string => {
    const seed = `${vaultId}:${unlockTime}`;
    return CryptoJS.SHA256(seed).toString();
  };

  const handleDecrypt = async () => {
    if (!encryptedHash || !vaultId) {
      setError('Please enter both vault ID and encrypted image hash');
      return;
    }

    if (!vaultInfo?.[3]) {
      setError('Vault must be withdrawn before decrypting the image');
      return;
    }

    setDecrypting(true);
    setError('');

    try {
      // Download encrypted image from IPFS
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${encryptedHash}`);
      
      if (!response.ok) {
        throw new Error('Failed to download encrypted image');
      }

      const encryptedData = await response.text();
      
      // Derive decryption key
      const unlockTime = Number(vaultInfo[2] as bigint);
      const key = deriveKey(vaultId, unlockTime);

      // Decrypt
      try {
        const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) {
          throw new Error('Invalid decryption key');
        }

        setDecryptedImage(decryptedString);
      } catch (decryptError) {
        throw new Error('Failed to decrypt. Wrong vault ID or corrupted data.');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Decryption failed');
    } finally {
      setDecrypting(false);
    }
  };

  const handleDownload = () => {
    if (!decryptedImage) return;

    const link = document.createElement('a');
    link.href = decryptedImage;
    link.download = `revealed_vault_${vaultId}.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Reveal Encrypted Image</h2>

      <div className="bg-blue-500/10 border border-blue-500 rounded-xl p-4 mb-6">
        <p className="text-blue-400 text-sm">
          💡 If you received a vault with an encrypted image, you can reveal it here after withdrawal.
        </p>
      </div>

      {/* Vault ID */}
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

      {/* Encrypted Image Hash */}
      <div>
        <label className="block text-white font-semibold mb-2">Encrypted Image IPFS Hash</label>
        <input
          type="text"
          value={encryptedHash}
          onChange={(e) => setEncryptedHash(e.target.value)}
          placeholder="Qm... or baf..."
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
        />
        <p className="text-purple-300 text-sm mt-2">
          The IPFS hash should have been provided when you received the vault
        </p>
      </div>

      {/* Vault Status */}
      {vaultInfo && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-purple-300">Withdrawal Status:</span>
            <span className={`font-semibold ${vaultInfo[3] ? 'text-green-400' : 'text-orange-400'}`}>
              {vaultInfo[3] ? '✅ Withdrawn (can decrypt)' : '⏳ Not withdrawn yet'}
            </span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-xl p-4">
          <p className="text-red-400 text-sm">❌ {error}</p>
        </div>
      )}

      {/* Decrypt Button */}
      {!decryptedImage && (
        <button
          onClick={handleDecrypt}
          disabled={!vaultId || !encryptedHash || decrypting}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          {decrypting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Decrypting...
            </>
          ) : (
            <>
              <Unlock className="w-5 h-5" />
              Decrypt & View Image
            </>
          )}
        </button>
      )}

      {/* Decrypted Image Display */}
      {decryptedImage && (
        <div className="space-y-4">
          <div className="bg-green-500/20 border border-green-500 rounded-xl p-4">
            <p className="text-green-400 font-semibold text-center mb-4">
              🎉 Image Revealed Successfully!
            </p>
          </div>

          <div className="bg-white/5 border border-white/20 rounded-xl p-6">
            <img 
              src={decryptedImage} 
              alt="Revealed" 
              className="max-w-full rounded-lg mx-auto"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDownload}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Image
            </button>

            <button
              onClick={() => {
                setDecryptedImage('');
                setVaultId('');
                setEncryptedHash('');
                setError('');
              }}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
            >
              Decrypt Another
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-3">📖 How It Works</h3>
        <ol className="text-purple-200 text-sm space-y-2 list-decimal list-inside">
          <li>Enter the Vault ID you received</li>
          <li>Enter the encrypted image IPFS hash (provided by sender)</li>
          <li>Make sure the vault has been withdrawn</li>
          <li>Click "Decrypt & View Image" to reveal</li>
          <li>Download the revealed image to keep it forever</li>
        </ol>
      </div>

      {/* Use Cases */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-3">✨ Perfect For</h3>
        <ul className="text-purple-200 text-sm space-y-2">
          <li>🎂 Birthday messages that reveal on the day</li>
          <li>💍 Engagement proposals with hidden messages</li>
          <li>🎓 Graduation surprises from family</li>
          <li>🎄 Holiday gifts with secret reveals</li>
          <li>💝 Anniversary memories unlocked together</li>
        </ul>
      </div>
    </div>
  );
}
