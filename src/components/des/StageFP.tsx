import { motion } from 'framer-motion';
import BitString from '../ui/BitString';
import type { DESTrace } from '../../types/des.types';

interface StageFPProps {
  trace: DESTrace;
  isActive?: boolean;
}

export default function StageFP({ trace, isActive }: StageFPProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass p-6 space-y-4 ${isActive ? 'border-cyan-400/30' : ''}`}
    >
      <h3 className="text-lg font-semibold text-white">Final Permutation (FP)</h3>
      <p className="text-sm text-gray-400">Inverse of IP — produces final ciphertext</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
        <div>
          <div className="text-xs text-gray-400 mb-1">Before FP (R16 + L16)</div>
          <BitString bits={trace.afterSwap} groupSize={8} />
        </div>
        <div className="flex items-center justify-center text-cyan-400">→</div>
        <div>
          <div className="text-xs text-gray-400 mb-1">After FP (Ciphertext)</div>
          <BitString bits={trace.ciphertext} groupSize={8} showHex />
        </div>
      </div>

      <div className="pt-3 border-t border-white/5">
        <div className="text-xs text-emerald-400 mb-1">Ciphertext (Hex)</div>
        <div className="font-mono text-lg text-white">{trace.ciphertextHex}</div>
      </div>
    </motion.div>
  );
}
