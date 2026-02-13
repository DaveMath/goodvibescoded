import { useState, useEffect, useRef, useCallback } from "react";
import arcText from "@/assets/good-vibes-coded-arc.png";
import retroSun from "@/assets/retro-sun.png";
import macrameLeft from "@/assets/macrame-left.png";
import macrameRight from "@/assets/macrame-right.png";
import FloatingParticles from "@/components/FloatingParticles";
import VisitorInfo from "@/components/VisitorInfo";

const WORDS = [
  "Cheaply", "Wrongly", "Insecurely", "Recklessly", "Hastily",
  "Blindly", "Chaotically", "Duct-Taped", "Yolo'd", "Unreviewed",
  "Hallucinated", "Vibed", "Copy-Pasted", "Untested", "Spaghetti'd",
  "Yeet'd", "Procrastinated", "Over-Engineered", "Under-Documented",
];

const RAY_COUNT = WORDS.length;

// Confetti burst for easter egg
const createConfetti = (container: HTMLDivElement) => {
  const colors = [
    "hsl(45 95% 58%)", "hsl(35 90% 55%)", "hsl(20 80% 50%)",
    "hsl(0 80% 60%)", "hsl(280 70% 60%)", "hsl(180 70% 50%)",
    "hsl(120 60% 50%)", "hsl(50 95% 65%)",
  ];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");
    const size = Math.random() * 8 + 4;
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 200 + 100;
    const rotation = Math.random() * 720 - 360;
    el.style.cssText = `
      position: absolute; top: 50%; left: 50%;
      width: ${size}px; height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
      pointer-events: none; z-index: 100;
      transform: translate(-50%, -50%);
      animation: confetti-burst 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      --dx: ${Math.cos(angle) * velocity}px;
      --dy: ${Math.sin(angle) * velocity - 80}px;
      --rot: ${rotation}deg;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }
};

const Index = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [hoveredRay, setHoveredRay] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [entered, setEntered] = useState(false);
  const [sunClicked, setSunClicked] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Page entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Parallax mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Auto-rotation
  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 400);
    }, 2200);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused]);

  const handleRayHover = useCallback((index: number) => {
    setPaused(true);
    setHoveredRay(index);
    setVisible(false);
    setTimeout(() => {
      setWordIndex(index);
      setVisible(true);
    }, 200);
  }, []);

  const handleRayLeave = useCallback(() => {
    setHoveredRay(null);
    setPaused(false);
  }, []);

  const handleSunClick = () => {
    if (sunRef.current) {
      setSunClicked(true);
      createConfetti(sunRef.current);
      setTimeout(() => setSunClicked(false), 600);
    }
  };

  // Parallax offsets
  const px = (mousePos.x - 0.5) * 2;
  const py = (mousePos.y - 0.5) * 2;

  // Sun glow intensity based on mouse distance from center
  const distFromCenter = Math.sqrt(
    Math.pow(mousePos.x - 0.5, 2) + Math.pow(mousePos.y - 0.5, 2)
  );
  const glowIntensity = 1 - Math.min(distFromCenter * 2, 1);

  // Ray ripple: calculate distance from hovered ray
  const getRayOpacity = (i: number) => {
    if (hoveredRay === null) {
      return i % 2 === 0 ? 0.2 : 0.15;
    }
    const dist = Math.min(
      Math.abs(i - hoveredRay),
      RAY_COUNT - Math.abs(i - hoveredRay)
    );
    if (dist === 0) return 0.45;
    if (dist === 1) return 0.35;
    if (dist === 2) return 0.28;
    return i % 2 === 0 ? 0.18 : 0.13;
  };

  return (
    <main ref={mainRef} className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: "hsl(var(--background))" }}>

      {/* Floating particles */}
      <FloatingParticles />

      {/* Interactive starburst rays */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          transform: `translate(${px * -5}px, ${py * -5}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        {Array.from({ length: RAY_COUNT }, (_, i) => {
          const angle = (i * 360) / RAY_COUNT;
          const opacity = getRayOpacity(i);
          const isActive = wordIndex === i;
          return (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 cursor-pointer"
              style={{
                width: "0",
                height: "0",
                borderLeft: "30px solid transparent",
                borderRight: "30px solid transparent",
                borderBottom: `max(50vw, 50vh) solid`,
                borderBottomColor: isActive && hoveredRay === null
                  ? `hsla(45, 95%, 58%, 0.3)`
                  : `hsla(${i % 2 === 0 ? "45, 95%, 58%" : "35, 90%, 55%"}, ${opacity})`,
                transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                transformOrigin: "bottom center",
                transition: "border-bottom-color 0.3s ease",
                opacity: entered ? 1 : 0,
                animation: entered ? `ray-enter 0.8s ease-out ${i * 0.03}s both` : "none",
              }}
              onMouseEnter={() => handleRayHover(i)}
              onMouseLeave={handleRayLeave}
              onTouchStart={() => handleRayHover(i)}
            />
          );
        })}
        {/* Center fade */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 65% 60% at center, hsl(var(--background)) 0%, hsl(var(--background)) 60%, transparent 85%)`,
        }} />
      </div>

      {/* Main content with parallax */}
      <div
        className="relative flex flex-col items-center justify-center flex-1 w-full"
        style={{
          zIndex: 2,
          transform: `translate(${px * 8}px, ${py * 8}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Arc text */}
        <img
          src={arcText}
          alt="Good Vibes Coded"
          className="w-[320px] sm:w-[440px] md:w-[540px] mb-[-40px] sm:mb-[-50px] relative"
          style={{
            zIndex: 20,
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(-30px)",
            transition: "opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%), linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
            WebkitMaskComposite: "destination-in",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%), linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
            maskComposite: "intersect",
          }}
        />

        {/* Sun with breathing glow and easter egg */}
        <div
          ref={sunRef}
          className="relative flex items-center justify-center cursor-pointer"
          style={{ zIndex: 10 }}
          onClick={handleSunClick}
        >
          <img
            src={retroSun}
            alt="Retro 3D Sun"
            className="w-[280px] sm:w-[380px] md:w-[440px]"
            style={{
              filter: `drop-shadow(0 0 ${20 + glowIntensity * 30}px hsla(45, 95%, 58%, ${0.4 + glowIntensity * 0.4}))`,
              transition: "filter 0.4s ease-out",
              transform: sunClicked ? "scale(1.08)" : entered ? "scale(1)" : "scale(0.5)",
              opacity: entered ? 1 : 0,
              transitionProperty: "filter, transform, opacity",
              transitionDuration: sunClicked ? "0.15s" : "0.8s",
              transitionTimingFunction: "ease-out",
              transitionDelay: entered && !sunClicked ? "0.2s" : "0s",
              WebkitMaskImage: "radial-gradient(circle, black 40%, transparent 55%)",
              maskImage: "radial-gradient(circle, black 40%, transparent 55%)",
            }}
          />
          {/* Rotating word */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="block font-bold text-center px-4"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)",
                color: "hsl(var(--retro-brown))",
                textShadow: "0 2px 8px hsla(45, 95%, 58%, 0.5)",
                opacity: visible ? 1 : 0,
                transform: visible ? "scale(1)" : "scale(0.85)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              {WORDS[wordIndex]}
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p
          className="mt-4 text-lg sm:text-xl tracking-widest uppercase z-10"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 600,
            color: "hsl(var(--retro-brown) / 0.7)",
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s",
          }}
        >
          ...but coded 🤞
        </p>
      </div>

      {/* Macrame plants with parallax */}
      <div
        className="absolute top-[15%] sm:top-[10%] left-[-20px] sm:left-[-10px] w-[160px] sm:w-[200px] md:w-[240px] cursor-pointer"
        style={{
          zIndex: 3,
          transformOrigin: "top center",
          animation: entered ? "sway-left 4s ease-in-out infinite" : "none",
          transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          translate: `${px * -15}px ${py * -8}px`,
          opacity: entered ? 1 : 0,
          transitionProperty: "transform, opacity, translate",
          transitionDuration: "0.6s, 0.8s, 0.3s",
          transitionDelay: "0s, 0.4s, 0s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.animation = "none"; e.currentTarget.style.transform = "rotate(8deg)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "rotate(0deg)"; setTimeout(() => { if (e.currentTarget) e.currentTarget.style.animation = "sway-left 4s ease-in-out infinite"; }, 600); }}
        onTouchStart={(e) => { e.currentTarget.style.animation = "none"; e.currentTarget.style.transform = "rotate(8deg)"; setTimeout(() => { if (e.currentTarget) { e.currentTarget.style.transform = "rotate(0deg)"; setTimeout(() => { if (e.currentTarget) e.currentTarget.style.animation = "sway-left 4s ease-in-out infinite"; }, 600); } }, 800); }}
      >
        <img src={macrameLeft} alt="" className="w-full"
          style={{ mixBlendMode: "multiply", filter: "contrast(1.2) saturate(1.1)", WebkitMaskImage: "linear-gradient(to right, black 0%, black 50%, transparent 100%), linear-gradient(to bottom, black 0%, black 70%, transparent 95%)", WebkitMaskComposite: "destination-in", maskImage: "linear-gradient(to right, black 0%, black 50%, transparent 100%), linear-gradient(to bottom, black 0%, black 70%, transparent 95%)", maskComposite: "intersect" }}
          aria-hidden="true" />
      </div>
      <div
        className="absolute top-[15%] sm:top-[10%] right-[-20px] sm:right-[-10px] w-[160px] sm:w-[200px] md:w-[240px] cursor-pointer"
        style={{
          zIndex: 3,
          transformOrigin: "top center",
          animation: entered ? "sway-right 4.5s ease-in-out infinite" : "none",
          transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          translate: `${px * 15}px ${py * -8}px`,
          opacity: entered ? 1 : 0,
          transitionProperty: "transform, opacity, translate",
          transitionDuration: "0.6s, 0.8s, 0.3s",
          transitionDelay: "0s, 0.5s, 0s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.animation = "none"; e.currentTarget.style.transform = "rotate(-8deg)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "rotate(0deg)"; setTimeout(() => { if (e.currentTarget) e.currentTarget.style.animation = "sway-right 4.5s ease-in-out infinite"; }, 600); }}
        onTouchStart={(e) => { e.currentTarget.style.animation = "none"; e.currentTarget.style.transform = "rotate(-8deg)"; setTimeout(() => { if (e.currentTarget) { e.currentTarget.style.transform = "rotate(0deg)"; setTimeout(() => { if (e.currentTarget) e.currentTarget.style.animation = "sway-right 4.5s ease-in-out infinite"; }, 600); } }, 800); }}
      >
        <img src={macrameRight} alt="" className="w-full"
          style={{ mixBlendMode: "multiply", filter: "contrast(1.2) saturate(1.1)", WebkitMaskImage: "linear-gradient(to left, black 0%, black 50%, transparent 100%), linear-gradient(to bottom, black 0%, black 70%, transparent 95%)", WebkitMaskComposite: "destination-in", maskImage: "linear-gradient(to left, black 0%, black 50%, transparent 100%), linear-gradient(to bottom, black 0%, black 70%, transparent 95%)", maskComposite: "intersect" }}
          aria-hidden="true" />
      </div>

      {/* Footer */}
      <footer className="relative z-10 pb-6 pt-8 text-center"
        style={{
          opacity: entered ? 1 : 0,
          transition: "opacity 0.8s ease-out 0.8s",
        }}>
        <p className="text-sm sm:text-base"
          style={{ fontFamily: "'Fredoka', sans-serif", color: "hsl(var(--retro-brown) / 0.7)" }}>
          Copyright 2026 — A{" "}
          <a href="https://davemathews.com" target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 hover:no-underline transition-all"
            style={{ color: "hsl(var(--secondary))" }}>
            DaveMathews.com
          </a>{" "}
          creation.
        </p>
        <VisitorInfo />
      </footer>
    </main>
  );
};

export default Index;
