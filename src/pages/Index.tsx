import { useState, useEffect, useRef } from "react";
import arcText from "@/assets/good-vibes-coded-arc.png";
import retroSun from "@/assets/retro-sun.png";
import macrameLeft from "@/assets/macrame-left.png";
import macrameRight from "@/assets/macrame-right.png";

const WORDS = [
  "Cheaply", "Wrongly", "Insecurely", "Recklessly", "Hastily",
  "Blindly", "Chaotically", "Duct-Taped", "Yolo'd", "Unreviewed",
  "Hallucinated", "Vibed", "Copy-Pasted", "Untested", "Spaghetti'd",
  "Yeet'd", "Procrastinated", "Over-Engineered", "Under-Documented",
];

const Index = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 400);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Starburst rays
  const rays = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 360) / 24;
    return (
      <div
        key={i}
        className="absolute top-1/2 left-1/2"
        style={{
          width: "0",
          height: "0",
          borderLeft: "30px solid transparent",
          borderRight: "30px solid transparent",
          borderBottom: `max(50vw, 50vh) solid`,
          borderBottomColor: i % 2 === 0
            ? "hsl(45 95% 58% / 0.2)"
            : "hsl(35 90% 55% / 0.15)",
          transform: `translate(-50%, -100%) rotate(${angle}deg)`,
          transformOrigin: "bottom center",
        }}
      />
    );
  });

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: "#EDE4CD" }}>

      {/* Starburst rays */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
        {rays}
        {/* Center fade to hide rays behind content */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 65% 60% at center, #EDE4CD 0%, #EDE4CD 60%, transparent 85%)",
        }} />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center justify-center flex-1 w-full" style={{ zIndex: 2 }}>

        {/* Arc text artwork */}
        <img
          src={arcText}
          alt="Good Vibes Coded"
          className="w-[320px] sm:w-[440px] md:w-[540px] mb-[-40px] sm:mb-[-50px] relative"
          style={{ zIndex: 20, WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%), linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)", WebkitMaskComposite: "destination-in", maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%), linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)", maskComposite: "intersect" }}
        />

        {/* 3D Sun artwork */}
        <div className="relative flex items-center justify-center" style={{ zIndex: 10 }}>
          <img
            src={retroSun}
            alt="Retro 3D Sun"
            className="w-[280px] sm:w-[380px] md:w-[440px]"
            style={{ animation: "pulse-glow 4s ease-in-out infinite", WebkitMaskImage: "radial-gradient(circle, black 50%, transparent 80%)", maskImage: "radial-gradient(circle, black 50%, transparent 80%)" }}
          />
          {/* Rotating word overlaid on sun */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="block font-bold text-center px-4"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)",
                color: "hsl(25 50% 30%)",
                textShadow: "0 2px 8px hsl(45 95% 58% / 0.5)",
                opacity: visible ? 1 : 0,
                transform: visible ? "scale(1)" : "scale(0.85)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
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
            color: "hsl(25 50% 30% / 0.7)",
          }}
        >
          ...but coded 🤞
        </p>
      </div>

      {/* Macrame plants - hanging from top */}
      <div
        className="absolute top-0 left-2 sm:left-4 w-[120px] sm:w-[160px] md:w-[200px] cursor-pointer"
        style={{ zIndex: 3, transformOrigin: "top center", transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "rotate(5deg)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "rotate(0deg)"}
        onTouchStart={(e) => { e.currentTarget.style.transform = "rotate(5deg)"; setTimeout(() => { if (e.currentTarget) e.currentTarget.style.transform = "rotate(0deg)"; }, 800); }}
      >
        <img
          src={macrameLeft}
          alt=""
          className="w-full"
          style={{ mixBlendMode: "multiply", WebkitMaskImage: "linear-gradient(to right, black 40%, transparent 100%), linear-gradient(to bottom, black 70%, transparent 95%)", WebkitMaskComposite: "destination-in", maskImage: "linear-gradient(to right, black 40%, transparent 100%), linear-gradient(to bottom, black 70%, transparent 95%)", maskComposite: "intersect" }}
          aria-hidden="true"
        />
      </div>
      <div
        className="absolute top-0 right-2 sm:right-4 w-[120px] sm:w-[160px] md:w-[200px] cursor-pointer"
        style={{ zIndex: 3, transformOrigin: "top center", transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "rotate(-5deg)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "rotate(0deg)"}
        onTouchStart={(e) => { e.currentTarget.style.transform = "rotate(-5deg)"; setTimeout(() => { if (e.currentTarget) e.currentTarget.style.transform = "rotate(0deg)"; }, 800); }}
      >
        <img
          src={macrameRight}
          alt=""
          className="w-full"
          style={{ mixBlendMode: "multiply", WebkitMaskImage: "linear-gradient(to left, black 40%, transparent 100%), linear-gradient(to bottom, black 70%, transparent 95%)", WebkitMaskComposite: "destination-in", maskImage: "linear-gradient(to left, black 40%, transparent 100%), linear-gradient(to bottom, black 70%, transparent 95%)", maskComposite: "intersect" }}
          aria-hidden="true"
        />
      </div>

      {/* Footer */}
      <footer className="relative z-10 pb-6 pt-8 text-center">
        <p
          className="text-sm sm:text-base"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            color: "hsl(25 50% 30% / 0.7)",
          }}
        >
          Copyright 2026 — A{" "}
          <a
            href="https://davemathews.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:no-underline transition-all"
            style={{ color: "hsl(20 80% 50%)" }}
          >
            DaveMathews.com
          </a>{" "}
          creation.
        </p>
      </footer>
    </main>
  );
};

export default Index;
