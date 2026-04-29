import { motion } from 'framer-motion';
import type { DESStage } from '../../types/des.types';
import { FileText, Shuffle, Key, RotateCw, ArrowRightLeft, CheckCircle, X, ChevronRight, Info } from 'lucide-react';

interface EducationalSidebarProps {
  stage: DESStage | null;
  isOpen: boolean;
  onClose: () => void;
  stepNumber?: number;
  totalSteps?: number;
}

const STAGE_CONTENT: Record<string, {
  title: string;
  icon: typeof FileText;
  lesson: string;
  what: string;
  why: string;
  how: string;
  formula?: string;
  facts: string[];
}> = {
  'input': {
    title: 'Your Inputs',
    icon: FileText,
    lesson: 'DES operates on 64-bit blocks with a 64-bit key (56 bits effective after removing 8 parity bits).',
    what: 'DES is a **block cipher** — it encrypts data in fixed-size blocks of 64 bits. The key is also 64 bits, but every 8th bit is a parity bit for error checking, leaving only 56 bits for actual encryption.',
    why: 'DES was developed in the 1970s by IBM and the NSA as the first widely-adopted encryption standard. It shaped modern cryptography for decades.',
    how: 'Your plaintext is converted to binary (each character = 8 bits). If fewer than 8 characters, PKCS#7 padding is added. The key\'s parity bits are checked for errors but not used in encryption.',
    facts: [
      '64 bits × 8 characters = 512 bits total for one block',
      'Every 8th bit is a parity bit (positions 8, 16, 24...64)',
      'The 56 effective bits create 2⁵⁶ = ~72 quadrillion possible keys',
      'Parity bits let systems detect key errors without exposing the key'
    ]
  },
  'ip': {
    title: 'Initial Permutation (IP)',
    icon: Shuffle,
    lesson: 'IP rearranges the 64 input bits according to a fixed table — no key involvement, no security purpose.',
    what: 'The Initial Permutation is a simple **bit rearrangement**. It takes the 64 input bits and reorders them using a fixed permutation table. Bit 58 becomes position 1, bit 50 becomes position 2, and so on.',
    why: 'IP was designed for 1970s hardware efficiency — it rearranged bits to optimize loading into DES chips. It has NO cryptographic purpose and was removed by NSA before publication.',
    how: 'Each position in the 64-bit block gets a new value from the original input. The result is split into L₀ (left 32 bits) and R₀ (right 32 bits) for the Feistel structure.',
    formula: 'IP(b₁, b₂, ..., b₆₄) → [L₀, R₀]',
    facts: [
      'IP has no cryptographic strength — it was for hardware loading',
      'IP = IP⁻¹ (applying IP twice returns original)',
      'L₀ = bits 1-32 after IP, R₀ = bits 33-64 after IP',
      'IP was controversial — some suspected NSA backdoor'
    ]
  },
  'key-schedule': {
    title: 'Key Schedule',
    icon: Key,
    lesson: 'The key schedule generates 16 unique 48-bit subkeys from the 64-bit master key.',
    what: 'The Key Schedule transforms your 64-bit key into 16 different 48-bit subkeys (K₁ through K₁₆). First, PC-1 removes parity bits and reorders the remaining 56 bits into C₀ and D₀. Then each round rotates left by 1 or 2 bits, and PC-2 compresses to 48 bits.',
    why: 'Each round needs a unique subkey to prevent statistical analysis and cryptanalysis. The rotation schedule ensures C and D change each round while maintaining the 56-bit state.',
    how: '1. PC-1: Remove 8 parity bits → 56 bits → split into C₀ (28 bits) and D₀ (28 bits)\n2. For each round i: rotate Cᵢ₋₁ and Dᵢ₋₁ left by shift(i)\n3. PC-2: compress 56 bits → 48 bits = subkey Kᵢ',
    formula: 'Kᵢ = PC2(rotate(Cᵢ₋₁, shiftᵢ), rotate(Dᵢ₋₁, shiftᵢ))',
    facts: [
      'Rotation schedule: [1,1,2,2,2,2,2,1,2,2,2,2,2,2,1]',
      'Rounds 1,2,8,9 rotate by 1 bit; others rotate by 2',
      'PC-2 selects exactly 48 of the 56 bits for each subkey',
      'Decryption uses subkeys in reverse order: K₁₆ → K₁'
    ]
  },
  'feistel': {
    title: 'Feistel Rounds',
    icon: RotateCw,
    lesson: '16 Feistel rounds apply: Lᵢ = Rᵢ₋₁, Rᵢ = Lᵢ₋₁ ⊕ f(Rᵢ₋₁, Kᵢ)',
    what: 'Each Feistel round takes the previous R and computes a new R by: (1) E-box expands R from 32→48 bits (bit duplication), (2) XOR with subkey Kᵢ, (3) S-box substitution 48→32 bits, (4) P-box permutation. Then L becomes old R.',
    why: 'The Feistel structure is **elegantly reversible** — decryption uses the same algorithm with reversed subkeys. It only requires the f-function to be invertible, not the entire round.',
    how: 'E-box: 32 bits → 48 bits (each bit duplicated per E-table)\nXOR: 48-bit expanded R ⊕ 48-bit Kᵢ\nS-box: 8 × 6-bit → 8 × 4-bit (non-linear!)\nP-box: 32 bits permuted\nResult XORed with L to produce new R',
    formula: 'Lᵢ = Rᵢ₋₁\nRᵢ = Lᵢ₋₁ ⊕ f(Rᵢ₋₁, Kᵢ)',
    facts: [
      'E-box duplicates bits: positions 32,1,2,3,4,5 become positions 1-6',
      'S-boxes are the ONLY non-linear operation — all else is linear/permutation',
      '8 S-boxes × 4 bits = 32 bits output',
      'Decryption: K₁₆, K₁₅, ..., K₁ (reverse order)'
    ]
  },
  'swap': {
    title: 'Final Swap',
    icon: ArrowRightLeft,
    lesson: 'After 16 rounds, swap L₁₆ and R₁₆ before the final permutation.',
    what: 'The Feistel structure naturally produces L₁₆ and R₁₆ swapped (R goes to L in every round). After round 16, the halves are swapped one more time to complete the structure before FP.',
    why: 'This extra swap ensures **encryption/decryption symmetry** — the same algorithm works both ways with reversed subkeys. It\'s a consequence of how Feistel networks work.',
    how: 'After round 16: L₁₆ and R₁₆ are swapped before applying FP⁻¹. The final ciphertext is FP⁻¹(R₁₆ || L₁₆) instead of FP⁻¹(L₁₆ || R₁₆).',
    facts: [
      'Without this swap, decryption would need different structure',
      'The swap is why DES is symmetric for encrypt/decrypt',
      'FP then IP = identity (no change) for any input',
      'Actually: FP = IP⁻¹, so IP ∘ FP = identity'
    ]
  },
  'fp': {
    title: 'Final Permutation (FP)',
    icon: Shuffle,
    lesson: 'FP is the inverse of IP — it undoes the initial permutation to produce ciphertext.',
    what: 'The Final Permutation (FP = IP⁻¹) rearranges the 64 bits one last time. It\'s mathematically the inverse of IP — applying IP then FP (or the reverse) returns the original bits.',
    why: 'FP completes the encryption by undoing IP and producing the final ciphertext block. Combined with IP, it ensures the ciphertext is properly formatted for output.',
    how: 'FP takes the swapped output (R₁₆ || L₁₆) and permutes bits according to the FP table. The result is your 64-bit ciphertext (16 hex characters).',
    formula: 'Ciphertext = FP(R₁₆ || L₁₆) = IP⁻¹(R₁₆ || L₁₆)',
    facts: [
      'FP = IP⁻¹ (the inverse permutation)',
      'IP ∘ FP = identity (cancels out)',
      'Bits are rearranged but no security added',
      'Was also for hardware compatibility'
    ]
  },
  'output': {
    title: 'Output Complete',
    icon: CheckCircle,
    lesson: 'DES produces 64-bit ciphertext from 64-bit plaintext using a 56-bit key.',
    what: 'Your encryption is complete. The 64-bit ciphertext (displayed as 16 hex characters) can only be decrypted with the same 8-character key. The result is deterministic for the same input.',
    why: 'DES has been **broken by brute force** since 1998. EFF\'s Deep Cracker broke DES in 56 hours. Your data is NOT secure with DES — use AES-256 for modern security.',
    how: 'The ciphertext block is ready. Convert binary to hex (4 bits per hex digit). If CBC mode was used, each block XORs with the previous ciphertext block.',
    facts: [
      '1998: DES broken by brute force (EFF Deep Crack)',
      '1999: 22 hours to crack a DES key publicly',
      'Modern: GPU clusters can crack DES in seconds',
      'Use AES-256-GCM for security in 2024+'
    ]
  }
};

export default function EducationalSidebar({ stage, isOpen, onClose, stepNumber, totalSteps }: EducationalSidebarProps) {
  const content = stage ? STAGE_CONTENT[stage] : STAGE_CONTENT['input'];

  if (!isOpen || !content) return null;

  const IconComponent = content.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 320 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 320 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed right-0 top-0 h-full w-80 glass border-l border-white/10 overflow-y-auto z-50"
    >
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-cyan-400">Learning Mode</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {stepNumber !== undefined && totalSteps && (
          <div className="text-xs text-gray-400">
            Step {stepNumber} of {totalSteps}
          </div>
        )}

        <div className="glass p-4 space-y-3">
          <div className="flex items-center gap-2">
            <IconComponent className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white">{content.title}</h4>
          </div>
          <p className="text-sm text-cyan-300 leading-relaxed">
            {content.lesson}
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-wide">What Happens</h5>
            <p className="text-sm text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: content.what.replace(/\*\*/g, '<strong>').replace(/\*\*/g, '</strong>') }} />
          </div>

          <div className="space-y-1">
            <h5 className="text-xs font-semibold text-purple-400 uppercase tracking-wide">Why It Matters</h5>
            <p className="text-sm text-gray-300 leading-relaxed">{content.why}</p>
          </div>

          <div className="space-y-1">
            <h5 className="text-xs font-semibold text-blue-400 uppercase tracking-wide">How It Works</h5>
            <pre className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 p-2 rounded">{content.how}</pre>
          </div>

          {content.formula && (
            <div className="space-y-1">
              <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Formula</h5>
              <code className="text-sm text-emerald-300 font-mono bg-black/20 p-2 rounded block">{content.formula}</code>
            </div>
          )}

          <div className="space-y-2 pt-2 border-t border-white/10">
            <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Key Facts</h5>
            {content.facts.map((fact, i) => (
              <div key={i} className="flex gap-2 text-xs text-gray-400">
                <ChevronRight className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                <span>{fact}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-white/10">
          <Info className="w-3 h-3" />
          <span>Press ? to toggle this panel</span>
        </div>
      </div>
    </motion.div>
  );
}