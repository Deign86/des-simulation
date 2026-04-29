import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { hexToBits, bitsToHex } from '../../lib/des-utils';

interface InputPanelProps {
  mode: 'encrypt' | 'decrypt';
  onRun: (inputHex: string, keyHex: string) => void;
  loading: boolean;
}

const PRESETS = [
  { name: 'Classic NIST', input: '0123456789ABCDEF', key: '133457799BBCDFF1' },
  { name: 'Hello World', input: '48656C6C6F576F72', key: '6C64212121212121' },
  { name: 'All Zeros', input: '0000000000000000', key: '0000000000000000' },
];

export default function InputPanel({ mode, onRun, loading }: InputPanelProps) {
  const [inputHex, setInputHex] = useState('');
  const [keyHex, setKeyHex] = useState('');
  const [showHex, setShowHex] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputBits = hexToBits(inputHex);
  const keyBits = hexToBits(keyHex);
  const inputBitCount = inputBits.length;
  const keyBitCount = keyBits.length;

  const handleRandom = (field: 'input' | 'key') => {
    const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
    if (field === 'input') setInputHex(randomHex);
    else setKeyHex(randomHex);
  };

  const handleSubmit = () => {
    if (inputBitCount === 64 && keyBitCount === 64) {
      onRun(inputHex, keyHex);
    }
  };

  const isInputValid = inputBitCount === 64;
  const isKeyValid = keyBitCount === 64;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass glass-cyan-border p-6 space-y-6 max-w-2xl mx-auto"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'} (64-bit)
          </label>
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={showHex ? inputHex : inputBits.join('')}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
                setInputHex(val);
              }}
              placeholder="Enter 16 hex chars..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
              maxLength={16}
            />
            <button
              onClick={() => setShowHex(!showHex)}
              className="px-3 py-3 bg-white/5 rounded-lg text-xs font-mono hover:bg-white/10 transition-colors"
            >
              {showHex ? 'HEX' : 'BIN'}
            </button>
            <button
              onClick={() => handleRandom('input')}
              className="px-3 py-3 bg-white/5 rounded-lg text-xs font-mono hover:bg-white/10 transition-colors"
            >
              Random
            </button>
          </div>
          <div className={`text-xs mt-1 ${isInputValid ? 'text-emerald-400' : 'text-rose-400'}`}>
            {inputBitCount}/64 bits
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Secret Key (64-bit)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={keyHex}
              onChange={e => setKeyHex(e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase())}
              placeholder="Enter 16 hex chars..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
              maxLength={16}
            />
            <button
              onClick={() => setShowHex(!showHex)}
              className="px-3 py-3 bg-white/5 rounded-lg text-xs font-mono hover:bg-white/10 transition-colors"
            >
              {showHex ? 'HEX' : 'BIN'}
            </button>
            <button
              onClick={() => handleRandom('key')}
              className="px-3 py-3 bg-white/5 rounded-lg text-xs font-mono hover:bg-white/10 transition-colors"
            >
              Random
            </button>
          </div>
          <div className={`text-xs mt-1 ${isKeyValid ? 'text-emerald-400' : 'text-rose-400'}`}>
            {keyBitCount}/64 bits
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {PRESETS.map(preset => (
          <button
            key={preset.name}
            onClick={() => { setInputHex(preset.input); setKeyHex(preset.key); }}
            className="px-3 py-1.5 bg-white/5 rounded-full text-xs hover:bg-white/10 transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isInputValid || !isKeyValid || loading}
        className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
          mode === 'encrypt'
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
            : 'bg-gradient-to-r from-amber-500 to-orange-600'
        } ${(!isInputValid || !isKeyValid || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⟳</span> Computing...
          </span>
        ) : (
          <span>{mode === 'encrypt' ? '🔐 Encrypt' : '🔓 Decrypt'}</span>
        )}
      </button>
    </motion.div>
  );
}
