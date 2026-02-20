"use client";

import { type PointerEvent, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type CardData = {
  id: string;
  label: string;
};

type StackPosition = {
  baseY: number;
  hoverY: number;
  baseRotate: number;
  hoverRotate: number;
  baseScale: number;
  hoverScale: number;
  z: number;
};

const CARDS: CardData[] = [
  { id: "c1", label: "Card 1" },
  { id: "c2", label: "Card 2" },
  { id: "c3", label: "Card 3" },
];

const STACK_POSITIONS: StackPosition[] = [
  { baseY: 0, hoverY: 0, baseRotate: 0, hoverRotate: 0, baseScale: 1, hoverScale: 1, z: 30 },
  { baseY: 18, hoverY: 30, baseRotate: 4, hoverRotate: 7, baseScale: 0.975, hoverScale: 0.97, z: 20 },
  { baseY: 38, hoverY: 70, baseRotate: -7, hoverRotate: -11, baseScale: 0.94, hoverScale: 0.93, z: 10 },
];

export default function HeroCards() {
  const [isHover, setIsHover] = useState(false);
  const [order, setOrder] = useState<string[]>(() => ["c3", "c2", "c1"]);
  const [direction, setDirection] = useState<"down" | "up">("down");
  const [isAnimating, setIsAnimating] = useState(false);
  const [flyoutCardId, setFlyoutCardId] = useState<string | null>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, { stiffness: 140, damping: 22, mass: 0.55 });
  const smoothY = useSpring(pointerY, { stiffness: 140, damping: 22, mass: 0.55 });

  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);

  const shineX = useTransform(smoothX, [-0.5, 0.5], [20, 80]);
  const shineY = useTransform(smoothY, [-0.5, 0.5], [15, 85]);

  const shineBackground = useTransform([shineX, shineY], ([x, y]) => {
    return `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.07) 24%, rgba(255,255,255,0) 56%)`;
  });

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(Math.max(-0.5, Math.min(0.5, x)));
    pointerY.set(Math.max(-0.5, Math.min(0.5, y)));
  };

  const onPointerLeave = () => {
    setIsHover(false);
    pointerX.set(0);
    pointerY.set(0);
  };

  const noise = useMemo(
    () =>
      `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.85'/%3E%3C/svg%3E")`,
    []
  );

  const cardLookup = useMemo(() => {
    return new Map(CARDS.map((card) => [card.id, card]));
  }, []);

  const boxShadowFor = (hovered: boolean) =>
    hovered ? "0 34px 85px rgba(0,0,0,0.66), 0 0 46px rgba(122,132,255,0.24)" : "0 22px 60px rgba(0,0,0,0.5)";

  const rotateDown = (arr: string[]) => [...arr.slice(1), arr[0]];
  const rotateUp = (arr: string[]) => [arr[arr.length - 1], ...arr.slice(0, -1)];

  const handleDown = () => {
    if (isAnimating) return;
    const topId = order[0];
    if (!topId) return;
    setDirection("down");
    setIsAnimating(true);
    setFlyoutCardId(topId);
    setOrder((prev) => rotateDown(prev));
  };

  const handleUp = () => {
    if (isAnimating) return;
    const topId = order[0];
    if (!topId) return;
    setDirection("up");
    setIsAnimating(true);
    setFlyoutCardId(topId);
    setOrder((prev) => rotateUp(prev));
  };

  const handleFlyoutComplete = () => {
    setFlyoutCardId(null);
    setIsAnimating(false);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#050608] text-white antialiased [font-smoothing:antialiased] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_50%_12%,rgba(107,127,255,0.14),rgba(10,10,16,0)_45%),radial-gradient(75%_60%_at_84%_26%,rgba(140,108,232,0.11),rgba(9,9,14,0)_58%),radial-gradient(70%_65%_at_18%_78%,rgba(93,122,255,0.10),rgba(10,10,16,0)_63%),linear-gradient(180deg,#08090b_0%,#050608_58%,#040406_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.045),transparent_56%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: noise, opacity: 0.08, mixBlendMode: "soft-light" }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025)_0%,rgba(255,255,255,0.0)_20%,rgba(0,0,0,0.0)_65%,rgba(0,0,0,0.35)_100%)]" />
        <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.78)]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <motion.div
          className="group relative h-[360px] w-[min(86vw,540px)] sm:h-[420px] sm:w-[520px]"
          style={{ perspective: 1100 }}
          onPointerMove={onPointerMove}
          onPointerEnter={() => setIsHover(true)}
          onPointerLeave={onPointerLeave}
          animate={{ y: [0, -4, 0, 4, 0] }}
          transition={{ duration: 9.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <motion.div
            className="relative h-full w-full"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.8 }}
          >
            {order.map((id, index) => {
              const card = cardLookup.get(id);
              if (!card) return null;
              const position = STACK_POSITIONS[index];

              return (
                <motion.div
                  key={card.id}
                  className="absolute left-1/2 top-1/2 h-[250px] w-[min(82vw,470px)] -translate-x-1/2 -translate-y-1/2 rounded-[34px] border border-white/15 bg-[linear-gradient(155deg,rgba(255,255,255,0.17)_0%,rgba(255,255,255,0.045)_38%,rgba(255,255,255,0.02)_100%)] shadow-[0_22px_60px_rgba(0,0,0,0.5)] backdrop-blur-[9px] sm:h-[278px]"
                  style={{ zIndex: position.z }}
                  animate={{
                    y: isHover ? position.hoverY : position.baseY,
                    rotate: isHover ? position.hoverRotate : position.baseRotate,
                    scale: isHover ? position.hoverScale : position.baseScale,
                    boxShadow: boxShadowFor(isHover),
                  }}
                  transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.65 }}
                >
                  <div className="pointer-events-none absolute inset-[1px] rounded-[33px] border border-white/10" />
                  <div className="pointer-events-none absolute inset-0 rounded-[34px] bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.03)_28%,rgba(255,255,255,0)_58%)]" />
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-[34px]"
                    style={{ background: shineBackground, opacity: isHover ? 0.72 : 0.46 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                  <div className="relative h-full w-full rounded-[34px] p-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[26px] text-white tracking-[0.12em] [font-smoothing:antialiased] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale] sm:text-[32px] font-[ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace]">
                        {card.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {flyoutCardId ? (() => {
              const card = cardLookup.get(flyoutCardId);
              if (!card) return null;
              const position = STACK_POSITIONS[0];
              const flyout =
                direction === "down"
                  ? { x: 70, y: 160, rotate: 12, opacity: 0, filter: "blur(6px)" }
                  : { x: -70, y: -160, rotate: -12, opacity: 0, filter: "blur(6px)" };

              return (
                <motion.div
                  key={`flyout-${card.id}`}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[250px] w-[min(82vw,470px)] -translate-x-1/2 -translate-y-1/2 rounded-[34px] border border-white/15 bg-[linear-gradient(155deg,rgba(255,255,255,0.17)_0%,rgba(255,255,255,0.045)_38%,rgba(255,255,255,0.02)_100%)] shadow-[0_22px_60px_rgba(0,0,0,0.5)] backdrop-blur-[9px] sm:h-[278px]"
                  style={{ zIndex: 60 }}
                  initial={{
                    x: 0,
                    y: isHover ? position.hoverY : position.baseY,
                    rotate: isHover ? position.hoverRotate : position.baseRotate,
                    scale: isHover ? position.hoverScale : position.baseScale,
                    opacity: 1,
                    filter: "blur(0px)",
                    boxShadow: boxShadowFor(isHover),
                  }}
                  animate={{
                    ...flyout,
                    scale: isHover ? position.hoverScale : position.baseScale,
                    boxShadow: boxShadowFor(isHover),
                  }}
                  transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.65 }}
                  onAnimationComplete={handleFlyoutComplete}
                >
                  <div className="pointer-events-none absolute inset-[1px] rounded-[33px] border border-white/10" />
                  <div className="pointer-events-none absolute inset-0 rounded-[34px] bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.03)_28%,rgba(255,255,255,0)_58%)]" />
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-[34px]"
                    style={{ background: shineBackground, opacity: isHover ? 0.72 : 0.46 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                  <div className="relative h-full w-full rounded-[34px] p-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[26px] text-white tracking-[0.12em] [font-smoothing:antialiased] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale] sm:text-[32px] font-[ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace]">
                        {card.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })() : null}

            <div className="pointer-events-none absolute bottom-5 right-5 z-50 hidden flex-col gap-2 sm:flex">
              <button
                type="button"
                aria-label="Previous card"
                disabled={isAnimating}
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUp();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleUp();
                  }
                }}
                style={{ touchAction: "manipulation" }}
                className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/90 shadow-[0_10px_26px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:bg-white/20 hover:text-white disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 15 6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next card"
                disabled={isAnimating}
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDown();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleDown();
                  }
                }}
                style={{ touchAction: "manipulation" }}
                className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/90 shadow-[0_10px_26px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:bg-white/20 hover:text-white disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
