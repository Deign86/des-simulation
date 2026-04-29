import { useState, useCallback, useEffect, useRef } from 'react';
import type { DESTrace, Step } from '../types/des.types';
import { buildStepList } from '../lib/des-trace';

export function useStepPlayer(trace: DESTrace | null) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const steps: Step[] = trace ? buildStepList(trace) : [];
  const totalSteps = steps.length;

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, [totalSteps]);

  const next = useCallback(() => {
    goToStep(currentStep + 1);
  }, [currentStep, goToStep]);

  const prev = useCallback(() => {
    goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  useEffect(() => {
    if (isPlaying && currentStep < totalSteps - 1) {
      playTimerRef.current = setTimeout(() => {
        goToStep(currentStep + 1);
      }, 1000 / speed);
    }
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, currentStep, speed, totalSteps, goToStep]);

  // Reset when trace changes - use a ref to avoid stale closure issues
  const prevTraceRef = useRef<DESTrace | null>(null);
  useEffect(() => {
    if (trace !== prevTraceRef.current) {
      prevTraceRef.current = trace;
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [trace]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  return {
    currentStep,
    totalSteps,
    currentStepData: steps[currentStep] || null,
    isPlaying,
    speed,
    next,
    prev,
    goToStep,
    togglePlay,
    setSpeed,
    reset,
    steps
  };
}
