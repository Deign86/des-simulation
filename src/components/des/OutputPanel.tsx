import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Copy, CheckCircle } from 'lucide-react';

interface OutputPanelProps {
  plaintextHex: string;
  keyHex: string;
  ciphertextHex: string;
  mode: 'encrypt' | 'decrypt';
  onDecryptVerify?: () => void;
}

export default function OutputPanel({ plaintextHex, keyHex, ciphertextHex, mode, onDecryptVerify }: OutputPanelProps) {
  const checkRef = useRef<HTMLDivElement>(null);

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-8 space-y-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-4">
        <div ref={checkRef} className="relative">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle data-ring cx="24" cy="24" r="20" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="100" strokeDashoffset="100" />
            <path d="M16 24l6 6 10-12" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {mode === 'encrypt' ? (
              <>
                <Lock className="w-5 h-5 text-emerald-400" />
                Encryption Complete
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Decryption Complete
              </>
            )}
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { label: 'Plaintext', value: plaintextHex, color: 'blue', border: 'border-blue-400/30' },
          { label: 'Key', value: keyHex, color: 'purple', border: 'border-purple-400/30' },
          { label: 'Ciphertext', value: ciphertextHex, color: 'cyan', border: 'border-cyan-400/30' }
        ].map(({ label, value, border }) => (
          <div key={label} className={`p-4 bg-white/5 rounded-lg border-l-4 ${border} flex items-center justify-between`}>
            <div>
              <div className="text-xs text-gray-400 mb-1">{label} (Hex)</div>
              <div className="font-mono text-sm text-gray-200">{value}</div>
            </div>
            <button
              onClick={() => copyToClipboard(value)}
              className="p-2 hover:bg-white/10 rounded transition-colors text-xs text-gray-400"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {mode === 'encrypt' && onDecryptVerify && (
        <button
          onClick={onDecryptVerify}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <Unlock className="w-4 h-4" />
          Decrypt to Verify        </button>
      )}
    </motion.div>
  );
}
