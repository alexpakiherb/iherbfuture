'use client';

// ScrollReveal — Apple/Patagonia signature on-scroll fade+translate.
// Wraps any block of content. When the wrapper enters the viewport, opacity
// animates from 0→1 and translateY(28px)→0 over ~700ms. Subtle, not bouncy.

import { useEffect, useRef, useState, ReactNode, CSSProperties } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  from?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  as?: 'div' | 'section' | 'article' | 'header' | 'span';
  className?: string;
}

const TRANSLATE = {
  up:    'translate3d(0, 28px, 0)',
  down:  'translate3d(0, -28px, 0)',
  left:  'translate3d(28px, 0, 0)',
  right: 'translate3d(-28px, 0, 0)',
};

export function ScrollReveal({
  children,
  delay = 0,
  from = 'up',
  distance,
  duration = 700,
  threshold = 0.12,
  once = true,
  as = 'div',
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) observer.unobserve(el);
          } else if (!once) {
            setRevealed(false);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const initialTransform = distance
    ? from === 'up'    ? `translate3d(0, ${distance}px, 0)`
    : from === 'down'  ? `translate3d(0, ${-distance}px, 0)`
    : from === 'left'  ? `translate3d(${distance}px, 0, 0)`
                       : `translate3d(${-distance}px, 0, 0)`
    : TRANSLATE[from];

  const style: CSSProperties = {
    opacity: revealed ? 1 : 0,
    transform: revealed ? 'translate3d(0, 0, 0)' : initialTransform,
    transition: `opacity ${duration}ms cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms`,
    willChange: revealed ? 'auto' : 'opacity, transform',
  };

  // Hardcode supported tags — generic JSX intrinsics caused TS to pick a
  // SVGSymbolElement-compatible type that broke the ref signature.
  const setDivRef = (node: HTMLDivElement | null) => { ref.current = node; };
  const setSectionRef = (node: HTMLElement | null) => { ref.current = node; };
  const setArticleRef = (node: HTMLElement | null) => { ref.current = node; };
  const setHeaderRef = (node: HTMLElement | null) => { ref.current = node; };
  const setSpanRef = (node: HTMLSpanElement | null) => { ref.current = node; };

  switch (as) {
    case 'section':
      return <section ref={setSectionRef} className={className} style={style}>{children}</section>;
    case 'article':
      return <article ref={setArticleRef} className={className} style={style}>{children}</article>;
    case 'header':
      return <header ref={setHeaderRef} className={className} style={style}>{children}</header>;
    case 'span':
      return <span ref={setSpanRef} className={className} style={style}>{children}</span>;
    case 'div':
    default:
      return <div ref={setDivRef} className={className} style={style}>{children}</div>;
  }
}
