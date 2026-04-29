import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputPanel } from '../src/components/input/InputPanel';
import { expect, test, vi, beforeEach } from 'vitest';

test('InputPanel Component renders input fields for encryption mode', () => {
  render(<InputPanel mode="encrypt" onRun={() => {}} loading={false} />);
  
  expect(screen.getByLabelText(/plaintext/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/key/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/initialization vector \(optional\)/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /encrypt/i })).toBeInTheDocument();
});

test('InputPanel Component renders input fields for decryption mode', () => {
  render(<InputPanel mode="decrypt" onRun={() => {}} loading={false} />);
  
  expect(screen.getByLabelText(/ciphertext/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/key/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/initialization vector \(optional\)/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /decrypt/i })).toBeInTheDocument();
});

test('InputPanel Component disables run button when loading', async () => {
  render(<InputPanel mode="encrypt" onRun={() => {}} loading={true} />);
  
  const runButton = screen.getByRole('button', { name: /encrypt/i });
  expect(runButton).toBeDisabled();
});

test('InputPanel Component calls onRun handler when form is submitted', async () => {
  const mockOnRun = vi.fn();
  render(<InputPanel mode="encrypt" onRun={mockOnRun} loading={false} />);
  
  const plaintextInput = screen.getByLabelText(/plaintext/i);
  const keyInput = screen.getByLabelText(/key/i);
  const runButton = screen.getByRole('button', { name: /encrypt/i });
  
  await userEvent.type(plaintextInput, '0123456789ABCDEF');
  await userEvent.type(keyInput, '133457799BBCDFF1');
  await userEvent.click(runButton);
  
  expect(mockOnRun).toHaveBeenCalledWith('0123456789ABCDEF', '133457799BBCDFF1', undefined);
});

test('InputPanel Component passes IV when provided', async () => {
  const mockOnRun = vi.fn();
  render(<InputPanel mode="encrypt" onRun={mockOnRun} loading={false} />);
  
  const plaintextInput = screen.getByLabelText(/plaintext/i);
  const keyInput = screen.getByLabelText(/key/i);
  const ivInput = screen.getByLabelText(/initialization vector \(optional\)/i);
  const runButton = screen.getByRole('button', { name: /encrypt/i });
  
  await userEvent.type(plaintextInput, '0123456789ABCDEF');
  await userEvent.type(keyInput, '133457799BBCDFF1');
  await userEvent.type(ivInput, '0000000000000000');
  await userEvent.click(runButton);
  
  expect(mockOnRun).toHaveBeenCalledWith('0123456789ABCDEF', '133457799BBCDFF1', '0000000000000000');
});