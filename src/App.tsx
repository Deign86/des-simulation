import { useState, createContext, useContext, type ReactNode, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from './components/hero/HeroSection';
import InputPanel from './components/input/InputPanel';
import DESController from './components/des/DESController';
import OutputPanel from './components/des/OutputPanel';
import StepControls from './components/ui/StepControls';
import EducationalSidebar from './components/ui/EducationalSidebar';
import ConfirmDialog from './components/ui/ConfirmDialog';
import { useDES } from './hooks/useDES';
import { useStepPlayer } from './hooks/useStepPlayer';
import AnimatedBackground from './components/ui/AnimatedBackground';
import { Lock, Unlock } from 'lucide-react';

// Mode Context
interface ModeContextValue {
  mode: 'encrypt' | 'decrypt';
  toggleMode: () => void;
}
const ModeContext = createContext<ModeContextValue | null>(null);
export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}

const ModeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const toggleMode = () => setMode(prev => prev === 'encrypt' ? 'decrypt' : 'encrypt');
  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export default function App() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const toggleMode = () => setMode(prev => prev === 'encrypt' ? 'decrypt' : 'encrypt');
  const [stage, setStage] = useState<'hero' | 'input' | 'simulation' | 'results'>('hero');
  const [showConfirm, setShowConfirm] = useState(false);
  const { trace, loading, runEncrypt, runDecrypt, reset: resetDES } = useDES();
  const { currentStep, totalSteps, currentStepData, isPlaying, speed, next, prev, togglePlay, setSpeed, reset: resetStep, steps } = useStepPlayer(trace);

  const handleRun = (inputHex: string, keyHex: string, ivHex?: string) => {
    if (mode === 'encrypt') runEncrypt(inputHex, keyHex, ivHex);
    else runDecrypt(inputHex, keyHex, ivHex);
    setStage('simulation');
  };

  const handleReset = (targetStage: 'hero' | 'input' = 'hero') => {
    resetDES();
    resetStep();
    setStage(targetStage);
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 bg-[#030303] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/[0.08] via-transparent to-blue-300/[0.08] pointer-events-none" />
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {/* Stage 1: Hero/Landing */}
              {stage === 'hero' && (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <HeroSection onStart={() => setStage('input')} />
                </motion.div>
              )}

              {/* Stage 2: Input */}
              {stage === 'input' && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-2xl mx-auto min-h-screen py-12 px-4"
                >
<button
                    onClick={() => setShowConfirm(true)}
                    aria-label="Back to home"
                    className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                  </button>
                  <ConfirmDialog
                    isOpen={showConfirm}
                    title="Clear Input Data?"
                    message="This will clear all your input data. You will need to re-enter your plaintext/ciphertext, key, and IV."
                    confirmLabel="Clear & Go Home"
                    cancelLabel="Keep Editing"
                    variant="warning"
                    onConfirm={() => { setShowConfirm(false); handleReset('hero'); }}
                    onCancel={() => setShowConfirm(false)}
                  />
                 <div className="flex justify-end mb-4">
                   <button
                     onClick={toggleMode}
                     aria-label={mode === 'encrypt' ? 'Switch to decrypt mode' : 'Switch to encrypt mode'}
                     className="px-4 py-2 bg-white/5 rounded-lg text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                   >
                     {mode === 'encrypt' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                     {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'} (click to toggle)
                   </button>
                 </div>
                  <InputPanel mode={mode} onRun={handleRun} loading={loading} />
                </motion.div>
              )}

              {/* Stage 3: Simulation Visualization */}
              {stage === 'simulation' && trace && (
                <motion.div
                  key="simulation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-7xl mx-auto space-y-6 min-h-screen py-12 px-4"
                >
                  <div className="flex justify-between">
                    <button
                      onClick={() => setStage('input')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Input
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { resetStep(); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Restart
                      </button>
                      <button
                        onClick={() => setStage('results')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm hover:bg-cyan-500/30 hover:text-cyan-200 transition-all"
                      >
                        View Results
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <DESController trace={trace} currentStep={currentStep} steps={steps} totalSteps={totalSteps} onReset={() => handleReset('input')} />

                  {totalSteps > 0 && (
                    <StepControls
                      currentStep={currentStep}
                      totalSteps={totalSteps}
                      isPlaying={isPlaying}
                      speed={speed}
                      onPrev={prev}
                      onNext={next}
                      onTogglePlay={togglePlay}
                      onSpeedChange={setSpeed}
                    />
                  )}

                  <EducationalSidebar
                    stage={currentStepData?.stage ?? null}
                    isOpen={true}
                    onClose={() => {}}
                  />
                </motion.div>
              )}

              {/* Stage 4: Results */}
              {stage === 'results' && trace && (
                <OutputPanel trace={trace} mode={trace.mode} totalSteps={totalSteps} onReset={() => handleReset('input')} />
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

export function AppWrapper() {
  return (
    <ModeProvider>
      <App />
    </ModeProvider>
  );
}
