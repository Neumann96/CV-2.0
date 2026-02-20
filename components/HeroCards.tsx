"use client";

import { type PointerEvent, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type CardConfig = {
  id: number;
  baseY: number;
  hoverY: number;
  baseRotate: number;
  hoverRotate: number;
  baseScale: number;
  hoverScale: number;
  z: number;
};

const CARDS: CardConfig[] = [
  { id: 1, baseY: 38, hoverY: 70, baseRotate: -7, hoverRotate: -11, baseScale: 0.94, hoverScale: 0.93, z: 10 },
  { id: 2, baseY: 18, hoverY: 30, baseRotate: 4, hoverRotate: 7, baseScale: 0.975, hoverScale: 0.97, z: 20 },
  { id: 3, baseY: 0, hoverY: 0, baseRotate: 0, hoverRotate: 0, baseScale: 1, hoverScale: 1, z: 30 },
];

export default function HeroCards() {
  const [isHover, setIsHover] = useState(false);

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
            {CARDS.map((card) => (
              <motion.div
                key={card.id}
                className="absolute left-1/2 top-1/2 h-[250px] w-[min(82vw,470px)] -translate-x-1/2 -translate-y-1/2 rounded-[34px] border border-white/15 bg-[linear-gradient(155deg,rgba(255,255,255,0.17)_0%,rgba(255,255,255,0.045)_38%,rgba(255,255,255,0.02)_100%)] shadow-[0_22px_60px_rgba(0,0,0,0.5)] backdrop-blur-[9px] sm:h-[278px]"
                style={{ zIndex: card.z }}
                animate={{
                  y: isHover ? card.hoverY : card.baseY,
                  rotate: isHover ? card.hoverRotate : card.baseRotate,
                  scale: isHover ? card.hoverScale : card.baseScale,
                  boxShadow: isHover
                    ? "0 34px 85px rgba(0,0,0,0.66), 0 0 46px rgba(122,132,255,0.24)"
                    : "0 22px 60px rgba(0,0,0,0.5)",
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
                <div className="relative h-full w-full rounded-[34px] p-6" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
