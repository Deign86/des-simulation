import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { SBoxTrace } from '../../types/des.types';
import { S_BOXES } from '../../lib/des-tables';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface StageSBoxesProps {
  sboxTraces: SBoxTrace[];
  round: number;
}

export default function StageSBoxes({ sboxTraces, round }: StageSBoxesProps) {
  const [isOpen, setIsOpen] = useState(true);
  const activeRefs = useRef<(HTMLTableCellElement | null)[][]>([]);

  useEffect(() => {
    sboxTraces.forEach((trace) => {
      const el = activeRefs.current[trace.sboxIndex]?.[trace.row * 16 + trace.col];
      if (el) {
        el.animate(
          [
            { transform: 'scale(1)', backgroundColor: 'rgba(0, 212, 255, 0.3)' },
            { transform: 'scale(1.15)', backgroundColor: 'rgba(0, 212, 255, 0.1)' },
            { transform: 'scale(1)', backgroundColor: 'rgba(0, 212, 255, 0.05)' }
          ],
          { duration: 400, easing: 'ease-out' }
        );
      }
    });
  }, [sboxTraces]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass p-6 space-y-4"
    >
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="font-semibold text-white">S-Box Substitution — Round {round}</h3>
        {isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
      </div>

      {isOpen && (
        <div className="pt-3 overflow-x-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sboxTraces.map((trace) => {
              const sboxValues = S_BOXES[trace.sboxIndex];
              return (
                <div key={trace.sboxIndex} className="bg-white/5 rounded-lg p-3 space-y-2">
                  <div className="text-xs text-cyan-400 font-semibold">S-Box {trace.sboxIndex + 1}</div>
                  <div className="text-xs text-gray-400">
                    Input: {trace.input6.join('')} → Row {trace.row}, Col {trace.col}
                  </div>
                  <div className="text-xs text-emerald-400">
                    Output: {trace.output4.join('')}
                  </div>

                  <table className="w-full text-xs font-mono border-collapse">
                    <tbody>
                      {[0, 1, 2, 3].map(row => (
                        <tr key={row}>
                          <td className={`pr-1 text-right text-[10px] w-4 ${row === trace.row ? 'text-amber-400 font-bold' : 'text-gray-600'}`}>
                            {row}
                          </td>
                          {Array.from({ length: 16 }, (_, col) => (
                            <td
                              key={col}
                              ref={el => {
                                if (!activeRefs.current[trace.sboxIndex]) activeRefs.current[trace.sboxIndex] = [];
                                activeRefs.current[trace.sboxIndex][row * 16 + col] = el;
                              }}
                              className={`p-0.5 text-center text-[10px] ${
                                row === trace.row && col === trace.col
                                  ? 'bg-cyan-400/30 text-cyan-300 font-bold rounded'
                                  : row === trace.row || col === trace.col
                                  ? 'text-amber-400/80'
                                  : 'text-gray-500'
                              }`}
                            >
                              {sboxValues[row][col].toString(16).toUpperCase()}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}