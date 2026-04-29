import { render, screen, fireEvent } from '@testing-library/react';
import StepControls from '../src/components/ui/StepControls';
import { expect, test, vi } from 'vitest';

vi.mock('../src/lib/utils', () => ({ cn: (...classes: string[]) => classes.join(' ') }));

test('StepControls Component renders with correct step information', () => {
  render(
    <StepControls
      currentStep={5}
      totalSteps={10}
      isPlaying={false}
      speed={1}
      onPrev={() => {}}
      onNext={() => {}}
      onTogglePlay={() => {}}
      onSpeedChange={() => {}}
    />
  );
  expect(screen.getByText('Step 6 / 10')).toBeInTheDocument();
});

test('StepControls Component calls prev handler when previous button is clicked', () => {
  const onPrev = vi.fn();
  render(
    <StepControls
      currentStep={5}
      totalSteps={10}
      isPlaying={false}
      speed={1}
      onPrev={onPrev}
      onNext={() => {}}
      onTogglePlay={() => {}}
      onSpeedChange={() => {}}
    />
  );
  const prevButtons = screen.getAllByTitle('Previous step');
  fireEvent.click(prevButtons[0]);
  expect(onPrev).toHaveBeenCalledTimes(1);
});

test('StepControls Component calls next handler when next button is clicked', () => {
  const onNext = vi.fn();
  render(
    <StepControls
      currentStep={5}
      totalSteps={10}
      isPlaying={false}
      speed={1}
      onPrev={() => {}}
      onNext={onNext}
      onTogglePlay={() => {}}
      onSpeedChange={() => {}}
    />
  );
  const nextButtons = screen.getAllByTitle('Next step');
  fireEvent.click(nextButtons[0]);
  expect(onNext).toHaveBeenCalledTimes(1);
});

test('StepControls Component toggles play/pause button correctly', () => {
  const onTogglePlay = vi.fn();
  render(
    <StepControls
      currentStep={5}
      totalSteps={10}
      isPlaying={false}
      speed={1}
      onPrev={() => {}}
      onNext={() => {}}
      onTogglePlay={onTogglePlay}
      onSpeedChange={() => {}}
    />
  );
  const playButton = screen.getByTitle('Play');
  fireEvent.click(playButton);
  expect(onTogglePlay).toHaveBeenCalledTimes(1);
});

test('StepControls Component calls setSpeed handler when speed button is clicked', () => {
  const onSpeedChange = vi.fn();
  render(
    <StepControls
      currentStep={5}
      totalSteps={10}
      isPlaying={false}
      speed={1}
      onPrev={() => {}}
      onNext={() => {}}
      onTogglePlay={() => {}}
      onSpeedChange={onSpeedChange}
    />
  );
  const speedButtons = screen.getAllByTitle('Set speed to 2x');
  fireEvent.click(speedButtons[0]);
  expect(onSpeedChange).toHaveBeenCalledWith(2);
});

test('StepControls Component disables previous button when at first step', () => {
  render(
    <StepControls
      currentStep={0}
      totalSteps={10}
      isPlaying={false}
      speed={1}
      onPrev={() => {}}
      onNext={() => {}}
      onTogglePlay={() => {}}
      onSpeedChange={() => {}}
    />
  );
  const prevButtons = screen.getAllByTitle('Previous step');
  expect(prevButtons[0]).toBeDisabled();
});

test('StepControls Component disables next button when at last step', () => {
  render(
    <StepControls
      currentStep={9}
      totalSteps={10}
      isPlaying={false}
      speed={1}
      onPrev={() => {}}
      onNext={() => {}}
      onTogglePlay={() => {}}
      onSpeedChange={() => {}}
    />
  );
  const nextButtons = screen.getAllByTitle('Next step');
  expect(nextButtons[0]).toBeDisabled();
});