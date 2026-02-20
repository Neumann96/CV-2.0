"use client";

import { type PointerEvent, useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type CardType = "text" | "youtube" | "telegram";

type CardData = {
  id: string;
  type: CardType;
  text: string;
  button?: {
    label: string;
    href: string;
  };
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
  {
    id: "c1",
    type: "text",
    text: "Привет! Меня зовут Кирилл и всю свою жизнь я что-то создаю, листни, чтобы узнать больше обо мне ))",
  },
  {
    id: "c2",
    type: "text",
    text:
      "Я уже более 2 лет пишу на Python, а сейчас активно пользуюсь AI для создания MVP продуктов. У меня есть понимание продукта как единого целого, потому что почти всегда создавал всё своими руками с нуля и до первых пользователей.",
  },
  {
    id: "c3",
    type: "text",
    text:
      "Опыт работы автоматизатором в маркетинге (собирал маркетинговые воронки в Telegram, интегрировал сервисы, работал с API и базами данных). Шарю не только в коде, но и в продукте.",
  },
  {
    id: "c4",
    type: "youtube",
    text:
      "Ещё я люблю создавать контент, веду личный ютуб канал и помогаю монетизировать и автоматизировать контент пока маленькому блогеру и пока только одному, но результаты уже есть!",
    button: {
      label: "Мой канал",
      href: "https://www.youtube.com/@KirKarachev",
    },
  },
  {
    id: "c5",
    type: "telegram",
    text: "Можете написать мне в Telegram, я всегда открыт к общению и предложениям ;)",
    button: {
      label: "Написать мне в Telegram",
      href: "https://t.me/nmnn96",
    },
  },
];

const STACK_POSITIONS: StackPosition[] = [
  { baseY: 0, hoverY: 0, baseRotate: 0, hoverRotate: 0, baseScale: 1, hoverScale: 1, z: 30 },
  { baseY: 18, hoverY: 30, baseRotate: 4, hoverRotate: 7, baseScale: 0.975, hoverScale: 0.97, z: 20 },
  { baseY: 38, hoverY: 70, baseRotate: -7, hoverRotate: -11, baseScale: 0.94, hoverScale: 0.93, z: 10 },
];

export default function HeroCards() {
  const [isHover, setIsHover] = useState(false);
  const [order, setOrder] = useState<string[]>(() => CARDS.map((card) => card.id));
  const [direction, setDirection] = useState<"down" | "up">("down");
  const [isAnimating, setIsAnimating] = useState(false);
  const [flyoutCardId, setFlyoutCardId] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [hasSwiped, setHasSwiped] = useState(false);

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

  const resetHover = () => {
    setIsHover(false);
    pointerX.set(0);
    pointerY.set(0);
  };

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouch(media.matches);
    update();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target && target.closest('[data-interactive="true"]')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(Math.max(-0.5, Math.min(0.5, x)));
    pointerY.set(Math.max(-0.5, Math.min(0.5, y)));
  };

  const onPointerLeave = () => {
    resetHover();
  };

  useEffect(() => {
    const handleWindowLeave = () => resetHover();
    window.addEventListener("mouseleave", handleWindowLeave);
    window.addEventListener("blur", handleWindowLeave);
    return () => {
      window.removeEventListener("mouseleave", handleWindowLeave);
      window.removeEventListener("blur", handleWindowLeave);
    };
  }, []);

  useEffect(() => {
    console.log("ORDER", order.join(" -> "));
  }, [order]);

  const noise = useMemo(
    () =>
      `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.85'/%3E%3C/svg%3E")`,
    []
  );

  const cardLookup = useMemo(() => {
    return new Map(CARDS.map((card) => [card.id, card]));
  }, []);

  const hoverActive = !isTouch && isHover;
  const boxShadowFor = (hovered: boolean) =>
    hovered ? "0 34px 85px rgba(0,0,0,0.66), 0 0 46px rgba(122,132,255,0.24)" : "0 22px 60px rgba(0,0,0,0.5)";

  const rotateForward = (arr: string[]) => [...arr.slice(1), arr[0]];
  const rotateBackward = (arr: string[]) => [arr[arr.length - 1], ...arr.slice(0, -1)];

  const handleUp = () => {
    if (isAnimating) return;
    const topId = order[0];
    if (!topId) return;
    resetHover();
    setDirection("down");
    setIsAnimating(true);
    setFlyoutCardId(topId);
    setOrder((prev) => rotateForward(prev));
  };

  const handleDown = () => {
    if (isAnimating) return;
    const topId = order[0];
    if (!topId) return;
    if (topId === "c1") return;
    resetHover();
    setDirection("up");
    setIsAnimating(true);
    setFlyoutCardId(topId);
    setOrder((prev) => rotateBackward(prev));
  };

  const handleFlyoutComplete = () => {
    setFlyoutCardId(null);
    setIsAnimating(false);
  };

  const openExternal = (url: string, e: PointerEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const isBackDisabled = order[0] === "c1";

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] text-white antialiased [font-smoothing:antialiased] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 opacity-70 [background-image:repeating-linear-gradient(to_right,rgba(255,255,255,0.07)_0_1px,transparent_1px_32px),repeating-linear-gradient(to_bottom,rgba(255,255,255,0.07)_0_1px,transparent_1px_32px)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.04),transparent_60%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: noise, opacity: 0.08, mixBlendMode: "soft-light" }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.0)_22%,rgba(0,0,0,0.0)_65%,rgba(0,0,0,0.45)_100%)]" />
        <div className="absolute inset-0 shadow-[inset_0_0_220px_rgba(0,0,0,0.85)]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <motion.div
          className="group relative h-[360px] w-[min(86vw,540px)] sm:h-[420px] sm:w-[520px]"
          style={{ perspective: 1100 }}
          onPointerMove={isTouch ? undefined : onPointerMove}
          onPointerEnter={isTouch ? undefined : () => setIsHover(true)}
          onPointerLeave={onPointerLeave}
          animate={{ y: [0, -4, 0, 4, 0] }}
          transition={{ duration: 9.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <motion.div
            className="relative h-full w-full"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.8 }}
          >
            {order.slice(0, 3).map((id, index) => {
              const card = cardLookup.get(id);
              if (!card) return null;
              const position = STACK_POSITIONS[index];
              const isTop = index === 0;

              return (
                <motion.div
                  key={card.id}
                  className="absolute left-1/2 top-1/2 h-[clamp(340px,75vh,520px)] w-[min(82vw,470px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[34px] border border-white/15 bg-[linear-gradient(155deg,rgba(255,255,255,0.17)_0%,rgba(255,255,255,0.045)_38%,rgba(255,255,255,0.02)_100%)] shadow-[0_22px_60px_rgba(0,0,0,0.5)] backdrop-blur-[9px] sm:h-[clamp(460px,55vh,620px)]"
                  style={{ zIndex: position.z }}
                  animate={{
                    y: hoverActive ? position.hoverY : position.baseY,
                    rotate: hoverActive ? position.hoverRotate : position.baseRotate,
                    scale: hoverActive ? position.hoverScale : position.baseScale,
                    boxShadow: boxShadowFor(hoverActive),
                  }}
                  transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.65 }}
                  drag={isTouch && isTop && !isAnimating ? "y" : false}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.3}
                  onDragEnd={(_, info) => {
                    if (!isTouch || !isTop || isAnimating) return;
                    const offset = info.offset.y;
                    const velocity = info.velocity.y;
                    const threshold = 100;
                    const velocityThreshold = 900;
                    if (offset < -threshold || velocity < -velocityThreshold) {
                      setHasSwiped(true);
                      handleUp();
                    } else if (offset > threshold || velocity > velocityThreshold) {
                      if (!isBackDisabled) {
                        setHasSwiped(true);
                        handleDown();
                      }
                    }
                  }}
                >
                  <div className="pointer-events-none absolute inset-[1px] rounded-[33px] border border-white/10" />
                  <div className="pointer-events-none absolute inset-0 rounded-[34px] bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.03)_28%,rgba(255,255,255,0)_58%)]" />
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-[34px]"
                    style={{ background: shineBackground, opacity: hoverActive ? 0.72 : 0.46 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                  <div className="relative h-full w-full rounded-[34px] overflow-hidden">
                    <div className="card-content absolute inset-0 px-8 py-8 pb-24 sm:px-10 sm:py-10 sm:pb-28">
                      <div className="flex h-full w-full min-w-0 max-w-full flex-col justify-center overflow-hidden text-left text-[14px] text-white leading-[1.6] tracking-[0.03em] [font-smoothing:antialiased] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale] sm:text-[15px] font-[ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace]">
                        <div className="max-h-[calc(100%-88px)] w-full overflow-auto whitespace-normal [overflow-wrap:anywhere] [word-break:break-word] [text-wrap:pretty] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/25 [&::-webkit-scrollbar-track]:bg-transparent">
                          <p className={card.type === "text" ? "font-[500]" : ""}>{card.text}</p>
                        </div>
                      </div>
                    </div>
                    {card.button ? (
                      <div className="absolute left-8 bottom-8 z-[999] pointer-events-auto" data-interactive="true">
                        <a
                          href={card.button.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-interactive="true"
                          className="inline-flex min-h-[42px] min-w-[200px] items-center justify-center rounded-full bg-white px-6 py-2 text-[13px] font-[500] leading-none text-black transition hover:opacity-90 hover:shadow-[0_8px_18px_rgba(0,0,0,0.2)]"
                          style={{ touchAction: "manipulation" }}
                          onPointerDown={(e) => openExternal(card.button?.href ?? "", e)}
                          onPointerMove={(e) => e.stopPropagation()}
                        >
                          {card.button.label}
                        </a>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}

            {flyoutCardId ? (() => {
              const card = cardLookup.get(flyoutCardId);
              if (!card) return null;
              const position = STACK_POSITIONS[0];
              const flyout = isTouch
                ? direction === "down"
                  ? { x: 0, y: -360, rotate: -6, opacity: 0, filter: "blur(2px)" }
                  : { x: 0, y: 360, rotate: 6, opacity: 0, filter: "blur(2px)" }
                : direction === "down"
                  ? { x: 70, y: 160, rotate: 12, opacity: 0, filter: "blur(6px)" }
                  : { x: -70, y: -160, rotate: -12, opacity: 0, filter: "blur(6px)" };

              return (
                <motion.div
                  key={`flyout-${card.id}`}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[clamp(340px,75vh,520px)] w-[min(82vw,470px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[34px] border border-white/15 bg-[linear-gradient(155deg,rgba(255,255,255,0.17)_0%,rgba(255,255,255,0.045)_38%,rgba(255,255,255,0.02)_100%)] shadow-[0_22px_60px_rgba(0,0,0,0.5)] backdrop-blur-[9px] sm:h-[clamp(460px,55vh,620px)]"
                  style={{ zIndex: 60 }}
                  initial={{
                    x: 0,
                    y: hoverActive ? position.hoverY : position.baseY,
                    rotate: hoverActive ? position.hoverRotate : position.baseRotate,
                    scale: hoverActive ? position.hoverScale : position.baseScale,
                    opacity: 1,
                    filter: "blur(0px)",
                    boxShadow: boxShadowFor(hoverActive),
                  }}
                  animate={{
                    ...flyout,
                    scale: hoverActive ? position.hoverScale : position.baseScale,
                    boxShadow: boxShadowFor(hoverActive),
                  }}
                  transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.65 }}
                  onAnimationComplete={handleFlyoutComplete}
                >
                  <div className="pointer-events-none absolute inset-[1px] rounded-[33px] border border-white/10" />
                  <div className="pointer-events-none absolute inset-0 rounded-[34px] bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.03)_28%,rgba(255,255,255,0)_58%)]" />
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-[34px]"
                    style={{ background: shineBackground, opacity: hoverActive ? 0.72 : 0.46 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                  <div className="relative h-full w-full rounded-[34px] overflow-hidden">
                    <div className="card-content absolute inset-0 px-8 py-8 pb-24 sm:px-10 sm:py-10 sm:pb-28">
                      <div className="flex h-full w-full min-w-0 max-w-full flex-col justify-center overflow-hidden text-left text-[14px] text-white leading-[1.6] tracking-[0.03em] [font-smoothing:antialiased] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale] sm:text-[15px] font-[ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace]">
                        <div className="max-h-[calc(100%-88px)] w-full overflow-auto whitespace-normal [overflow-wrap:anywhere] [word-break:break-word] [text-wrap:pretty] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/25 [&::-webkit-scrollbar-track]:bg-transparent">
                          <p className={card.type === "text" ? "font-[500]" : ""}>{card.text}</p>
                        </div>
                      </div>
                    </div>
                    {card.button ? (
                      <div className="absolute left-8 bottom-8 z-[999] pointer-events-auto" data-interactive="true">
                        <a
                          href={card.button.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-interactive="true"
                          className="inline-flex min-h-[42px] min-w-[200px] items-center justify-center rounded-full bg-white px-6 py-2 text-[13px] font-[500] leading-none text-black transition hover:opacity-90 hover:shadow-[0_8px_18px_rgba(0,0,0,0.2)]"
                          style={{ touchAction: "manipulation" }}
                          onPointerDown={(e) => openExternal(card.button?.href ?? "", e)}
                          onPointerMove={(e) => e.stopPropagation()}
                        >
                          {card.button.label}
                        </a>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              );
            })() : null}

            {isTouch && !hasSwiped ? (
              <div className="pointer-events-none absolute bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[11px] uppercase tracking-[0.2em] text-white/70">
                Свайп вверх / вниз
              </div>
            ) : null}

            {isTouch ? null : (
              <div className="pointer-events-none absolute bottom-5 right-5 z-50 hidden flex-col gap-2 sm:flex" data-interactive="true">
                <button
                  type="button"
                  aria-label="Next card"
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
                  data-interactive="true"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 15 6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Previous card"
                  disabled={isAnimating || isBackDisabled}
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
                  className={`pointer-events-auto flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/90 shadow-[0_10px_26px_rgba(0,0,0,0.35)] backdrop-blur-md transition disabled:opacity-40 ${isBackDisabled ? "cursor-not-allowed hover:bg-white/10 hover:text-white/60" : "hover:bg-white/20 hover:text-white"}`}
                  data-interactive="true"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
