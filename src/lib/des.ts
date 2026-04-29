import { IP_TABLE, FP_TABLE, PC1_TABLE, PC2_TABLE, E_TABLE, P_TABLE, S_BOXES, SHIFT_SCHEDULE } from './des-tables';
import { hexToBits, bitsToHex, permute, xorBits, leftRotate, sboxLookup } from './des-utils';
import type { DESTrace, FeistelRoundTrace, KeyScheduleRound, SBoxTrace } from '../types/des.types';

/**
 * DES (Data Encryption Standard) Implementation
 * 
 * This implementation follows the FIPS 46-3 standard for DES encryption and decryption.
 * The algorithm operates on 64-bit blocks using a 56-bit key (plus 8 parity bits).
 * 
 * Key Steps:
 * 1. Initial Permutation (IP) - Rearranges input bits according to IP table
 * 2. 16 Feistel Rounds - Each round involves:
 *    - Expansion (E-box) - Expands 32-bit half to 48 bits
 *    - Key Mixing - XOR with subkey
 *    - Substitution (S-boxes) - Maps 48-bit input to 32-bit output
 *    - Permutation (P-box) - Rearranges bits according to P table
 * 3. Final Permutation (FP) - Inverse of initial permutation
 * 
 * Supports both ECB and CBC modes when IV is provided.
 */

/**
 * Generates the DES key schedule from a 64-bit key (56 bits used, 8 parity bits ignored)
 * 
 * Process:
 * 1. Apply PC-1 permutation to get 56-bit key (split into C0 and D0, 28 bits each)
 * 2. For each of 16 rounds:
 *    - Left rotate C and D by amounts specified in shift schedule
 *    - Apply PC-2 permutation to get 48-bit subkey
 * 
 * @param keyBits - 64-bit key array (including parity bits)
 * @returns Object containing initial PC-1 result and array of 16 key schedule rounds
 */
function generateKeySchedule(keyBits: number[]): { afterPC1: { C0: number[], D0: number[] }, rounds: KeyScheduleRound[] } {
  // Apply PC-1 permutation (Table 1.1 in FIPS 46-3) to get 56-bit key
  const pc1Result = permute(keyBits, PC1_TABLE);
  const C0 = pc1Result.slice(0, 28); // Left half (C0)
  const D0 = pc1Result.slice(28, 56); // Right half (D0)

  const rounds: KeyScheduleRound[] = [];
  let C = [...C0];
  let D = [...D0];

  // Generate 16 round subkeys
  for (let i = 0; i < 16; i++) {
    // Left rotate C and D by amounts from shift schedule (Table 1.2 in FIPS 46-3)
    const shift = SHIFT_SCHEDULE[i];
    C = leftRotate(C, shift);
    D = leftRotate(D, shift);

    // Combine C and D and apply PC-2 permutation to get 48-bit subkey
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

/**
 * Executes the 16 Feistel rounds of DES encryption or decryption
 * 
 * Each Feistel round consists of:
 * 1. Expansion: 32-bit half expanded to 48 bits using E-table
 * 2. Key mixing: XOR with round subkey
 * 3. Substitution: 8 S-boxes map 48-bit input to 32-bit output
 * 4. Permutation: 32-bit output permuted using P-table
 * 5. XOR and swap: Result XORed with left half, then halves swapped
 * 
 * For decryption, the same algorithm is used but with subkeys applied in reverse order.
 * 
 * @param L0 - Initial 32-bit left half after initial permutation
 * @param R0 - Initial 32-bit right half after initial permutation
 * @param keySchedule - Array of 16 key schedule rounds containing subkeys
 * @param mode - Either 'encrypt' or 'decrypt' (determines subkey order)
 * @returns Array of 16 Feistel round traces, each containing intermediate values
 */
function runFeistelRounds(L0: number[], R0: number[], keySchedule: KeyScheduleRound[], mode: 'encrypt' | 'decrypt'): FeistelRoundTrace[] {
  const rounds: FeistelRoundTrace[] = [];
  let L = [...L0];
  let R = [...R0];

  // For decryption, subkeys are used in reverse order
  const subkeys = mode === 'encrypt' ? keySchedule : [...keySchedule].reverse();

  // Execute 16 Feistel rounds
  for (let i = 0; i < 16; i++) {
    const subkey = subkeys[i].subkey;
    // Round number differs for encryption vs decryption due to reverse key order
    const roundNum = mode === 'encrypt' ? i + 1 : 16 - i;

    // Step 1: Expansion - expand 32-bit R to 48 bits using E-box table
    const expanded = permute(R, E_TABLE);
    // Step 2: Key mixing - XOR expanded right half with subkey
    const xorResult = xorBits(expanded, subkey);

    // Step 3: Substitution - process through 8 S-boxes
    const sboxTraces: SBoxTrace[] = [];
    const sboxOutputs: number[] = [];
    for (let j = 0; j < 8; j++) {
      // Extract 6-bit chunk for each S-box
      const input6 = xorResult.slice(j * 6, (j + 1) * 6);
      // Lookup in S-box: outer bits (first and last) determine row,
      // inner 4 bits determine column
      const { output4, row, col } = sboxLookup(input6, S_BOXES[j] as unknown as number[][]);
      sboxTraces.push({
        sboxIndex: j,
        input6: [...input6],
        row,
        col,
        output4: [...output4]
      });
      sboxOutputs.push(...output4); // Collect 4-bit outputs from each S-box
    }

    // Step 4: Permutation - permute concatenated S-box outputs using P-box table
    const pboxOutput = permute(sboxOutputs, P_TABLE);
    // Step 5: XOR and swap - XOR P-box output with left half, then swap halves
    const L_next = [...R];           // New left half is old right half
    const R_next = xorBits(L, pboxOutput); // New right half is L XOR P-box output

    // Store trace for this round including all intermediate values
    rounds.push({
      round: roundNum,
      L_prev: [...L],
      R_prev: [...R],
      expanded: [...expanded],
      subkey: [...subkey],
      xorResult: [...xorResult],
      sboxTraces,
      sboxOutput: sboxOutputs,
      pboxOutput: [...pboxOutput],
      L_next,
      R_next
    });

    // Update halves for next round
    L = L_next;
    R = R_next;
  }

  return rounds;
}

function padInput(inputBits: number[]): number[] {
  const remainder = inputBits.length % 64;
  if (remainder === 0) return inputBits;
  const paddingNeeded = 64 - remainder;
  const padding = Array(paddingNeeded).fill(0);
  padding[0] = 1;
  return [...inputBits, ...padding];
}

function processBlocks(inputBits: number[], keyBits: number[], mode: 'encrypt' | 'decrypt', ivBits?: number[]) {
  const paddedBits = padInput(inputBits);
  const numBlocks = Math.ceil(paddedBits.length / 64);
  const allciphertext: number[] = [];
  let previousCiphertext: number[] = ivBits ? [...ivBits] : [];

  for (let block = 0; block < numBlocks; block++) {
    const blockBits = paddedBits.slice(block * 64, (block + 1) * 64);
    
    let inputBitsForIP: number[];
    if (ivBits && mode === 'encrypt') {
      inputBitsForIP = xorBits(blockBits, previousCiphertext);
    } else {
      inputBitsForIP = blockBits;
    }
    
    const afterIP = permute(inputBitsForIP, IP_TABLE);
    const L0 = afterIP.slice(0, 32);
    const R0 = afterIP.slice(32, 64);

    const keySchedule = generateKeySchedule(keyBits);
    const feistelRounds = runFeistelRounds(L0, R0, keySchedule.rounds, mode);

    const L16 = feistelRounds[15].L_next;
    const R16 = feistelRounds[15].R_next;
    const afterSwap = [...R16, ...L16];

    const ciphertext = permute(afterSwap, FP_TABLE);
    allciphertext.push(...ciphertext);

    if (mode === 'decrypt' && ivBits && block < numBlocks - 1) {
      const nextBlockBits = paddedBits.slice((block + 1) * 64, (block + 2) * 64);
      const decryptedAfterSwap = permute(nextBlockBits, IP_TABLE);
      previousCiphertext = decryptedAfterSwap;
    } else {
      previousCiphertext = ciphertext;
    }
  }

  return { ciphertextBits: allciphertext, numBlocks };
}

export function desEncrypt(plaintextHex: string, keyHex: string, ivHex?: string): DESTrace {
  const inputBits = hexToBits(plaintextHex);
  const keyBits = hexToBits(keyHex);
  const ivBits = ivHex ? hexToBits(ivHex) : undefined;

  const { ciphertextBits, numBlocks } = processBlocks(inputBits, keyBits, 'encrypt', ivBits);
  const ciphertextHex = bitsToHex(ciphertextBits);

  const paddedInput = padInput(inputBits).slice(0, 64);
  const afterIP = permute(paddedInput, IP_TABLE);
  const L0 = afterIP.slice(0, 32);
  const R0 = afterIP.slice(32, 64);

  const keySchedule = generateKeySchedule(keyBits);
  const feistelRounds = runFeistelRounds(L0, R0, keySchedule.rounds, 'encrypt');

  const L16 = feistelRounds[15].L_next;
  const R16 = feistelRounds[15].R_next;
  const afterSwap = [...R16, ...L16];
  const ciphertext = permute(afterSwap, FP_TABLE);

  return {
    mode: 'encrypt',
    inputBits,
    keyBits,
    ivBits,
    cipherMode: ivBits ? 'CBC' : 'ECB',
    afterIP,
    L0,
    R0,
    keySchedule: {
      afterPC1: keySchedule.afterPC1,
      rounds: keySchedule.rounds
    },
    feistelRounds,
    preSwap: { L16: [...L16], R16: [...R16] },
    afterSwap,
    ciphertext,
    ciphertextHex,
    numBlocks
  };
}

export function desDecrypt(ciphertextHex: string, keyHex: string, ivHex?: string): DESTrace {
  const inputBits = hexToBits(ciphertextHex);
  const keyBits = hexToBits(keyHex);
  const ivBits = ivHex ? hexToBits(ivHex) : undefined;

  const { ciphertextBits, numBlocks } = processBlocks(inputBits, keyBits, 'decrypt', ivBits);

  const paddedInput = padInput(inputBits).slice(0, 64);
  const afterIP = permute(paddedInput, IP_TABLE);
  const L0 = afterIP.slice(0, 32);
  const R0 = afterIP.slice(32, 64);

  const keySchedule = generateKeySchedule(keyBits);
  const feistelRounds = runFeistelRounds(L0, R0, keySchedule.rounds, 'decrypt');

  const L16 = feistelRounds[15].L_next;
  const R16 = feistelRounds[15].R_next;
  const afterSwap = [...R16, ...L16];

  return {
    mode: 'decrypt',
    inputBits,
    keyBits,
    ivBits,
    cipherMode: ivBits ? 'CBC' : 'ECB',
    afterIP,
    L0,
    R0,
    keySchedule: {
      afterPC1: keySchedule.afterPC1,
      rounds: keySchedule.rounds
    },
    feistelRounds,
    preSwap: { L16: [...L16], R16: [...R16] },
    afterSwap,
    ciphertext: ciphertextBits,
    ciphertextHex: bitsToHex(ciphertextBits),
    numBlocks
  };
}