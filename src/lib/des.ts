import { IP_TABLE, FP_TABLE, PC1_TABLE, PC2_TABLE, E_TABLE, P_TABLE, S_BOXES, SHIFT_SCHEDULE } from './des-tables';
import { hexToBits, bitsToHex, permute, xorBits, leftRotate, sboxLookup } from './des-utils';
import { DESTrace, FeistelRoundTrace, KeyScheduleRound, SBoxTrace } from '../types/des.types';

function generateKeySchedule(keyBits: number[]): { afterPC1: { C0: number[], D0: number[] }, rounds: KeyScheduleRound[] } {
  // Apply PC-1 to get 56 bits
  const pc1Result = permute(keyBits, PC1_TABLE);
  const C0 = pc1Result.slice(0, 28);
  const D0 = pc1Result.slice(28, 56);

  const rounds: KeyScheduleRound[] = [];
  let C = [...C0];
  let D = [...D0];

  for (let i = 0; i < 16; i++) {
    // Shift left by schedule amount
    const shift = SHIFT_SCHEDULE[i];
    C = leftRotate(C, shift);
    D = leftRotate(D, shift);

    // Combine C and D, apply PC-2 to get 48-bit subkey
    const cd = [...C, ...D];
    const subkey = permute(cd, PC2_TABLE);

    rounds.push({
      round: i + 1,
      C: [...C],
      D: [...D],
      subkey: [...subkey]
    });
  }

  return { afterPC1: { C0, D0 }, rounds };
}

function runFeistelRounds(L0: number[], R0: number[], keySchedule: KeyScheduleRound[], mode: 'encrypt' | 'decrypt'): FeistelRoundTrace[] {
  const rounds: FeistelRoundTrace[] = [];
  let L = [...L0];
  let R = [...R0];

  // For encryption: use K1 to K16, for decryption: K16 to K1
  const subkeys = mode === 'encrypt' ? keySchedule : [...keySchedule].reverse();

  for (let i = 0; i < 16; i++) {
    const subkey = subkeys[i].subkey;
    const roundNum = mode === 'encrypt' ? i + 1 : 16 - i;

    // Expansion: R (32 bits) → 48 bits
    const expanded = permute(R, E_TABLE);

    // XOR with subkey
    const xorResult = xorBits(expanded, subkey);

    // S-Box processing
    const sboxTraces: SBoxTrace[] = [];
    const sboxOutputs: number[] = [];
    for (let j = 0; j < 8; j++) {
      const input6 = xorResult.slice(j * 6, (j + 1) * 6);
      const { output4, row, col } = sboxLookup(input6, S_BOXES[j]);
      sboxTraces.push({
        sboxIndex: j,
        input6: [...input6],
        row,
        col,
        output4: [...output4]
      });
      sboxOutputs.push(...output4);
    }

    // P-Box permutation
    const pboxOutput = permute(sboxOutputs, P_TABLE);

    // Next L and R
    const L_next = [...R];
    const R_next = xorBits(L, pboxOutput);

    rounds.push({
      round: roundNum,
      L_prev: [...L],
      R_prev: [...R],
      expanded: [...expanded],
      subkey: [...subkey],
      xorResult: [...xorResult],
      sboxTraces: sboxTraces,
      sboxOutput: sboxOutputs,
      pboxOutput: [...pboxOutput],
      L_next: L_next,
      R_next: R_next
    });

    L = L_next;
    R = R_next;
  }

  return rounds;
}

export function desEncrypt(plaintextHex: string, keyHex: string): DESTrace {
  const inputBits = hexToBits(plaintextHex);
  const keyBits = hexToBits(keyHex);

  // Initial Permutation
  const afterIP = permute(inputBits, IP_TABLE);
  const L0 = afterIP.slice(0, 32);
  const R0 = afterIP.slice(32, 64);

  // Key Schedule
  const keySchedule = generateKeySchedule(keyBits);

  // Feistel Rounds
  const feistelRounds = runFeistelRounds(L0, R0, keySchedule.rounds, 'encrypt');

  // Swap L16 and R16
  const L16 = feistelRounds[15].L_next;
  const R16 = feistelRounds[15].R_next;
  const preSwap = { L16: [...L16], R16: [...R16] };
  const afterSwap = [...R16, ...L16];

  // Final Permutation
  const ciphertext = permute(afterSwap, FP_TABLE);
  const ciphertextHex = bitsToHex(ciphertext);

  return {
    mode: 'encrypt',
    inputBits,
    keyBits,
    afterIP,
    L0,
    R0,
    keySchedule: {
      afterPC1: keySchedule.afterPC1,
      rounds: keySchedule.rounds
    },
    feistelRounds,
    preSwap,
    afterSwap,
    ciphertext,
    ciphertextHex
  };
}

export function desDecrypt(ciphertextHex: string, keyHex: string): DESTrace {
  const inputBits = hexToBits(ciphertextHex);
  const keyBits = hexToBits(keyHex);

  // Initial Permutation
  const afterIP = permute(inputBits, IP_TABLE);
  const L0 = afterIP.slice(0, 32);
  const R0 = afterIP.slice(32, 64);

  // Key Schedule
  const keySchedule = generateKeySchedule(keyBits);

  // Feistel Rounds (reverse subkey order)
  const feistelRounds = runFeistelRounds(L0, R0, keySchedule.rounds, 'decrypt');

  // Swap L16 and R16
  const L16 = feistelRounds[15].L_next;
  const R16 = feistelRounds[15].R_next;
  const preSwap = { L16: [...L16], R16: [...R16] };
  const afterSwap = [...R16, ...L16];

  // Final Permutation
  const ciphertextBits = permute(afterSwap, FP_TABLE);
  const resultCiphertextHex = bitsToHex(ciphertextBits);

  return {
    mode: 'decrypt',
    inputBits,
    keyBits,
    afterIP,
    L0,
    R0,
    keySchedule: {
      afterPC1: keySchedule.afterPC1,
      rounds: keySchedule.rounds
    },
    feistelRounds,
    preSwap,
    afterSwap,
    ciphertext: ciphertextBits,
    ciphertextHex: resultCiphertextHex
  };
}
