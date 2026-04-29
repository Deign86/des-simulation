import { render, screen, fireEvent } from '@testing-library/react';
import InputPanel from '../src/components/input/InputPanel';
import { expect, test, vi } from 'vitest';

vi.mock('../src/lib/utils', () => ({ cn: (...classes: string[]) => classes.join(' ') }));

test('InputPanel Component renders input fields for encryption mode', () => {
  render(
    <InputPanel
      mode="encrypt"
      onRun={() => {}}
      loading={false}
    />
  );
  expect(screen.getByLabelText('Plaintext input')).toBeInTheDocument();
  expect(screen.getByLabelText('Secret key input')).toBeInTheDocument();
});

test('InputPanel Component renders input fields for decryption mode', () => {
  render(
    <InputPanel
      mode="decrypt"
      onRun={() => {}}
      loading={false}
    />
  );
  expect(screen.getByLabelText('Ciphertext input')).toBeInTheDocument();
  expect(screen.getByLabelText('Secret key input')).toBeInTheDocument();
});

test('InputPanel Component disables run button when loading', () => {
  render(
    <InputPanel
      mode="encrypt"
      onRun={() => {}}
      loading={true}
    />
  );
  const button = screen.getByRole('button', { name: /Computing/i });
  expect(button).toBeDisabled();
});

test('InputPanel Component calls onRun handler when form is submitted', () => {
  const onRun = vi.fn();
  render(
    <InputPanel
      mode="encrypt"
      onRun={onRun}
      loading={false}
    />
  );
  
  const input = screen.getByLabelText('Plaintext input');
  const key = screen.getByLabelText('Secret key input');
  const button = screen.getByRole('button', { name: /Walk Through/i });
  
  fireEvent.change(input, { target: { value: '0123456789ABCDEF' } });
  fireEvent.change(key, { target: { value: '133457799BBCDFF1' } });
  fireEvent.click(button);
  
  expect(onRun).toHaveBeenCalledWith('0123456789ABCDEF', '133457799BBCDFF1', undefined);
});

test('InputPanel Component passes IV when provided', () => {
  const onRun = vi.fn();
  render(
    <InputPanel
      mode="encrypt"
      onRun={onRun}
      loading={false}
    />
  );
  
  const input = screen.getByLabelText('Plaintext input');
  const key = screen.getByLabelText('Secret key input');
  const ivInput = document.querySelectorAll('input[type="text"]')[2];
  const button = screen.getByRole('button', { name: /Walk Through/i });
  
  fireEvent.change(input, { target: { value: '0123456789ABCDEF' } });
  fireEvent.change(key, { target: { value: '133457799BBCDFF1' } });
  fireEvent.change(ivInput, { target: { value: '1234567890ABCDEF' } });
  fireEvent.click(button);
  
  expect(onRun).toHaveBeenCalledWith('0123456789ABCDEF', '133457799BBCDFF1', '1234567890ABCDEF');
});