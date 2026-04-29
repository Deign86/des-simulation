import { motion } from 'framer-motion';
import { PRESENTATION } from '../config/presentation';
import { Calendar, Check } from 'lucide-react';

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-8 space-y-8"
    >
      <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        About DES
      </h1>

      {/* Presentation Info */}
      <div className="glass p-6 space-y-2">
        <h2 className="text-xl font-semibold text-white">{PRESENTATION.title}</h2>
        <p className="text-gray-400">{PRESENTATION.subtitle}</p>
        {PRESENTATION.course && <p className="text-sm text-gray-500">Course: {PRESENTATION.course}</p>}
        {PRESENTATION.professor && <p className="text-sm text-gray-500">Professor: {PRESENTATION.professor}</p>}
        {PRESENTATION.date && <p className="text-sm text-gray-500">Date: {PRESENTATION.date}</p>}
      </div>

      {/* History */}
      <div className="glass p-6 space-y-4">
        <h3 className="text-lg font-semibold text-cyan-400">History</h3>
        <p className="text-gray-300 leading-relaxed">
          DES was developed by IBM in the early 1970s and adopted as a federal standard in 1977 by NIST.
          Based on the Lucifer cipher, it became the most widely used encryption standard until it was
          succeeded by AES in 2001.
        </p>
        <div className="flex gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> 1977: FIPS PUB 46</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> 2001: AES replaces DES</span>
        </div>
      </div>

      {/* How It Works */}
      <div className="glass p-6 space-y-4">
        <h3 className="text-lg font-semibold text-cyan-400">How It Works</h3>
        <div className="space-y-2 text-gray-300">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center text-xs">1</span>
            <span>64-bit input undergoes Initial Permutation (IP)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center text-xs">2</span>
            <span>16 Feistel rounds with unique 48-bit subkeys</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center text-xs">3</span>
            <span>Final Permutation (FP) produces 64-bit ciphertext</span>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="glass p-6 space-y-4">
        <h3 className="text-lg font-semibold text-amber-400">Security</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-gray-400 pb-2">Algorithm</th>
              <th className="text-left text-gray-400 pb-2">Key Size</th>
              <th className="text-left text-gray-400 pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'DES', key: '56-bit', status: 'Broken (1998)' },
              { name: '3DES', key: '168-bit', status: 'Deprecated (2023)' },
              { name: 'AES', key: '128/256-bit', status: 'Secure' }
            ].map(row => (
              <tr key={row.name} className="border-b border-white/5">
                <td className="py-2 text-white">{row.name}</td>
                <td className="py-2 text-gray-400">{row.key}</td>
                <td className="py-2 text-gray-400 flex items-center gap-1">
                  {row.name === 'AES' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
