import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { DESStage } from '../../types/des.types';
import { FileText, Shuffle, Key, RotateCw, ArrowRightLeft, CheckCircle, X } from 'lucide-react';

interface EducationalSidebarProps {
  stage: DESStage | null;
  isOpen: boolean;
  onClose: () => void;
}

const EDUCATIONAL_CONTENT: Record<string, { icon: typeof FileText; what: string; why: string; fact: string }> = {
  'input': {
    icon: FileText,
    what: 'The Data Encryption Standard (DES) operates on 64-bit blocks of data using a 64-bit key (56 bits effective).',
    why: 'DES was the first widely adopted symmetric encryption standard, shaping modern cryptography.',
    fact: 'The key has 8 parity bits (positions 8,16,24,32,40,48,56,64), leaving 56 bits for encryption.'
  },
  'ip': {
    icon: Shuffle,
    what: 'Initial Permutation (IP) rearranges the 64 input bits according to a fixed table. It is a straight permutation with no key involvement.',
    why: 'IP was designed to make hardware implementation easier by rearranging bits for efficient processing.',
    fact: 'IP is its own inverse — applying IP twice gives you the original input.'
  },
  'key-schedule': {
    icon: Key,
    what: 'The 64-bit key is reduced to 56 bits (PC-1), split into two 28-bit halves (C and D), rotated left by 1-2 bits per round, then compressed to 48-bit subkeys (PC-2).',
    why: 'Each round needs a unique subkey derived from the master key to resist cryptanalysis.',
    fact: 'The shift schedule (1,1,2,2,2,2,2,1,2,2,2,2,2,2,1) was carefully chosen to maximize diffusion.'
  },
  'feistel': {
    icon: RotateCw,
    what: 'Feistel rounds apply a substitution-permutation network: expand R (32→48), XOR with subkey, substitute via S-boxes (48→32), permute via P-box, then XOR with L.',
    why: 'The Feistel structure allows decryption using the same algorithm with reversed subkeys.',
    fact: 'Each S-box reduces 6 bits to 4 bits, providing the non-linearity essential for security.'
  },
  'swap': {
    icon: ArrowRightLeft,
    what: 'After 16 rounds, the left and right halves are swapped (L16 and R16 exchange places) before the final permutation.',
    why: 'This final swap ensures the structure is symmetric and allows the same algorithm for encryption and decryption.',
    fact: 'Without this swap, decryption would require a different algorithm structure.'
  },
  'fp': {
    icon: Shuffle,
    what: 'Final Permutation (FP) is the inverse of IP. It rearranges the 64 bits back to produce the ciphertext.',
    why: 'FP completes the permutation started by IP, ensuring the output is properly formatted.',
    fact: 'FP = IP⁻¹, so applying IP then FP (or vice versa) returns the original bits.'
  },
  'output': {
    icon: CheckCircle,
    what: 'The result is the 64-bit ciphertext, typically displayed in hexadecimal (16 hex characters).',
    why: 'The ciphertext can only be decrypted back to plaintext with the same secret key.',
    fact: 'DES was broken by brute force in 1998 due to its 56-bit key space (2^56 ≈ 72 quadrillion possibilities).'
  }
};

export default function EducationalSidebar({ stage, isOpen, onClose }: EducationalSidebarProps) {
  const [content, setContent] = useState(EDUCATIONAL_CONTENT['input']);

  useEffect(() => {
    if (stage && EDUCATIONAL_CONTENT[stage]) {
      setContent(EDUCATIONAL_CONTENT[stage]);
    }
  }, [stage]);

  if (!isOpen) return null;

  const IconComponent = content.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 320 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 320 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed right-0 top-0 h-full w-80 glass border-l border-white/10 p-6 overflow-y-auto z-40"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white">Learn This Step</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="text-4xl text-cyan-400">
          <IconComponent className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-cyan-400">What is this?</h4>
          <p className="text-sm text-gray-300 leading-relaxed">{content.what}</p>
        </div>

        <div className="space-y-2 border-l-4 border-amber-400/30 pl-4">
          <h4 className="text-sm font-semibold text-amber-400">Why does it matter?</h4>
          <p className="text-sm text-gray-300 leading-relaxed">{content.why}</p>
        </div>

        <div className="space-y-2 bg-amber-400/5 border-l-4 border-amber-400/50 p-4 rounded">
          <h4 className="text-sm font-semibold text-amber-400">Key Fact</h4>
          <p className="text-sm text-gray-300">{content.fact}</p>
        </div>
      </div>
    </motion.div>
  );
}
