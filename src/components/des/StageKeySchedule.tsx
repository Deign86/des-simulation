import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { KeyScheduleRound } from '../../types/des.types';
import { Check } from 'lucide-react';

interface StageKeyScheduleProps {
  rounds: KeyScheduleRound[];
  activeRound?: number;
}

export default function StageKeySchedule({ rounds, activeRound }: StageKeyScheduleProps) {
  const [expandedRound, setExpandedRound] = useState<number | null>(activeRound ?? null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRound !== undefined) {
      setExpandedRound(activeRound);
      // Scroll to active round
      const el = containerRef.current?.querySelector(`[data-round="${activeRound}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeRound]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass p-6 space-y-4"
    >
      <h3 className="text-lg font-semibold text-white">Key Schedule (16 Rounds)</h3>
      <div ref={containerRef} className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {rounds.map((round, idx) => {
          const isActive = round.round === activeRound;
          const isExpanded = expandedRound === round.round;
          const shift = [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1][idx];

          return (
            <motion.div
              key={round.round}
              data-round={round.round}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                isActive ? 'bg-cyan-400/10 border border-cyan-400/30' :
                idx < (activeRound ?? 0) ? 'bg-emerald-400/5 border border-emerald-400/20' :
                'bg-white/5 border border-white/5'
              }`}
              onClick={() => setExpandedRound(isExpanded ? null : round.round)}
            >
              {/* Round badge */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs ${
                isActive ? 'bg-cyan-400/20 text-cyan-400 ring-2 ring-cyan-400/50' :
                idx < (activeRound ?? 0) ? 'bg-emerald-400/20 text-emerald-400' :
                'bg-white/5 text-gray-500'
              }`}>
                {round.round}              </div>

              {/* C|D halves */}
              <div className="flex-1 font-mono text-xs text-gray-400 truncate">
                C<sub>{round.round}</sub> | D<sub>{round.round}</sub>              </div>

              {/* Shift chip */}
              <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-amber-400">
                +{shift}              </span>

              {/* Subkey preview */}
              <span className="font-mono text-xs text-gray-500 truncate max-w-[120px]">
                {round.subkey.slice(0, 12).join('')}...              </span>

              {idx < (activeRound ?? 0) && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
