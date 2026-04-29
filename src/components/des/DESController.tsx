import { motion } from 'framer-motion';
import type { DESTrace, Step } from '../../types/des.types';
import StageIP from './StageIP';
import StageKeySchedule from './StageKeySchedule';
import StageFeistel from './StageFeistel';
import StageSBoxes from './StageSBoxes';
import StageFP from './StageFP';
import OutputPanel from './OutputPanel';
import BitString from '../ui/BitString';

interface DESControllerProps {
  trace: DESTrace;
  currentStep: number;
  steps: Step[];
  totalSteps?: number;
}

export default function DESController({ trace, currentStep, steps, totalSteps }: DESControllerProps) {
  const step = steps[currentStep];
  if (!step) return null;

  const renderStepContent = () => {
    switch (step.stage) {
      case 'input':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-xl font-bold text-white">Input Data</h2>
            <div className="glass p-4">
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Plaintext (64-bit)</div>
                <BitString bits={trace.inputBits} groupSize={8} showHex />
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Key (64-bit)</div>
                <BitString bits={trace.keyBits} groupSize={8} showHex />
              </div>
            </div>
          </motion.div>
        );

      case 'ip':
        return <StageIP trace={trace} isActive />;

      case 'key-schedule':
        return (
          <StageKeySchedule
            rounds={trace.keySchedule.rounds}
            activeRound={step.roundIndex !== undefined ? step.roundIndex + 1 : undefined}
          />
        );

      case 'feistel':
        if (step.roundIndex !== undefined) {
          const round = trace.feistelRounds[step.roundIndex];
          return (
            <div className="space-y-4">
              <StageFeistel round={round} activeSubStep={step.subStep} />
              {step.subStep === 'sbox' && (
                <StageSBoxes sboxTraces={round.sboxTraces} round={round.round} />
              )}
            </div>
          );
        }
        return null;

      case 'swap':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">Swap L16 and R16</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">L16</div>
                <BitString bits={trace.preSwap.L16} groupSize={8} />
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">R16</div>
                <BitString bits={trace.preSwap.R16} groupSize={8} />
              </div>
            </div>
            <div className="pt-3 border-t border-white/5">
              <div className="text-xs text-gray-400 mb-1">After Swap (R16 + L16)</div>
              <BitString bits={trace.afterSwap} groupSize={8} showHex />
            </div>
          </motion.div>
        );

      case 'fp':
        return <StageFP trace={trace} isActive />;

      case 'output':
        return <OutputPanel trace={trace} mode={trace.mode} totalSteps={totalSteps} />;

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {renderStepContent()}
    </div>
  );
}