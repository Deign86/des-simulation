import { IP_TABLE, FP_TABLE, PC1_TABLE, PC2_TABLE, E_TABLE, P_TABLE, S_BOXES, SHIFT_SCHEDULE } from './des-tables';
import { hexToBits, bitsToHex, permute, xorBits, leftRotate, sboxLookup } from './des-utils';
import type { DESTrace, FeistelRoundTrace, KeyScheduleRound, SBoxTrace } from '../types/des.types';

function generateKeySchedule(keyBits: number[]): { afterPC1: { C0: number[], D0: number[] }, rounds: KeyScheduleRound[] } {
  const pc1Result = permute(keyBits, PC1_TABLE);
  const C0 = pc1Result.slice(0, 28);
  const D0 = pc1Result.slice(28, 56);

  const rounds: KeyScheduleRound[] = [];
  let C = [...C0];
  let D = [...D0];

  for (let i = 0; i < 16; i++) {
    const shift = SHIFT_SCHEDULE[i];
    C = leftRotate(C, shift);
    D = leftRotate(D, shift);

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

  const subkeys = mode === 'encrypt' ? keySchedule : [...keySchedule].reverse();

  for (let i = 0; i < 16; i++) {
    const subkey = subkeys[i].subkey;
    const roundNum = mode === 'encrypt' ? i + 1 : 16 - i;

    const expanded = permute(R, E_TABLE);
    const xorResult = xorBits(expanded, subkey);

    const sboxTraces: SBoxTrace[] = [];
    const sboxOutputs: number[] = [];
    for (let j = 0; j < 8; j++) {
      const input6 = xorResult.slice(j * 6, (j + 1) * 6);
      const { output4, row, col } = sboxLookup(input6, S_BOXES[j] as unknown as number[][]);
      sboxTraces.push({
        sboxIndex: j,
        input6: [...input6],
        row,
        col,
        output4: [...output4]
      });
      sboxOutputs.push(...output4);
    }

    const pboxOutput = permute(sboxOutputs, P_TABLE);
    const L_next = [...R];
    const R_next = xorBits(L, pboxOutput);

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

function processBlocks(inputBits: number[], keyBits: number[], mode: 'encrypt' | 'decrypt') {
  const paddedBits = padInput(inputBits);
  const numBlocks = Math.ceil(paddedBits.length / 64);
  const allCiphertext: number[] = [];

  for (let block = 0; block < numBlocks; block++) {
    const blockBits = paddedBits.slice(block * 64, (block + 1) * 64);
    const afterIP = permute(blockBits, IP_TABLE);
    const L0 = afterIP.slice(0, 32);
    const R0 = afterIP.slice(32, 64);

    const keySchedule = generateKeySchedule(keyBits);
    const feistelRounds = runFeistelRounds(L0, R0, keySchedule.rounds, mode);

    const L16 = feistelRounds[15].L_next;
    const R16 = feistelRounds[15].R_next;
    const afterSwap = [...R16, ...L16];

    const ciphertext = permute(afterSwap, FP_TABLE);
    allCiphertext.push(...ciphertext);
  }

  return { ciphertextBits: allCiphertext, numBlocks };
}

export function desEncrypt(plaintextHex: string, keyHex: string): DESTrace {
  const inputBits = hexToBits(plaintextHex);
  const keyBits = hexToBits(keyHex);

  const { ciphertextBits, numBlocks } = processBlocks(inputBits, keyBits, 'encrypt');
  const ciphertextHex = bitsToHex(ciphertextBits);

  const afterIP = permute(padInput(inputBits).slice(0, 64), IP_TABLE);
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

export function desDecrypt(ciphertextHex: string, keyHex: string): DESTrace {
  const inputBits = hexToBits(ciphertextHex);
  const keyBits = hexToBits(keyHex);

  const { ciphertextBits, numBlocks } = processBlocks(inputBits, keyBits, 'decrypt');

  const afterIP = permute(inputBits.slice(0, 64), IP_TABLE);
  const L0 = afterIP.slice(0, 32);
  const R0 = afterIP.slice(32, 64);

  const keySchedule = generateKeySchedule(keyBits);
  const feistelRounds = runFeistelRounds(L0, R0, keySchedule.rounds, 'decrypt');

  const L16 = feistelRounds[15].L_next;
  const R16 = feistelRounds[15].R_next;
  const afterSwap = [...R16, ...L16];

  const ciphertext = permute(afterSwap, FP_TABLE);

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
    preSwap: { L16: [...L16], R16: [...R16] },
    afterSwap,
    ciphertext: ciphertextBits,
    ciphertextHex: bitsToHex(ciphertextBits),
    numBlocks
  };
}
