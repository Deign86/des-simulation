import { useState } from 'react';
import { motion } from 'framer-motion';
import { IP_TABLE, FP_TABLE, PC1_TABLE, PC2_TABLE, E_TABLE, P_TABLE, S_BOXES, SHIFT_SCHEDULE } from '../lib/des-tables';

export default function TablesPage() {
  const [printMode, setPrintMode] = useState(false);

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => window.print(), 100);
    setTimeout(() => setPrintMode(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-6xl mx-auto px-4 py-8 space-y-8 ${printMode ? 'print:bg-white print:text-black' : ''}`}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">DES Constant Tables</h1>
        <button
          onClick={handlePrint}
          className="px-4 py-2 glass hover:bg-white/10 transition-colors rounded-lg text-sm"
        >
          🖨️ Print / Export        </button>
      </div>

      {/* IP Table */}
      <div className="glass p-6 space-y-3">
        <h3 className="text-lg font-semibold text-cyan-400">Initial Permutation (IP)</h3>
        <div className="grid grid-cols-8 gap-1 font-mono text-xs">
          {IP_TABLE.map((val, i) => (
            <div key={i} className="p-1 text-center bg-white/5 rounded">{val}</div>
          ))}
        </div>
      </div>

      {/* FP Table */}
      <div className="glass p-6 space-y-3">
        <h3 className="text-lg font-semibold text-cyan-400">Final Permutation (FP)</h3>
        <div className="grid grid-cols-8 gap-1 font-mono text-xs">
          {FP_TABLE.map((val, i) => (
            <div key={i} className="p-1 text-center bg-white/5 rounded">{val}</div>
          ))}
        </div>
      </div>

      {/* PC-1 */}
      <div className="glass p-6 space-y-3">
        <h3 className="text-lg font-semibold text-cyan-400">Permuted Choice 1 (PC-1)</h3>
        <div className="grid grid-cols-8 gap-1 font-mono text-xs">
          {PC1_TABLE.map((val, i) => (
            <div key={i} className="p-1 text-center bg-white/5 rounded">{val}</div>
          ))}
        </div>
      </div>

      {/* PC-2 */}
      <div className="glass p-6 space-y-3">
        <h3 className="text-lg font-semibold text-cyan-400">Permuted Choice 2 (PC-2)</h3>
        <div className="grid grid-cols-8 gap-1 font-mono text-xs">
          {PC2_TABLE.map((val, i) => (
            <div key={i} className="p-1 text-center bg-white/5 rounded">{val}</div>
          ))}
        </div>
      </div>

      {/* E Table */}
      <div className="glass p-6 space-y-3">
        <h3 className="text-lg font-semibold text-cyan-400">Expansion (E)</h3>
        <div className="grid grid-cols-8 gap-1 font-mono text-xs">
          {E_TABLE.map((val, i) => (
            <div key={i} className="p-1 text-center bg-white/5 rounded">{val}</div>
          ))}
        </div>
      </div>

      {/* P Table */}
      <div className="glass p-6 space-y-3">
        <h3 className="text-lg font-semibold text-cyan-400">P-Box (P)</h3>
        <div className="grid grid-cols-8 gap-1 font-mono text-xs">
          {P_TABLE.map((val, i) => (
            <div key={i} className="p-1 text-center bg-white/5 rounded">{val}</div>
          ))}
        </div>
      </div>

      {/* Shift Schedule */}
      <div className="glass p-6 space-y-3">
        <h3 className="text-lg font-semibold text-cyan-400">Shift Schedule</h3>
        <div className="flex gap-2">
          {SHIFT_SCHEDULE.map((val, i) => (
            <div key={i} className="px-3 py-1 bg-white/5 rounded text-center text-xs font-mono">
              R{i+1}: +{val}            </div>
          ))}
        </div>
      </div>

      {/* S-Boxes */}
      {S_BOXES.map((sbox, idx) => (
        <div key={idx} className="glass p-6 space-y-3">
          <h3 className="text-lg font-semibold text-cyan-400">S-Box {idx + 1}</h3>
          <table className="w-full text-xs font-mono border-collapse">
            <tbody>
              {sbox.map((row, ri) => (
                <tr key={ri}>
                  <td className="p-1 text-amber-400">{ri}</td>
                  {row.map((val, ci) => (
                    <td key={ci} className="p-1 text-center bg-white/5 rounded">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </motion.div>
  );
}
