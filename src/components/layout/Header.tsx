import { motion } from 'framer-motion';
import { Lock, Unlock, Info } from 'lucide-react';
import { useMode } from '../../App';

export default function Header({ onAbout }: { onAbout: () => void }) {
  const { mode, toggleMode } = useMode();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass mx-4 mt-4 mb-2 px-6 py-3 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <img src="/assets/des_logo.png" alt="DSE" className="h-8 w-auto" />
        <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          DES Simulation        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Mode Toggle */}
        <div className="bg-white/5 rounded-full p-1 flex relative">
          <motion.div
            className="absolute inset-y-1 rounded-full bg-cyan-500/20"
            style={{ width: '50%' }}
            animate={{ x: mode === 'encrypt' ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
          <button
            onClick={() => mode !== 'encrypt' && toggleMode()}
            className={`relative z-10 px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              mode === 'encrypt' ? 'text-white' : 'text-gray-400'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Encrypt          </button>
          <button
            onClick={() => mode !== 'decrypt' && toggleMode()}
            className={`relative z-10 px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              mode === 'decrypt' ? 'text-white' : 'text-gray-400'
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            Decrypt          </button>
        </div>

        <button
          onClick={onAbout}
          className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
        >
          <Info className="w-4 h-4" />
          About DES        </button>
      </div>
    </motion.header>
  );
}
