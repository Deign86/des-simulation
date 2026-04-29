import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface BitStringProps {
  bits: number[];
  prevBits?: number[];
  groupSize?: number;
  label?: string;
  showHex?: boolean;
  accentColor?: string;
}

export default function BitString({
  bits,
  prevBits,
  groupSize = 4,
  label,
  showHex = true,
  accentColor = 'cyan'
}: BitStringProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // WAAPI: Pulse animation on changed bits (transform scale + opacity)
  useEffect(() => {
    if (!containerRef.current || !prevBits) return;
    const bitEls = containerRef.current.querySelectorAll('[data-bit]');
    bitEls.forEach((el, i) => {
      if (prevBits[i] !== bits[i]) {
        (el as HTMLElement).animate(
          [
            { transform: 'scale(1)', backgroundColor: 'rgba(244, 63, 94, 0.4)' },
            { transform: 'scale(1.2)', backgroundColor: 'rgba(244, 63, 94, 0.1)' },
            { transform: 'scale(1)', backgroundColor: 'transparent' }
          ],
          { duration: 400, easing: 'ease-out' }
        );
      }
    });
  }, [bits, prevBits]);

  const groups = [];
  for (let i = 0; i < bits.length; i += groupSize) {
    groups.push(bits.slice(i, i + groupSize));
  }

  return (
    <div className="space-y-2">
      {label && <div className="text-xs text-gray-400 font-sans">{label}</div>}
      <div ref={containerRef} className="font-mono text-sm flex flex-wrap gap-1">
        {groups.map((group, gi) => (
          <div key={gi} className="flex gap-0.5">
            {group.map((bit, bi) => {
              const idx = gi * groupSize + bi;
              const changed = prevBits && prevBits[idx] !== bit;
              return (
                <span
                  key={idx}
                  data-bit={idx}
                  className={`w-5 text-center rounded ${
                    changed ? 'text-rose-400' : 'text-gray-200'
                  }`}
                >
                  {bit}                </span>
              );
            })}
            {gi < groups.length - 1 && <span className="w-2" />}
          </div>
        ))}
      </div>
      {showHex && (
        <div className="font-mono text-xs text-gray-500">
          {bits.length > 0 ? Array.from({ length: Math.ceil(bits.length / 4) }, (_, i) => {
            const nibble = bits.slice(i * 4, i * 4 + 4);
            return parseInt(nibble.join(''), 2).toString(16).toUpperCase();
          }).join('') : ''}
        </div>
      )}
    </div>
  );
}
