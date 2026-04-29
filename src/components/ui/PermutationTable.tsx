import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface PermutationTableProps {
  title: string;
  inputBits: number[];
  outputBits: number[];
  table: readonly number[]; // 1-indexed DES table
  inputLabel?: string;
  outputLabel?: string;
  activeInput?: number;
  activeOutput?: number;
}

export default function PermutationTable({
  title,
  inputBits,
  outputBits,
  table,
  inputLabel = 'Input (1-64)',
  outputLabel = 'Output',
  activeInput,
  activeOutput
}: PermutationTableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // WAAPI: Animate SVG line for active permutation
  useEffect(() => {
    if (!svgRef.current || activeInput === undefined) return;
    const line = svgRef.current.querySelector(`[data-line="${activeInput}"]`) as SVGLineElement;
    if (line) {
      line.animate(
        [{ strokeOpacity: 0.2 }, { strokeOpacity: 1 }, { strokeOpacity: 0.2 }],
        { duration: 800, easing: 'ease-in-out' }
      );
    }
  }, [activeInput]);

  const inputPositions = Array.from({ length: 64 }, (_, i) => i);
  const outputPositions = table.map((pos, i) => ({ from: pos - 1, to: i }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass p-4 space-y-3"
    >
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h4 className="font-semibold text-white">{title}</h4>
        <span className="text-gray-500">{isOpen ? '▼' : '▶'}</span>
      </div>

      {isOpen && (
        <div className="grid grid-cols-2 gap-6 pt-3">
          {/* Input column */}
          <div>
            <div className="text-xs text-gray-400 mb-2">{inputLabel}</div>
            <div className="grid grid-cols-8 gap-1">
              {inputPositions.map(i => (
                <div
                  key={i}
                  className={`text-center text-xs font-mono p-1 rounded ${
                    i === activeInput ? 'bg-cyan-400/20 text-cyan-400' : 'text-gray-400'
                  }`}
                >
                  {i + 1}                </div>
              ))}
            </div>
          </div>

          {/* Output column */}
          <div>
            <div className="text-xs text-gray-400 mb-2">{outputLabel}</div>
            <div className="grid grid-cols-8 gap-1">
              {outputPositions.map(({ from }, i) => (
                <div
                  key={i}
                  className={`text-center text-xs font-mono p-1 rounded ${
                    i === activeOutput ? 'bg-cyan-400/20 text-cyan-400' : 'text-gray-400'
                  }`}
                >
                  {from + 1}                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
