import { useEffect, useRef, useState } from 'react';

interface FlipTextProps {
  text: string;
  className?: string;
  delayMs?: number;
}

export default function FlipText({ text, className = '', delayMs = 0 }: FlipTextProps) {
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const letters = text.split('');

  useEffect(() => {
    const startDelay = setTimeout(() => {
      // Animation initiale lettre par lettre
      letters.forEach((_, index) => {
        setTimeout(() => {
          setFlippedIndices(prev => new Set([...prev, index]));
        }, index * 80); // 80ms entre chaque lettre
      });

      // Puis flip toutes les lettres ensemble toutes les 5 secondes
      intervalRef.current = setInterval(() => {
        // Reset toutes les lettres
        setFlippedIndices(new Set());
        
        // Re-flip progressivement
        setTimeout(() => {
          letters.forEach((_, index) => {
            setTimeout(() => {
              setFlippedIndices(prev => new Set([...prev, index]));
            }, index * 80);
          });
        }, 100);
      }, 5000);
    }, delayMs);

    return () => {
      clearTimeout(startDelay);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [delayMs, letters.length]);

  return (
    <span className={`inline-block ${className}`}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className="inline-block transition-transform duration-500 ease-out"
          style={{
            transform: flippedIndices.has(index) ? 'rotateX(360deg)' : 'rotateX(0deg)',
            transformStyle: 'preserve-3d',
            display: 'inline-block',
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </span>
  );
}
