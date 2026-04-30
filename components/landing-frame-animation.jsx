"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";

import { cn } from "@/lib/utils";

const FRAME_COUNT = 240;
const TARGET_FPS = 24;
const FIRST_FRAME_SRC = "/landing-animations/ezgif-frame-001.jpg";

function getFrameSrc(index) {
  return `/landing-animations/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;
}

function drawImageCover(context, image, width, height) {
  const imageRatio = image.naturalWidth / image.naturalHeight || 16 / 9;
  const canvasRatio = width / height;

  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (canvasRatio > imageRatio) {
    drawHeight = width / imageRatio;
    offsetY = (height - drawHeight) / 2;
  } else {
    drawWidth = height * imageRatio;
    offsetX = (width - drawWidth) / 2;
  }

  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

function getIdleScheduler() {
  if (typeof window === "undefined") {
    return {
      request: () => null,
      cancel: () => {},
    };
  }

  if ("requestIdleCallback" in window) {
    return {
      request: (callback) => window.requestIdleCallback(callback, { timeout: 800 }),
      cancel: (id) => window.cancelIdleCallback(id),
    };
  }

  return {
    request: (callback) => window.setTimeout(callback, 24),
    cancel: (id) => window.clearTimeout(id),
  };
}

export default function LandingFrameAnimation({ className }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const loadedFramesRef = useRef(new Set());
  const loadedTotalRef = useRef(0);
  const frameIndexRef = useRef(0);
  const rafRef = useRef(null);
  const idleRef = useRef(null);
  const isRunningRef = useRef(false);
  const isInViewRef = useRef(true);
  const isHiddenRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const lastFrameTimeRef = useRef(0);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const frameSources = useMemo(
    () => Array.from({ length: FRAME_COUNT }, (_, index) => getFrameSrc(index)),
    []
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncMotionPreference = () => {
      reducedMotionRef.current = mediaQuery.matches;
      setPrefersReducedMotion(mediaQuery.matches);
    };

    syncMotionPreference();
    mediaQuery.addEventListener("change", syncMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    if (!container || !canvas || !context) {
      return undefined;
    }

    const idleScheduler = getIdleScheduler();
    let isMounted = true;
    let nextFrameToLoad = 0;

    const sizeCanvas = () => {
      const rect = container.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const nextWidth = Math.round(rect.width * pixelRatio);
      const nextHeight = Math.round(rect.height * pixelRatio);

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      const currentImage =
        framesRef.current[frameIndexRef.current] || framesRef.current[0];

      if (currentImage?.complete && currentImage.naturalWidth > 0) {
        drawImageCover(context, currentImage, rect.width, rect.height);
      }
    };

    const drawFrame = (frameIndex) => {
      const image = framesRef.current[frameIndex];

      if (!image?.complete || image.naturalWidth === 0) {
        return false;
      }

      const rect = container.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return false;
      }

      sizeCanvas();
      context.clearRect(0, 0, rect.width, rect.height);
      drawImageCover(context, image, rect.width, rect.height);
      return true;
    };

    const findLoadedFrame = (targetIndex) => {
      if (loadedFramesRef.current.has(targetIndex)) {
        return targetIndex;
      }

      for (let distance = 1; distance < FRAME_COUNT; distance += 1) {
        const previousIndex = (targetIndex - distance + FRAME_COUNT) % FRAME_COUNT;

        if (loadedFramesRef.current.has(previousIndex)) {
          return previousIndex;
        }
      }

      return 0;
    };

    const shouldAnimate = () =>
      !reducedMotionRef.current && isInViewRef.current && !isHiddenRef.current;

    const stopAnimation = () => {
      isRunningRef.current = false;

      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const tick = (timestamp) => {
      if (!isMounted || !shouldAnimate()) {
        stopAnimation();
        return;
      }

      const frameInterval = 1000 / TARGET_FPS;

      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastFrameTimeRef.current;

      if (elapsed >= frameInterval) {
        const frameStep = Math.max(1, Math.floor(elapsed / frameInterval));
        const nextFrame = (frameIndexRef.current + frameStep) % FRAME_COUNT;
        const drawableFrame = findLoadedFrame(nextFrame);

        frameIndexRef.current = drawableFrame;
        drawFrame(drawableFrame);
        lastFrameTimeRef.current = timestamp - (elapsed % frameInterval);
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    const startAnimation = () => {
      if (isRunningRef.current || !shouldAnimate()) {
        return;
      }

      isRunningRef.current = true;
      lastFrameTimeRef.current = 0;
      rafRef.current = window.requestAnimationFrame(tick);
    };

    const loadFrame = (frameIndex) =>
      new Promise((resolve) => {
        if (
          framesRef.current[frameIndex]?.complete &&
          framesRef.current[frameIndex]?.naturalWidth > 0
        ) {
          resolve(true);
          return;
        }

        const image = new window.Image();
        image.decoding = "async";
        image.onload = () => {
          if (!isMounted) {
            resolve(false);
            return;
          }

          loadedFramesRef.current.add(frameIndex);
          loadedTotalRef.current += 1;

          if (
            frameIndex === 0 ||
            loadedTotalRef.current % 12 === 0 ||
            loadedTotalRef.current === FRAME_COUNT
          ) {
            setLoadedCount(loadedTotalRef.current);
          }

          if (frameIndex === 0) {
            frameIndexRef.current = 0;
            sizeCanvas();
            drawFrame(0);
            setIsCanvasReady(true);
            startAnimation();
          }

          resolve(true);
        };
        image.onerror = () => resolve(false);
        image.src = frameSources[frameIndex];
        framesRef.current[frameIndex] = image;
      });

    const preloadNextBatch = () => {
      if (!isMounted || nextFrameToLoad >= FRAME_COUNT) {
        return;
      }

      const batchSize = nextFrameToLoad < 36 ? 4 : 2;
      const batch = [];

      while (nextFrameToLoad < FRAME_COUNT && batch.length < batchSize) {
        batch.push(loadFrame(nextFrameToLoad));
        nextFrameToLoad += 1;
      }

      Promise.allSettled(batch).then(() => {
        if (!isMounted || nextFrameToLoad >= FRAME_COUNT) {
          return;
        }

        idleRef.current = idleScheduler.request(preloadNextBatch);
      });
    };

    const handleVisibilityChange = () => {
      isHiddenRef.current = document.hidden;

      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;

        if (entry.isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.12 }
    );

    const resizeObserver = new ResizeObserver(sizeCanvas);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    intersectionObserver.observe(container);
    resizeObserver.observe(container);
    preloadNextBatch();
    sizeCanvas();

    return () => {
      isMounted = false;
      stopAnimation();

      if (idleRef.current) {
        idleScheduler.cancel(idleRef.current);
      }

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();

      framesRef.current.forEach((image) => {
        if (image) {
          image.onload = null;
          image.onerror = null;
          image.src = "";
        }
      });

      framesRef.current = [];
      loadedFramesRef.current.clear();
    };
  }, [frameSources]);

  const progress = Math.min(100, Math.round((loadedCount / FRAME_COUNT) * 100));

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden bg-background", className)}
    >
      <NextImage
        src={FIRST_FRAME_SRC}
        alt="SensAI AI career command center preview with analytics and planning panels"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn(
          "absolute inset-0 h-full w-full transition-opacity duration-700 motion-reduce:opacity-0",
          isCanvasReady && !prefersReducedMotion ? "opacity-100" : "opacity-0"
        )}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0,hsl(var(--background)/0.18)_35%,hsl(var(--background)/0.74)_100%)] sm:bg-[radial-gradient(circle_at_50%_30%,transparent_0,hsl(var(--background)/0.04)_35%,hsl(var(--background)/0.50)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/95 via-background/66 to-background sm:from-background/76 sm:via-background/22 sm:to-background/96" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/90 to-transparent" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay [background-image:linear-gradient(hsl(var(--foreground)/0.18)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.18)_1px,transparent_1px)] [background-size:48px_48px]" />
      {!isCanvasReady && !prefersReducedMotion ? (
        <div
          className="pointer-events-none absolute bottom-6 left-1/2 h-1 w-40 -translate-x-1/2 overflow-hidden rounded-full bg-card/40 backdrop-blur-xl"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500"
            style={{ width: `${Math.max(progress, 8)}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
