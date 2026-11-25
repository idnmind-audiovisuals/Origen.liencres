"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";

type LoopingVideoProps = Pick<
  ComponentPropsWithoutRef<"video">,
  "aria-label" | "aria-labelledby" | "poster" | "width" | "height"
> & {
  src: string;
  children: ReactNode;
};

export function LoopingVideo({ src, children, ...props }: LoopingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    // Start on the first view only, so scrolling back never overrides a pause.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry || entry.intersectionRatio < 0.25) return;
      observer.disconnect();

      if (!reducedMotion.matches && video.paused && video.muted && video.currentTime === 0) {
        // If autoplay is blocked, the native Play control is still available.
        void video.play().catch(() => {});
      }
    }, { threshold: 0.25 });

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video {...props} ref={videoRef} controls loop muted playsInline preload="none">
      <source src={src} type="video/mp4" />
      {children}
    </video>
  );
}
