import { memo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface StepControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
}

const SPEEDS = [0.5, 1, 2, 3];

export default function StepControls({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPrev,
  onNext,
  onTogglePlay,
  onSpeedChange
}: StepControlsProps) {
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;
  const containerRef = useRef<HTMLDivElement>(null);

  // WAAPI: Animate progress bar with transform: scaleX (performant)
  useEffect(() => {
    const bar = containerRef.current?.querySelector('[data-progress]') as HTMLElement;
    if (!bar) return;
    bar.animate(
      [{ transform: `scaleX(${progress / 100})` }],
      { duration: 300, fill: 'forwards', easing: 'ease-in-out' }
    );
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      {/* Progress bar */}
      <div className="w-full max-w-2xl h-0.5 bg-white/10 rounded-full mb-3 overflow-hidden">
        <div
          data-progress
          className="h-full bg-cyan-400 origin-left"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>

      {/* Controls pill */}
      <div className="glass rounded-full px-4 py-2 flex items-center gap-3 shadow-lg shadow-black/20">
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          title="Previous step"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />        </button>

        <span className="font-mono text-sm min-w-[100px] text-center">
          Step {currentStep + 1} / {totalSteps}        </span>

        <button
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
          title="Next step"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />        </button>

        <div className="w-px h-6 bg-white/10" />

        <button
          onClick={onTogglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}        </button>

        <div className="flex gap-1">
          {SPEEDS.map(s => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              title={`Set speed to ${s}x`}
              className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                speed === s ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10'
              }`}
            >
              {s}x            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-white/10" />

        <button
          onClick={() => {
            for (let i = currentStep; i < totalSteps - 1; i++) onNext();
          }}
          disabled={currentStep === totalSteps - 1}
          title="Skip to end"
          className="px-2 py-1 rounded text-xs font-mono hover:bg-white/10 transition-colors disabled:opacity-30"
        >
          Skip →        </button>
      </div>
    </motion.div>
  );
}

export default memo(StepControls, (prevProps, nextProps) => {
  // Only re-render if relevant props change
  return (
    prevProps.currentStep === nextProps.currentStep &&
    prevProps.totalSteps === nextProps.totalSteps &&
    prevProps.isPlaying === nextProps.isPlaying &&
    prevProps.speed === nextProps.speed
  );
});

const SPEEDS = [0.5, 1, 2, 3];

export default function StepControls({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPrev,
  onNext,
  onTogglePlay,
  onSpeedChange
}: StepControlsProps) {
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;
  const containerRef = useRef<HTMLDivElement>(null);

  // WAAPI: Animate progress bar with transform: scaleX (performant)
  useEffect(() => {
    const bar = containerRef.current?.querySelector('[data-progress]') as HTMLElement;
    if (!bar) return;
    bar.animate(
      [{ transform: `scaleX(${progress / 100})` }],
      { duration: 300, fill: 'forwards', easing: 'ease-in-out' }
    );
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      {/* Progress bar */}
      <div className="w-full max-w-2xl h-0.5 bg-white/10 rounded-full mb-3 overflow-hidden">
        <div
          data-progress
          className="h-full bg-cyan-400 origin-left"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>

      {/* Controls pill */}
      <div className="glass rounded-full px-4 py-2 flex items-center gap-3 shadow-lg shadow-black/20">
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          title="Previous step"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />        </button>

        <span className="font-mono text-sm min-w-[100px] text-center">
          Step {currentStep + 1} / {totalSteps}        </span>

        <button
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
          title="Next step"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />        </button>

        <div className="w-px h-6 bg-white/10" />

        <button
          onClick={onTogglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}        </button>

        <div className="flex gap-1">
          {SPEEDS.map(s => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              title={`Set speed to ${s}x`}
              className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                speed === s ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10'
              }`}
            >
              {s}x            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-white/10" />

        <button
          onClick={() => {
            for (let i = currentStep; i < totalSteps - 1; i++) onNext();
          }}
          disabled={currentStep === totalSteps - 1}
          title="Skip to end"
          className="px-2 py-1 rounded text-xs font-mono hover:bg-white/10 transition-colors disabled:opacity-30"
        >
          Skip →        </button>
      </div>
    </motion.div>
  );
}
