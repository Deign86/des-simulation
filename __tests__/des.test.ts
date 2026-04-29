import { describe, it, expect } from 'vitest';
import { desEncrypt, desDecrypt } from '../src/lib/des';

describe('DES Engine', () => {
  const PLAINTEXT = '0123456789ABCDEF';
  const KEY = '133457799BBCDFF1';
  const CIPHERTEXT = '85E813540F0AB405';

  it('should encrypt correctly (NIST test vector)', () => {
    const trace = desEncrypt(PLAINTEXT, KEY);
    expect(trace.ciphertextHex).toBe(CIPHERTEXT);
  });

  it('should decrypt correctly (roundtrip)', () => {
    const trace = desDecrypt(CIPHERTEXT, KEY);
    expect(trace.ciphertextHex).toBe(PLAINTEXT);
  });

  it('should satisfy Decrypt(Encrypt(P, K), K) === P', () => {
    const encryptTrace = desEncrypt(PLAINTEXT, KEY);
    const decryptTrace = desDecrypt(encryptTrace.ciphertextHex, KEY);
    expect(decryptTrace.ciphertextHex).toBe(PLAINTEXT);
  });
});
