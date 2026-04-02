"use client";

import { useEffect, useRef, useState } from "react";
import { motionTokens } from "@/lib/motion";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  blur = 6,
  once = true
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
            return;
          }

          if (!once) setVisible(false);
        });
      },
      { threshold: 0.24, rootMargin: "0px 0px -12%" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "in" : ""}${className ? ` ${className}` : ""}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${motionTokens.duration.reveal}ms`,
        ["--reveal-y" as string]: `${y}px`,
        ["--reveal-blur" as string]: `${blur}px`
      }}
    >
      {children}
    </div>
  );
}
