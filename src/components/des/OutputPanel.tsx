import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, Copy, CheckCircle, Shield, Clock, Key, FileKey, Binary, ArrowRightLeft, Cpu, Cylinder } from 'lucide-react';
import type { DESTrace } from '../../types/des.types';

interface OutputPanelProps {
  trace: DESTrace;
  mode: 'encrypt' | 'decrypt';
  totalSteps?: number;
}

export default function OutputPanel({ trace, mode, totalSteps = 85 }: OutputPanelProps) {
  const checkRef = useRef<HTMLDivElement>(null);

  const { ciphertextHex, ivBits, cipherMode, keyBits, inputBits, ciphertext } = trace;
  const keyHex = keyBits.map(b => b.toString(16).toUpperCase()).join('');
  const plaintextHexDisplay = inputBits.map(b => b.toString(16).toUpperCase()).join('');
  const isCBC = cipherMode === 'CBC';
  const ivDisplay = ivBits ? ivBits.map(b => b.toString(16).toUpperCase()).join('') : '';

  useEffect(() => {
    if (!checkRef.current) return;
    const ring = checkRef.current.querySelector('[data-ring]') as SVGElement;
    if (ring) {
      ring.animate(
        [{ strokeDashoffset: '100' }, { strokeDashoffset: '0' }],
        { duration: 800, easing: 'ease-out', fill: 'forwards' }
      );
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const bits = ciphertext.length;
  const bytes = bits / 8;

  const infoCards = [
    { icon: Binary, label: 'Bits Processed', value: bits.toString(), color: 'cyan' },
    { icon: FileKey, label: 'Bytes Output', value: bytes.toString(), color: 'blue' },
    { icon: Cpu, label: 'Feistel Rounds', value: '16', color: 'purple' },
    { icon: Clock, label: 'Steps Walked', value: totalSteps.toString(), color: 'amber' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass min-h-screen w-full p-6 space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div ref={checkRef} className="relative">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle data-ring cx="32" cy="32" r="26" fill="none" stroke="#10B981" strokeWidth="4" strokeDasharray="160" strokeDashoffset="160" />
              <path d="M20 32l8 8 16-16" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {mode === 'encrypt' ? (
                <>
                  <Lock className="w-6 h-6 text-emerald-400" />
                  Encryption Complete
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  Decryption Complete
                </>
              )}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Mode: <span className={`font-medium ${mode === 'encrypt' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
              </span>
              {' • '}{cipherMode || 'Unknown'}
              {isCBC && ivDisplay && <span className="text-amber-400"> • IV: {ivDisplay}</span>}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {infoCards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white/10 rounded-lg p-4 text-center">
            <Icon className={`w-6 h-6 mx-auto mb-2 text-${color}-400`} />
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-gray-400">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-5 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-400/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-400">
              {mode === 'encrypt' ? 'Plaintext (Input)' : 'Recovered Plaintext'}
            </span>
          </div>
          <code className="font-mono text-lg text-white break-all">
            {plaintextHexDisplay}
          </code>
          <div className="mt-2 text-xs text-gray-500">{inputBits.length} bits input</div>
        </div>

        <div className="p-5 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl border border-purple-400/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-purple-400">Secret Key</span>
            <button
              onClick={() => copyToClipboard(keyHex)}
              className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-400"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <code className="font-mono text-sm text-white break-all">{keyHex.slice(0, 16)}</code>
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <Key className="w-3 h-3" /> Keep secret
          </div>
        </div>
      </div>

      <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 rounded-xl border border-cyan-400/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
            <span className="text-lg font-semibold text-cyan-400">
              {mode === 'encrypt' ? 'Ciphertext (Output)' : 'Ciphertext (Input)'}
            </span>
          </div>
          <button
            onClick={() => copyToClipboard(ciphertextHex)}
            className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm flex items-center gap-1 transition-colors"
          >
            <Copy className="w-4 h-4" /> Copy
          </button>
        </div>
        <code className="font-mono text-xl text-white break-all tracking-wider">{ciphertextHex}</code>
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <span>{bits} bits</span>
          <span>{bytes} bytes</span>
          <span>{ciphertextHex.length} hex chars</span>
        </div>
      </div>

      {isCBC && ivDisplay && (
        <div className="flex items-center gap-2 p-4 bg-amber-500/10 rounded-lg border border-amber-400/30">
          <Cylinder className="w-5 h-5 text-amber-400" />
          <span className="text-sm text-amber-300">CBC Mode with IV: {ivDisplay}</span>
        </div>
      )}

      {cipherMode === 'ECB' && !ivBits && (
        <div className="flex items-center gap-2 p-4 bg-gray-500/10 rounded-lg border border-gray-400/30">
          <Cylinder className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">ECB Mode (no IV) - Identical plaintext blocks produce identical ciphertext blocks</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Shield className="w-4 h-4" />
          This is a demonstration only. For production, use AES-256-GCM.
        </div>
        <div className="text-xs text-gray-500">
          DES (56-bit effective key) is cryptographically obsolete
        </div>
      </div>
    </motion.div>
  );
}