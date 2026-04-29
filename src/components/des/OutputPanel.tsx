import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Copy, CheckCircle, Shield, Clock, Key, FileKey, Binary, ArrowRightLeft, Cpu, Cylinder, RefreshCw } from 'lucide-react';
import type { DESTrace } from '../../types/des.types';

interface OutputPanelProps {
  trace: DESTrace;
  mode: 'encrypt' | 'decrypt';
  totalSteps?: number;
  onReset?: () => void;
}

export default function OutputPanel({ trace, mode, totalSteps = 85, onReset }: OutputPanelProps) {
  const checkRef = useRef<HTMLDivElement>(null);
  const [copiedHex, setCopiedHex] = useState(false);
  const [copiedB64, setCopiedB64] = useState(false);

  const { ciphertextHex, ivBits, cipherMode, keyBits, ciphertext } = trace;
  const keyHex = keyBits.map(b => b.toString(16).toUpperCase()).join('');
  const ivDisplay = ivBits ? ivBits.map(b => b.toString(16).toUpperCase()).join('') : '';

  const hexToBase64 = (hex: string): string => {
    try {
      const bytes = new Uint8Array(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
      return btoa(String.fromCharCode(...bytes));
    } catch {
      return '';
    }
  };

  const ciphertextBase64 = hexToBase64(ciphertextHex);

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

  const copyToClipboard = (text: string, type: 'hex' | 'b64') => {
    navigator.clipboard.writeText(text);
    if (type === 'hex') {
      setCopiedHex(true);
      setTimeout(() => setCopiedHex(false), 2000);
    } else {
      setCopiedB64(true);
      setTimeout(() => setCopiedB64(false), 2000);
    }
  };

  const bits = ciphertext.length;
  const bytes = bits / 8;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-6 min-h-screen py-8 px-4"
    >
      <div className="flex justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Start Over
        </button>
      </div>

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
              Final 64-bit output block after all 16 rounds
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-400/30">
        <div className="flex items-center gap-2 mb-2">
          <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
          <span className="text-lg font-semibold text-cyan-400">
            {mode === 'encrypt' ? 'Ciphertext' : 'Recovered Plaintext'}
          </span>
        </div>
        <div className="font-mono text-xl text-white break-all bg-black/30 p-4 rounded-lg">
          {ciphertextHex}
        </div>
        <button
          onClick={() => copyToClipboard(ciphertextHex, 'hex')}
          className="mt-3 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Copy className="w-4 h-4" />
          {copiedHex ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-400/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-purple-400">
            Same {mode === 'encrypt' ? 'ciphertext' : 'output'} in base64
          </span>
        </div>
        <div className="font-mono text-lg text-white break-all bg-black/30 p-4 rounded-lg">
          {ciphertextBase64}
        </div>
        <button
          onClick={() => copyToClipboard(ciphertextBase64, 'b64')}
          className="mt-3 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Copy className="w-4 h-4" />
          {copiedB64 ? 'Copied!' : 'Copy Base64'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <Key className="w-5 h-5 mx-auto mb-2 text-amber-400" />
          <div className="text-lg font-bold text-white break-all px-1">{keyHex}</div>
          <div className="text-xs text-gray-400">Key</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <Cylinder className="w-5 h-5 mx-auto mb-2 text-amber-400" />
          <div className="text-lg font-bold text-white break-all px-1">{ivDisplay || 'none'}</div>
          <div className="text-xs text-gray-400">IV</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <Cpu className="w-5 h-5 mx-auto mb-2 text-blue-400" />
          <div className="text-lg font-bold text-white">{cipherMode}</div>
          <div className="text-xs text-gray-400">Mode</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <RefreshCw className="w-5 h-5 mx-auto mb-2 text-purple-400" />
          <div className="text-lg font-bold text-white">PKCS#7</div>
          <div className="text-xs text-gray-400">Padding</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <Clock className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
          <div className="text-lg font-bold text-white">16</div>
          <div className="text-xs text-gray-400">Rounds</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <Binary className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
          <div className="text-lg font-bold text-white">{bits}</div>
          <div className="text-xs text-gray-400">Bits</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <FileKey className="w-5 h-5 mx-auto mb-2 text-blue-400" />
          <div className="text-lg font-bold text-white">{bytes}</div>
          <div className="text-xs text-gray-400">Bytes</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <Clock className="w-5 h-5 mx-auto mb-2 text-amber-400" />
          <div className="text-lg font-bold text-white">{totalSteps}</div>
          <div className="text-xs text-gray-400">Steps</div>
        </div>
      </div>

      <div className="flex items-start gap-2 p-4 bg-red-500/10 rounded-lg border border-red-400/30">
        <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-red-300">
          56-bit effective key = 2⁵⁶ ≈ 72 quadrillion possible keys. In 1999, EFF's DES Cracker broke a DES key in under 22 hours. Use AES-256 for real security.
        </div>
      </div>
    </motion.div>
  );
}