import { render, screen } from '@testing-library/react';
import { StepControls } from '../src/components/ui/StepControls';
import { expect, test, vi, beforeEach } from 'vitest';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ChevronLeft: () => <span data-testid="chevron-left" />,
  ChevronRight: () => <span data-testid="chevron-right" />,
  Pause: () => <span data-testid="pause" />,
  Play: () => <span data-testid="play" />
}));

test('StepControls Component renders with correct step information', () => {
  render(<StepControls 
    currentStep={5} 
    totalSteps={10} 
    isPlaying={false} 
    speed={1} 
    onPrev={vi.fn()} 
    onNext={vi.fn()} 
    onTogglePlay={vi.fn()} 
    onSpeedChange={vi.fn()} 
  />);

  expect(screen.getByText('Step 6 of 10')).toBeInTheDocument(); // currentStep is 0-indexed
});

test('StepControls Component calls prev handler when previous button is clicked', () => {
  const mockPrev = vi.fn();
  const mockNext = vi.fn();
  const mockTogglePlay = vi.fn();
  const mockSetSpeed = vi.fn();

  render(<StepControls 
    currentStep={5} 
    totalSteps={10} 
    isPlaying={false} 
    speed={1} 
    onPrev={mockPrev} 
    onNext={mockNext} 
    onTogglePlay={mockTogglePlay} 
    onSpeedChange={mockSetSpeed} 
  />);

  const prevButton = screen.getByLabelText('Previous step');
  prevButton.click();
  expect(mockPrev).toHaveBeenCalledTimes(1);
});

test('StepControls Component calls next handler when next button is clicked', () => {
  const mockPrev = vi.fn();
  const mockNext = vi.fn();
  const mockTogglePlay = vi.fn();
  const mockSetSpeed = vi.fn();

  render(<StepControls 
    currentStep={5} 
    totalSteps={10} 
    isPlaying={false} 
    speed={1} 
    onPrev={mockPrev} 
    onNext={mockNext} 
    onTogglePlay={mockTogglePlay} 
    onSpeedChange={mockSetSpeed} 
  />);

  const nextButton = screen.getByLabelText('Next step');
  nextButton.click();
  expect(mockNext).toHaveBeenCalledTimes(1);
});

test('StepControls Component toggles play/pause button correctly', () => {
  const mockPrev = vi.fn();
  const mockNext = vi.fn();
  const mockTogglePlay = vi.fn();
  const mockSetSpeed = vi.fn();

  render(<StepControls 
    currentStep={5} 
    totalSteps={10} 
    isPlaying={false} 
    speed={1} 
    onPrev={mockPrev} 
    onNext={mockNext} 
    onTogglePlay={mockTogglePlay} 
    onSpeedChange={mockSetSpeed} 
  />);

  const playButton = screen.getByLabelText('Play');
  playButton.click();
  expect(mockTogglePlay).toHaveBeenCalledTimes(1);

  // Re-render with isPlaying={true}
  render(<StepControls 
    currentStep={5} 
    totalSteps={10} 
    isPlaying={true} 
    speed={1} 
    onPrev={mockPrev} 
    onNext={mockNext} 
    onTogglePlay={mockTogglePlay} 
    onSpeedChange={mockSetSpeed} 
  />);

  const pauseButton = screen.getByLabelText('Pause');
  pauseButton.click();
  expect(mockTogglePlay).toHaveBeenCalledTimes(2);
});

test('StepControls Component calls setSpeed handler when speed button is clicked', () => {
  const mockPrev = vi.fn();
  const mockNext = vi.fn();
  const mockTogglePlay = vi.fn();
  const mockSetSpeed = vi.fn();

  render(<StepControls 
    currentStep={5} 
    totalSteps={10} 
    isPlaying={false} 
    speed={1} 
    onPrev={mockPrev} 
    onNext={mockNext} 
    onTogglePlay={mockTogglePlay} 
    onSpeedChange={mockSetSpeed} 
  />);

  const speedButton = screen.getByTitle('Set speed to 2x');
  speedButton.click();
  expect(mockSetSpeed).toHaveBeenCalledWith(2);
});

test('StepControls Component disables previous button when at first step', () => {
  const mockPrev = vi.fn();
  const mockNext = vi.fn();
  const mockTogglePlay = vi.fn();
  const mockSetSpeed = vi.fn();

  render(<StepControls 
    currentStep={0} 
    totalSteps={10} 
    isPlaying={false} 
    speed={1} 
    onPrev={mockPrev} 
    onNext={mockNext} 
    onTogglePlay={mockTogglePlay} 
    onSpeedChange={mockSetSpeed} 
  />);

  const prevButton = screen.getByLabelText('Previous step');
  expect(prevButton).toBeDisabled();
});

test('StepControls Component disables next button when at last step', () => {
  const mockPrev = vi.fn();
  const mockNext = vi.fn();
  const mockTogglePlay = vi.fn();
  const mockSetSpeed = vi.fn();

  render(<StepControls 
    currentStep={9} 
    totalSteps={10} 
    isPlaying={false} 
    speed={1} 
    onPrev={mockPrev} 
    onNext={mockNext} 
    onTogglePlay={mockTogglePlay} 
    onSpeedChange={mockSetSpeed} 
  />);

  const nextButton = screen.getByLabelText('Next step');
  expect(nextButton).toBeDisabled();
});