import { useState } from 'react';
import { motion } from 'framer-motion';
import type { FeistelRoundTrace } from '../../types/des.types';
import BitString from '../ui/BitString';

interface StageFeistelProps {
  round: FeistelRoundTrace;
  activeSubStep?: string;
}

export default function StageFeistel({ round, activeSubStep }: StageFeistelProps) {
  const [isOpen, setIsOpen] = useState(true);

  const steps = [
    { id: 'expand', label: 'Expansion (E)', value: round.expanded, desc: '32 → 48 bits' },
    { id: 'xor', label: 'XOR ⊕ K' + round.round, value: round.xorResult, desc: '48-bit subkey' },
    { id: 'sbox', label: 'S-Box Substitution', value: round.sboxOutput, desc: '48 → 32 bits' },
    { id: 'pbox', label: 'P-Box Permutation', value: round.pboxOutput, desc: '32-bit output' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 space-y-4"
    >
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="font-semibold text-white">Round {round.round} — Feistel Step</h3>
        <span>{isOpen ? '▼' : '▶'}</span>
      </div>

      {isOpen && (
        <div className="space-y-3 pt-3 border-t border-white/5">
          {/* L and R inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">L<sub>{round.round - 1}</sub> (32-bit)</div>
              <BitString bits={round.L_prev} groupSize={8} />
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">R<sub>{round.round - 1}</sub> (32-bit)</div>
              <BitString bits={round.R_prev} groupSize={8} />
            </div>
          </div>

          {/* Flow steps */}
          <div className="flex flex-col gap-2">
            {steps.map((step, idx) => (
              <motion.div
                key={step.id}
                className={`p-3 rounded-lg border transition-colors ${
                  activeSubStep === step.id
                    ? 'bg-cyan-400/10 border-cyan-400/30'
                    : 'bg-white/5 border-white/5'
                }`}
                animate={activeSubStep === step.id ? { scale: [1, 1.01, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                    {idx + 1}                  </span>
                  <span className="text-sm font-semibold text-white">{step.label}</span>
                  <span className="text-xs text-gray-500">{step.desc}</span>
                </div>
                <BitString bits={step.value} groupSize={8} />
              </motion.div>
            ))}
          </div>

          {/* Output */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
            <div>
              <div className="text-xs text-gray-400 mb-1">L<sub>{round.round}</sub></div>
              <BitString bits={round.L_next} groupSize={8} />
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">R<sub>{round.round}</sub></div>
              <BitString bits={round.R_next} groupSize={8} />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
