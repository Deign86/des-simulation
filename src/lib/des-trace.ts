import type { DESTrace, Step } from '../types/des.types';

export function buildStepList(trace: DESTrace): Step[] {
  const steps: Step[] = [];
  const { keySchedule, feistelRounds } = trace;

  steps.push({
    id: 'input',
    label: 'Input',
    stage: 'input',
    data: { inputBits: trace.inputBits, keyBits: trace.keyBits, mode: trace.mode }
  });

  steps.push({
    id: 'ip',
    label: 'Initial Permutation (IP)',
    stage: 'ip',
    data: { afterIP: trace.afterIP, L0: trace.L0, R0: trace.R0 }
  });

  keySchedule.rounds.forEach((round, i) => {
    steps.push({
      id: `ks-round-${i + 1}`,
      label: `Key Schedule Round ${i + 1}`,
      stage: 'key-schedule',
      roundIndex: i,
      data: { keySchedule: { afterPC1: keySchedule.afterPC1, rounds: [round] } }
    });
  });

  feistelRounds.forEach((round, i) => {
    const roundNum = round.round;
    ['expand', 'xor', 'sbox', 'pbox', 'result'].forEach(subStep => {
      steps.push({
        id: `feistel-${roundNum}-${subStep}`,
        label: `Round ${roundNum}: ${subStep.charAt(0).toUpperCase() + subStep.slice(1)}`,
        stage: 'feistel',
        roundIndex: i,
        subStep: subStep as Step['subStep'],
        data: { feistelRounds: [round] }
      });
    });
  });

  steps.push({
    id: 'swap',
    label: 'Swap L16 and R16',
    stage: 'swap',
    data: { preSwap: trace.preSwap, afterSwap: trace.afterSwap }
  });

  steps.push({
    id: 'fp',
    label: 'Final Permutation (FP)',
    stage: 'fp',
    data: { ciphertext: trace.ciphertext }
  });

  steps.push({
    id: 'output',
    label: 'Output',
    stage: 'output',
    data: { ciphertext: trace.ciphertext, ciphertextHex: trace.ciphertextHex }
  });

  return steps;
}
