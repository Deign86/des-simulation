import { useState, useCallback } from 'react';
import { desEncrypt, desDecrypt } from '../lib/des';
import { DESTrace } from '../types/des.types';

export function useDES() {
  const [trace, setTrace] = useState<DESTrace | null>(null);
  const [loading, setLoading] = useState(false);

  const runEncrypt = useCallback((plaintextHex: string, keyHex: string) => {
    setLoading(true);
    // Use setTimeout to avoid blocking UI thread
    setTimeout(() => {
      const result = desEncrypt(plaintextHex, keyHex);
      setTrace(result);
      setLoading(false);
    }, 50);
  }, []);

  const runDecrypt = useCallback((ciphertextHex: string, keyHex: string) => {
    setLoading(true);
    setTimeout(() => {
      const result = desDecrypt(ciphertextHex, keyHex);
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
