import { motion } from 'framer-motion';
import BitString from '../ui/BitString';
import type { DESTrace } from '../../types/des.types';

interface StageIPProps {
  trace: DESTrace;
  isActive?: boolean;
}

export default function StageIP({ trace, isActive }: StageIPProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass p-6 space-y-4 ${isActive ? 'border-cyan-400/30' : ''}`}
    >
      <h3 className="text-lg font-semibold text-white">Initial Permutation (IP)</h3>
      <p className="text-sm text-gray-400">64-bit input rearranged according to IP table</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
        <div>
          <div className="text-xs text-gray-400 mb-1">Input (64-bit)</div>
          <BitString bits={trace.inputBits} groupSize={8} label="Before IP" />
        </div>
        <div className="flex items-center justify-center text-cyan-400">→</div>
        <div>
          <div className="text-xs text-gray-400 mb-1">After IP (64-bit)</div>
          <BitString bits={trace.afterIP} groupSize={8} label="After IP" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
        <div>
          <div className="text-xs text-gray-400 mb-1">L₀ (left 32 bits)</div>
          <BitString bits={trace.L0} groupSize={8} />
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">R₀ (right 32 bits)</div>
          <BitString bits={trace.R0} groupSize={8} />
        </div>
      </div>
    </motion.div>
  );
}
