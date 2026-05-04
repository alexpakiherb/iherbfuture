'use client';

// AnimatedCounter — counts up from 0 to the target value when scrolled into
// view. Apple-style number reveal. Pair with ScrollReveal or use standalone.

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  to: number;
  duration?: number;
  decimals?: number;
  format?: (n: number) => string;
  className?: string;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

export function AnimatedCounter({
  to,
  duration = 1400,
  decimals = 0,
  format,
  prefix = '',
  suffix = '',
  className = '',
  style,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setValue(to);
      return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            setAnimated(true);
            const startTime = performance.now();
            const tick = (now: number) => {
              const elapsed = now - startTime;
              const t = Math.min(elapsed / duration, 1);
              const eased = easeOutQuart(t);
              setValue(eased * to);
              if (t < 1) {
                requestAnimationFrame(tick);
              } else {
                setValue(to);
              }
            };
            requestAnimationFrame(tick);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration, animated]);

  const display = format
    ? format(value)
    : decimals === 0
      ? Math.round(value).toString()
      : value.toFixed(decimals);

  return (
    <span ref={ref} className={`tabular-nums ${className}`} style={style}>
      {prefix}{display}{suffix}
    </span>
  );
}
