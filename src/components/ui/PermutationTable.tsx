import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface PermutationTableProps {
  title: string;
  inputLabel?: string;
  outputLabel?: string;
  activeInput?: number;
  activeOutput?: number;
}

export default function PermutationTable({
  title,
  inputLabel = 'Input (1-64)',
  outputLabel = 'Output',
  activeInput,
  activeOutput
}: PermutationTableProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass p-4 space-y-3"
    >
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h4 className="font-semibold text-white">{title}</h4>
        {isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
      </div>

      {isOpen && (
        <div className="grid grid-cols-2 gap-6 pt-3">
          <div>
            <div className="text-xs text-gray-400 mb-2">{inputLabel}</div>
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 64 }, (_, i) => (
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

          <div>
            <div className="text-xs text-gray-400 mb-2">{outputLabel}</div>
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 64 }, (_, i) => (
                <div
                  key={i}
                  className={`text-center text-xs font-mono p-1 rounded ${
                    i === activeOutput ? 'bg-cyan-400/20 text-cyan-400' : 'text-gray-400'
                  }`}
                >
                  {i + 1}                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
