"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Neumann96" },
  { label: "Telegram", href: "https://t.me/nmnn96" },
  { label: "Instagram", href: "https://www.instagram.com/neumnn96/" },
] as const;

type TiltCardProps = {
  children: ReactNode;
  className?: string;
};

function TiltCard({ children, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card || event.pointerType === "touch") return;

    const bounds = card.getBoundingClientRect();
    const x = clamp((event.clientX - bounds.left) / bounds.width);
    const y = clamp((event.clientY - bounds.top) / bounds.height);

    card.style.setProperty("--tilt-x", `${((0.5 - y) * 5).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${((x - 0.5) * 6).toFixed(2)}deg`);
    card.style.setProperty("--pointer-x", `${(x * 100).toFixed(1)}%`);
    card.style.setProperty("--pointer-y", `${(y * 100).toFixed(1)}%`);
    card.style.setProperty("--media-x", `${((0.5 - x) * 2.8).toFixed(2)}%`);
    card.style.setProperty("--media-hover-y", `${((0.5 - y) * 2.8).toFixed(2)}%`);
  };

  const resetTilt = () => {
    const card = ref.current;
    if (!card) return;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--media-x", "0%");
    card.style.setProperty("--media-hover-y", "0%");
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
    >
      {children}
    </div>
  );
}

type MediaPlaceholderProps = {
  eyebrow: string;
  title: string;
  note: string;
  index: string;
  compact?: boolean;
};

function MediaPlaceholder({
  eyebrow,
  title,
  note,
  index,
  compact = false,
}: MediaPlaceholderProps) {
  return (
    <div className={`media-placeholder${compact ? " is-compact" : ""}`}>
      <div className="placeholder-scan" aria-hidden="true" />
      <div className="placeholder-corners" aria-hidden="true" />
      <div className="placeholder-label">
        <span>{index}</span>
        <span>{eyebrow}</span>
      </div>
      <div className="placeholder-message">
        <strong>{title}</strong>
        <span>{note}</span>
      </div>
    </div>
  );
}

const campScreens = [
  {
    src: "/images/umschool-camp/tasks-clean.png",
    alt: "Экран заданий Умскул Кэмп",
    className: "camp-screen-tasks",
  },
  {
    src: "/images/umschool-camp/home-clean.png",
    alt: "Главный экран Умскул Кэмп",
    className: "camp-screen-home",
  },
  {
    src: "/images/umschool-camp/raffles-clean.png",
    alt: "Экран розыгрышей Умскул Кэмп",
    className: "camp-screen-raffles",
  },
  {
    src: "/images/umschool-camp/buddy-clean.png",
    alt: "Экран поиска бадди Умскул Кэмп",
    className: "camp-screen-buddy",
  },
] as const;

function CampShowcase() {
  return (
    <div className="camp-showcase">
      <div className="camp-showcase-label" aria-hidden="true">
        <span>UMSCHOOL CAMP</span>
        <span>TELEGRAM MINI APP · 2025</span>
      </div>
      <div className="camp-screen-row">
        {campScreens.map((screen) => (
          <figure className={`camp-screen ${screen.className}`} key={screen.src}>
            <Image
              src={screen.src}
              alt={screen.alt}
              width={332}
              height={534}
              sizes="(max-width: 720px) 42vw, 22vw"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

const projectData = [
  {
    date: "JULY 2025",
    type: "EDTECH MINI APP",
    title: "Umschool Camp",
    className: "project-camp",
    instruction:
      "Replace with a clean 6–10 sec product capture: profile → tasks → progress → rewards. No device frame.",
    caseLabel: "PRODUCT SCREENS · MINI APP",
    stats: ["10K+ USERS", "15 CHANNELS", "NEXT.JS", "BASEROW", "2025"],
  },
  {
    date: "2025 — NOW",
    type: "PRODUCT ANALYTICS",
    title: "Growth System",
    className: "project-growth",
    instruction:
      "Replace with a dark dashboard or data-story loop showing attribution, funnels, retention and purchase signals.",
    caseLabel: "CASE MATERIALS NEEDED",
    stats: ["206 TASKS", "6 MONTHS", "SQL", "POWER BI", "A/B TESTS"],
  },
];

const heroLines = [
  [
    { label: "Kirill", delay: "800ms" },
    { label: "Karachev", delay: "960ms" },
  ],
  [
    { label: "Product", delay: "1120ms" },
    { label: "Analyst", delay: "1280ms" },
    { label: "&", delay: "1440ms" },
  ],
  [{ label: "Builder", delay: "1600ms" }],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let scrollFrame = 0;
    let loadTimer = 0;
    let introTimer = 0;

    const storedTheme = window.localStorage.getItem("kk-theme");
    const initialTheme = storedTheme === "light" ? "light" : "dark";
    root.dataset.theme = initialTheme;

    const updateScenes = () => {
      scrollFrame = 0;
      const viewport = Math.max(window.innerHeight, 1);
      const hero = document.querySelector<HTMLElement>(".hero");

      if (hero) {
        const distance = Math.max(hero.offsetHeight - viewport, viewport * 0.35);
        const progress = clamp(window.scrollY / distance);
        hero.style.setProperty("--hero-scale", (1 - progress * 0.075).toFixed(4));
        hero.style.setProperty("--hero-y", `${(-progress * 7).toFixed(2)}vh`);
        hero.style.setProperty("--hero-radius", `${32 + progress * 28}px`);
        hero.style.setProperty("--hero-title-y", `${(-progress * 8).toFixed(2)}vh`);
        hero.style.setProperty("--hero-dim", (0.08 + progress * 0.38).toFixed(3));
      }

      document.querySelectorAll<HTMLElement>(".project-track").forEach((track) => {
        const rect = track.getBoundingClientRect();
        const entry = clamp((viewport - rect.top) / (viewport * 0.92));
        const exit = clamp(-rect.bottom / (viewport * 0.72));
        const local = clamp(-rect.top / Math.max(rect.height - viewport, 1));

        track.style.setProperty(
          "--card-y",
          `${((1 - entry) * 24 - exit * 9).toFixed(2)}vh`,
        );
        track.style.setProperty(
          "--card-scale",
          (0.83 + entry * 0.17 - exit * 0.075).toFixed(4),
        );
        track.style.setProperty(
          "--card-rotate",
          `${((1 - entry) * 7 - exit * 2.5).toFixed(2)}deg`,
        );
        track.style.setProperty(
          "--project-media-y",
          `${((local - 0.5) * -9).toFixed(2)}%`,
        );
        track.style.setProperty("--project-progress", local.toFixed(3));
      });

      const motion = document.querySelector<HTMLElement>(".motion-project");
      if (motion) {
        const rect = motion.getBoundingClientRect();
        const progress = clamp((viewport - rect.top) / (viewport + rect.height));
        motion.style.setProperty(
          "--motion-main-y",
          `${((0.5 - progress) * 14).toFixed(2)}vh`,
        );
        motion.style.setProperty(
          "--motion-far-y",
          `${((0.5 - progress) * 31).toFixed(2)}vh`,
        );
        motion.style.setProperty(
          "--motion-near-y",
          `${((0.5 - progress) * -19).toFixed(2)}vh`,
        );
      }
    };

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScenes);
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 },
    );

    document
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((node) => revealObserver.observe(node));

    root.classList.remove("page-loaded", "page-intro-complete");
    loadTimer = window.setTimeout(
      () => root.classList.add("page-loaded"),
      reducedMotion ? 20 : 60,
    );
    introTimer = window.setTimeout(
      () => root.classList.add("page-intro-complete"),
      reducedMotion ? 30 : 2500,
    );

    updateScenes();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.clearTimeout(loadTimer);
      window.clearTimeout(introTimer);
      revealObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);
    return () => document.body.classList.remove("menu-is-open");
  }, [menuOpen]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme = root.dataset.theme === "light" ? "dark" : "light";

    root.classList.add("theme-transitioning");
    root.dataset.theme = nextTheme;
    window.localStorage.setItem("kk-theme", nextTheme);
    window.setTimeout(() => root.classList.remove("theme-transitioning"), 750);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("karachevki@gmail.com");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = "mailto:karachevki@gmail.com";
    }
  };

  return (
    <div className="site-shell">
      <div className="grain" aria-hidden="true" />

      <header className="site-header">
        <nav className="nav-side nav-left" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#story">Story</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="wordmark" href="#top" aria-label="Back to top">
          Kirill
        </a>

        <nav className="nav-side nav-right" aria-label="Social navigation">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
          <button
            className="theme-toggle"
            type="button"
            aria-label="Toggle black and white theme"
            onClick={toggleTheme}
          >
            <span className="theme-code-window" aria-hidden="true">
              <span className="theme-code-reel">
                <span>0x00</span>
                <span>0xFF</span>
              </span>
            </span>
            <i className="theme-pixel" aria-hidden="true" />
          </button>
          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span>{menuOpen ? "Close" : "Menu"}</span>
            <i aria-hidden="true" />
          </button>
        </nav>
      </header>

      <div id="site-menu" className={`menu-overlay${menuOpen ? " is-open" : ""}`}>
        <div className="menu-meta">
          <span>PRODUCT · DATA · CODE</span>
          <span>VIENNA, AUSTRIA</span>
        </div>
        <nav aria-label="Expanded navigation">
          <a href="#top" onClick={() => setMenuOpen(false)}>
            <span>01</span>Index
          </a>
          <a href="#story" onClick={() => setMenuOpen(false)}>
            <span>02</span>Story
          </a>
          <a href="#work" onClick={() => setMenuOpen(false)}>
            <span>03</span>Selected work
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            <span>04</span>Contact
          </a>
        </nav>
        <div className="menu-footer">
          <div className="menu-socials">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
            <a href="mailto:karachevki@gmail.com">Email</a>
          </div>
          <span>CV PDF · ADD FINAL FILE</span>
        </div>
      </div>

      <main>
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="hero-intro-frame">
            <div className="hero-card">
              <div className="hero-media" aria-hidden="true">
                <div className="hero-media-grid" />
                <div className="hero-media-glow" />
              </div>

              <h1 id="hero-title" className="hero-title">
                {heroLines.map((line, lineIndex) => (
                  <span className="hero-title-line" key={lineIndex}>
                    {line.map((word) => (
                      <span
                        key={word.label}
                        style={{ "--intro-delay": word.delay } as CSSProperties}
                      >
                        <i>{word.label}</i>
                      </span>
                    ))}
                  </span>
                ))}
              </h1>

              <div className="hero-foot">
                <span>VIENNA · AUSTRIA</span>
                <span>SCROLL TO EXPLORE ↓</span>
              </div>
            </div>
          </div>
        </section>

        <section id="story" className="story-section">
          <div className="story-line" data-reveal>
            <span>A</span>
            <span className="inline-frame frame-one" aria-hidden="true">10K</span>
            <span>product</span>
            <span>analyst</span>
            <span className="inline-frame frame-two" aria-hidden="true">SQL</span>
            <span>turning</span>
            <span>complex</span>
            <span className="inline-frame frame-three" aria-hidden="true">BUILD</span>
            <span>systems</span>
            <span>into clear</span>
            <span>products</span>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>

          <div className="story-bio" data-reveal>
            <p>
              Kirill Karachev is a product analyst and technical product
              specialist working across product, data and code. At Umschool he
              built the Camp Mini App for more than 10,000 users, connected 15
              acquisition channels to measurable product actions and completed
              206 technical and analytical deliveries in six months.
            </p>
            <a href="#work">See selected work <span>↘</span></a>
          </div>
        </section>

        <section id="work" className="work-section" aria-label="Selected work">
          <div className="work-intro">
            <span>SELECTED WORK</span>
            <span>01 — 02</span>
          </div>

          <div className="project-stack">
            {projectData.map((project, projectIndex) => (
              <article
                className={`project-track ${project.className}`}
                key={project.title}
                style={{ "--project-z": projectIndex + 2 } as CSSProperties}
              >
                <TiltCard className="project-card">
                  <div className="project-media">
                    {project.className === "project-camp" ? (
                      <CampShowcase />
                    ) : (
                      <MediaPlaceholder
                        index={`0${projectIndex + 1}`}
                        eyebrow="PRIMARY PROJECT MEDIA · 16:10"
                        title="Case study visual goes here"
                        note={project.instruction}
                      />
                    )}
                  </div>

                  <div className="project-meta">
                    <span>{project.date}</span>
                    <i aria-hidden="true" />
                    <span>{project.type}</span>
                  </div>

                  <div className="project-title-block">
                    <h2>{project.title}</h2>
                    <span className="case-link">{project.caseLabel}</span>
                  </div>

                  <div className="project-stats" aria-label="Project highlights">
                    {project.stats.map((stat) => (
                      <span key={stat}>{stat}</span>
                    ))}
                  </div>
                </TiltCard>
              </article>
            ))}
          </div>
        </section>

        <section className="motion-project" aria-labelledby="delivery-title">
          <div className="motion-meta">
            <span>2025 — 2026</span>
            <span>TECHNICAL DELIVERY</span>
          </div>

          <TiltCard className="motion-main-card">
            <MediaPlaceholder
              index="03"
              eyebrow="PROCESS REEL · 16:9"
              title="Delivery system in motion"
              note="Replace with a fast montage: request → data check → automation → dashboard → shipped result. 8–12 seconds."
            />
          </TiltCard>

          <div className="motion-satellite satellite-one">
            <MediaPlaceholder
              index="A"
              eyebrow="9:16 SCREEN"
              title="Product UI"
              note="Add Mini App screen"
              compact
            />
          </div>
          <div className="motion-satellite satellite-two">
            <MediaPlaceholder
              index="B"
              eyebrow="4:3 SCREEN"
              title="Analytics"
              note="Add dashboard crop"
              compact
            />
          </div>
          <div className="motion-satellite satellite-three">
            <MediaPlaceholder
              index="C"
              eyebrow="4:5 PORTRAIT"
              title="Portrait"
              note="Add dark portrait"
              compact
            />
          </div>

          <div className="motion-title" data-reveal>
            <h2 id="delivery-title">Delivery System</h2>
            <p>
              SQL · Python / Pandas · Power BI · Baserow · REST APIs · Google
              Apps Script · Next.js · React · TypeScript
            </p>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <button className="contact-copy" type="button" onClick={copyEmail}>
            <span>{copied ? "COPIED ✦" : "GET IN TOUCH · CLICK TO COPY"}</span>
            <strong>KARACHEVKI@GMAIL.COM</strong>
          </button>

          <nav className="contact-socials" aria-label="Contact links">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                <span>{link.label}</span>
                <i aria-hidden="true">↗</i>
              </a>
            ))}
          </nav>

          <footer className="site-footer">
            <div>
              <span>KIRILL KARACHEV</span>
              <span className="footer-mark">KK</span>
              <span>2026</span>
            </div>
            <nav aria-label="Footer navigation">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
              <a href="mailto:karachevki@gmail.com">Email</a>
            </nav>
            <span>CV PDF · ADD FINAL FILE</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
