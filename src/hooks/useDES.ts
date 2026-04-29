import { useState, useCallback } from 'react';
import { desEncrypt, desDecrypt } from '../lib/des';
import type { DESTrace } from '../types/des.types';

export function useDES() {
  const [trace, setTrace] = useState<DESTrace | null>(null);
  const [loading, setLoading] = useState(false);

  const runEncrypt = useCallback((plaintextHex: string, keyHex: string, ivHex?: string) => {
    setLoading(true);
    setTimeout(() => {
      const result = desEncrypt(plaintextHex, keyHex, ivHex);
      setTrace(result);
      setLoading(false);
    }, 50);
  }, []);

  const runDecrypt = useCallback((ciphertextHex: string, keyHex: string, ivHex?: string) => {
    setLoading(true);
    setTimeout(() => {
      const result = desDecrypt(ciphertextHex, keyHex, ivHex);
      setTrace(result);
      setLoading(false);
    }, 50);
  }, []);

  const reset = useCallback(() => {
    setTrace(null);
    setLoading(false);
  }, []);

  return { trace, loading, runEncrypt, runDecrypt, reset };
}