import { DESTrace, Step, DESStage } from '../types/des.types';

export function buildStepList(trace: DESTrace): Step[] {
  const steps: Step[] = [];
  const { mode, keySchedule, feistelRounds } = trace;

  // Step 1: Input
  steps.push({
    id: 'input',
    label: 'Input',
    stage: 'input',
    data: { inputBits: trace.inputBits, keyBits: trace.keyBits, mode: trace.mode }
  });

  // Step 2: Initial Permutation
  steps.push({
    id: 'ip',
    label: 'Initial Permutation (IP)',
    stage: 'ip',
    data: { afterIP: trace.afterIP, L0: trace.L0, R0: trace.R0 }
  });

  // Key Schedule rounds (16 steps)
  keySchedule.rounds.forEach((round, i) => {
    steps.push({
      id: `ks-round-${i + 1}`,
      label: `Key Schedule Round ${i + 1}`,
      stage: 'key-schedule',
      roundIndex: i,
      data: { keySchedule: { afterPC1: keySchedule.afterPC1, rounds: [round] } }
    });
  });

  // Feistel rounds (16 rounds × 5 substeps = 80 steps)
  feistelRounds.forEach((round, i) => {
    const roundNum = round.round;
    steps.push({
      id: `feistel-${roundNum}-expand`,
      label: `Round ${roundNum}: Expansion (E)`,
      stage: 'feistel',
      roundIndex: i,
      subStep: 'expand',
      data: { feistelRounds: [round] }
    });
    steps.push({
      id: `feistel-${roundNum}-xor`,
      label: `Round ${roundNum}: XOR with K${roundNum}`,
      stage: 'feistel',
      roundIndex: i,
      subStep: 'xor',
      data: { feistelRounds: [round] }
    });
    steps.push({
      id: `feistel-${roundNum}-sbox`,
      label: `Round ${roundNum}: S-Box Substitution`,
      stage: 'feistel',
      roundIndex: i,
      subStep: 'sbox',
      data: { feistelRounds: [round] }
    });
    steps.push({
      id: `feistel-${roundNum}-pbox`,
      label: `Round ${roundNum}: P-Box Permutation`,
      stage: 'feistel',
      roundIndex: i,
      subStep: 'pbox',
      data: { feistelRounds: [round] }
    });
    steps.push({
      id: `feistel-${roundNum}-result`,
      label: `Round ${roundNum}: Result (L${roundNum}, R${roundNum})`,
      stage: 'feistel',
      roundIndex: i,
      subStep: 'result',
      data: { feistelRounds: [round] }
    });
  });

  // Swap step
  steps.push({
    id: 'swap',
    label: 'Swap L16 and R16',
    stage: 'swap',
    data: { preSwap: trace.preSwap, afterSwap: trace.afterSwap }
  });

  // Final Permutation
  steps.push({
    id: 'fp',
    label: 'Final Permutation (FP)',
    stage: 'fp',
    data: { ciphertext: trace.ciphertext }
  });

  // Output
  steps.push({
    id: 'output',
    label: 'Output',
    stage: 'output',
    data: { ciphertext: trace.ciphertext, ciphertextHex: trace.ciphertextHex }
  });

  return steps;
}
