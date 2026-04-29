import { render, screen } from '@testing-library/react';
import Button from '../src/components/ui/button';
import { expect, test, vi } from 'vitest';

vi.mock('../src/lib/utils', () => ({ cn: (...classes: string[]) => classes.join(' ') }));

test('Button Component renders with default props', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});

test('Button Component applies variant classes correctly', () => {
  render(<Button variant="outline">Outline Button</Button>);
  const button = screen.getByRole('button');
  expect(button).toHaveClass('border');
  expect(button).toHaveClass('border-input');
});

test('Button Component handles click events', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  const button = screen.getByRole('button');
  button.click();
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('Button Component respects disabled state', () => {
  render(<Button disabled>Disabled Button</Button>);
  const button = screen.getByRole('button');
  expect(button).toBeDisabled();
});