import { useState, useEffect, useCallback } from 'react';
import HeroSection from '../components/hero/HeroSection';
import InputPanel from '../components/input/InputPanel';
import DESController from '../components/des/DESController';
import StepControls from '../components/ui/StepControls';
import EducationalSidebar from '../components/ui/EducationalSidebar';
import { useDES } from '../hooks/useDES';
import { useStepPlayer } from '../hooks/useStepPlayer';

export default function SimulationPage() {
  const [showHero, setShowHero] = useState(true);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [showSidebar, setShowSidebar] = useState(false);

  const { trace, loading, runEncrypt, runDecrypt, reset } = useDES();
  const { currentStep, totalSteps, currentStepData, isPlaying, speed, next, prev, togglePlay, setSpeed, reset: resetStep, steps } = useStepPlayer(trace);

  const handleStart = () => setShowHero(false);

  const handleRun = (inputHex: string, keyHex: string) => {
    if (mode === 'encrypt') runEncrypt(inputHex, keyHex);
    else runDecrypt(inputHex, keyHex);
  };

  const handleModeToggle = useCallback(() => {
    setMode(prev => prev === 'encrypt' ? 'decrypt' : 'encrypt');
    reset();
    resetStep();
  }, [reset, resetStep]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
      if (e.key === 'r' || e.key === 'R') { reset(); resetStep(); }
      if (e.key === 'e' || e.key === 'E') { if (mode !== 'encrypt') handleModeToggle(); }
      if (e.key === 'd' || e.key === 'D') { if (mode !== 'decrypt') handleModeToggle(); }
      if (e.key === '?' || e.key === '/') setShowSidebar(prev => !prev);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prev, next, togglePlay, reset, resetStep, mode, handleModeToggle]);

  if (showHero) return <HeroSection onStart={handleStart} />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {!trace && <InputPanel mode={mode} onRun={handleRun} loading={loading} />}

      {trace && (
        <div className="flex gap-6">
          <div className="flex-1">
            <DESController trace={trace} currentStep={currentStep} steps={steps} />
          </div>

          <EducationalSidebar
            stage={currentStepData?.stage ?? null}
            isOpen={showSidebar}
            onClose={() => setShowSidebar(false)}
          />
        </div>
      )}

      {trace && totalSteps > 0 && (
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
    </div>
  );
}
