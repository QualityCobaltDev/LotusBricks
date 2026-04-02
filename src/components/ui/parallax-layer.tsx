"use client";

import { useEffect, useState } from "react";

export function ParallaxLayer({
  children,
  className,
  speed = 0.08
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setOffset(0);
      return;
    }

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        setOffset(window.scrollY * speed);
        raf = 0;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div
      className={className}
      style={{
        transform: `translate3d(0, ${offset.toFixed(2)}px, 0)`
      }}
    >
      {children}
    </div>
  );
}
