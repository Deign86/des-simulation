import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Lock, Unlock, Shield } from 'lucide-react';
import { hexToBits, stringToBits } from '../../lib/des-utils';

interface InputPanelProps {
  mode: 'encrypt' | 'decrypt';
  onRun: (inputHex: string, keyHex: string, ivHex?: string) => void;
  loading: boolean;
}

const PRESETS = [
  { name: 'Classic NIST', input: '0123456789ABCDEF', key: '133457799BBCDFF1', iv: '1234567890ABCDEF' },
  { name: 'Hello World', input: '48656C6C6F576F72', key: '6C64212121212121', iv: 'DEADBEEF12345678' },
  { name: 'All Zeros', input: '0000000000000000', key: '0000000000000000', iv: '0000000000000000' },
];

export default function InputPanel({ mode, onRun, loading }: InputPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [keyValue, setKeyValue] = useState('');
  const [ivValue, setIvValue] = useState('');

  const isHex = /^[0-9a-fA-F]*$/.test(inputValue);
  const inputBits = (mode === 'decrypt' || isHex) ? hexToBits(inputValue) : stringToBits(inputValue);
  const isInputHex = mode === 'decrypt' || isHex;
  const isKeyHex = /^[0-9a-fA-F]*$/.test(keyValue);
  const keyBits = isKeyHex ? hexToBits(keyValue) : stringToBits(keyValue).slice(0, 64);
  const isIvHex = /^[0-9a-fA-F]*$/.test(ivValue);
  const ivBits = isIvHex ? hexToBits(ivValue) : stringToBits(ivValue).slice(0, 64);
  const inputBitCount = inputBits.length;
  const keyBitCount = keyBits.length;
  const ivBitCount = ivBits.length;

  const handleRandom = (field: 'input' | 'key' | 'iv') => {
    const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
    if (field === 'input') setInputValue(randomHex);
    else if (field === 'key') setKeyValue(randomHex);
    else setIvValue(randomHex);
  };

  const handleSubmit = () => {
    if (inputBitCount > 0 && keyBitCount === 64) {
      const keyHex = isKeyHex ? keyValue : Array.from(keyValue).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('').slice(0, 16).toUpperCase();
      const ivHex = ivBitCount === 64 ? (isIvHex ? ivValue : Array.from(ivValue).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('').slice(0, 16).toUpperCase()) : undefined;
      onRun(inputValue, keyHex, ivHex);
    }
  };

  const isInputValid = inputBitCount > 0 && inputBitCount <= 512;
  const isKeyValid = keyBitCount === 64;
  const isIvValid = ivBitCount === 64 || ivBitCount === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass glass-cyan-border p-6 space-y-6 max-w-2xl mx-auto"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'} (text or hex)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Enter any text or hex..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            <button
              onClick={() => handleRandom('input')}
              className="px-3 py-3 bg-white/5 rounded-lg text-xs font-mono hover:bg-white/10 transition-colors"
            >
              Random
            </button>
          </div>
          <div className={`text-xs mt-1 ${isInputValid ? 'text-emerald-400' : 'text-amber-400'}`}>
            {inputBitCount > 0 ? `${inputBitCount} bits ${mode === 'decrypt' || isInputHex ? `(${inputValue.length} hex chars)` : `(plaintext)`} ${inputBitCount % 64 !== 0 && '(will pad)'}` : 'Enter input to continue'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Secret Key (text or 64-bit hex)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={keyValue}
              onChange={e => setKeyValue(e.target.value)}
              placeholder="Enter text or 16 hex chars..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            <button
              onClick={() => handleRandom('key')}
              className="px-3 py-3 bg-white/5 rounded-lg text-xs font-mono hover:bg-white/10 transition-colors"
            >
              Random
            </button>
          </div>
          <div className={`text-xs mt-1 ${isKeyValid ? 'text-emerald-400' : 'text-rose-400'}`}>
            {keyBitCount === 0 && keyValue.length > 0 ? 'Invalid input' : `${keyBitCount}/64 bits`}
            {keyValue.length > 0 && keyBitCount > 0 && keyBitCount < 64 && ' (will pad to 64 bits)'}
          </div>
        </div>

        <div className="glass p-4 space-y-3 border-amber-400/20">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">CBC Mode (recommended)</span>
          </div>
          <p className="text-xs text-gray-400">
            Initialization Vector (IV) makes identical plaintexts produce different ciphertexts. Leave empty for ECB mode (less secure).
          </p>
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              IV — initialization vector (exactly 8 characters)
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={ivValue}
                onChange={e => setIvValue(e.target.value)}
                placeholder="Enter text or leave empty..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
              />
              <button
                onClick={() => handleRandom('iv')}
                className="px-3 py-3 bg-white/5 rounded-lg text-xs font-mono hover:bg-white/10 transition-colors"
              >
                Random
              </button>
            </div>
            <div className={`text-xs mt-1 ${isIvValid ? 'text-emerald-400' : 'text-amber-400'}`}>
              {ivBitCount === 0 ? 'No IV (ECB mode)' : `${ivBitCount}/64 bits OK`}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {PRESETS.map(preset => (
          <button
            key={preset.name}
            onClick={() => { setInputValue(preset.input); setKeyValue(preset.key); setIvValue(preset.iv); }}
            className="px-3 py-1.5 bg-white/5 rounded-full text-xs hover:bg-white/10 transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isInputValid || !isKeyValid || !isIvValid || loading}
        className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
          mode === 'encrypt'
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
            : 'bg-gradient-to-r from-amber-500 to-orange-600'
        } ${(!isInputValid || !isKeyValid || !isIvValid || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Computing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {mode === 'encrypt' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            {mode === 'encrypt' ? 'Encrypt & Walk Through' : 'Decrypt & Walk Through'}
          </span>
        )}
      </button>
    </motion.div>
  );
}