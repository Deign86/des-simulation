import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HeroSection({ onStart }: { onStart: () => void }) {
  const lockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lockRef.current;
    if (!el) return;
    const anim = el.animate(
      [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.15)', opacity: 0.7 },
        { transform: 'scale(1)', opacity: 1 }
      ],
      { duration: 2000, iterations: Infinity, easing: 'ease-in-out' }
    );
    return () => anim.cancel();
  }, []);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-6"
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="text-center space-y-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div ref={lockRef} className="text-6xl mb-6 inline-block">
            🔒
          </div>
          <h1 className="text-6xl md:text-7xl font-bold font-sans">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              DES Cryptography
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mt-4 font-sans">
            Data Encryption Standard — Step-by-Step Simulation
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          onClick={onStart}
          className="relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full text-lg overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10">Start Simulation</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
      </div>
    </motion.div>
  );
}
