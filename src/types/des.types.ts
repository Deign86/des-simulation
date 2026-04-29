export interface SBoxTrace {
  sboxIndex: number;    // 0–7
  input6: number[];     // 6-bit input
  row: number;          // bit 1 + bit 6
  col: number;          // bits 2–5
  output4: number[];    // 4-bit output
}

export interface FeistelRoundTrace {
  round: number;
  L_prev: number[];
  R_prev: number[];
  expanded: number[];       // 32 → 48 via E table
  subkey: number[];         // 48-bit K_i
  xorResult: number[];      // expanded XOR subkey
  sboxTraces: SBoxTrace[];  // one per S-box (8 total)
  sboxOutput: number[];     // 48 → 32 concatenated
  pboxOutput: number[];     // 32-bit after P permutation
  L_next: number[];
  R_next: number[];
}

export interface KeyScheduleRound {
  round: number;
  C: number[];           // 28-bit C_i after shift
  D: number[];           // 28-bit D_i after shift
  subkey: number[];      // 48-bit K_i from PC-2
}

export type DESStage = 'input' | 'ip' | 'key-schedule' | 'feistel' | 'swap' | 'fp' | 'output';

export interface DESTrace {
  mode: 'encrypt' | 'decrypt';
  inputBits: number[];         // plaintext bits
  keyBits: number[];           // 64-bit key
  ivBits?: number[];           // 64-bit IV (optional)
  cipherMode: 'CBC' | 'ECB';    // cipher mode used
  afterIP: number[];           // after Initial Permutation (first block)
  L0: number[];                // left 32 bits after IP
  R0: number[];                // right 32 bits after IP
  keySchedule: {
    afterPC1: { C0: number[]; D0: number[] };
    rounds: KeyScheduleRound[];
  };
  feistelRounds: FeistelRoundTrace[];
  preSwap: { L16: number[]; R16: number[] };
  afterSwap: number[];         // R16 + L16 concatenated
  ciphertext: number[];        // ciphertext bits
  ciphertextHex: string;
  numBlocks: number;           // number of 64-bit blocks processed
}

export interface Step {
  id: string;
  label: string;
  stage: DESStage;
  roundIndex?: number;
  subStep?: 'expand' | 'xor' | 'sbox' | 'pbox' | 'result';
  data: Partial<DESTrace>;
}
