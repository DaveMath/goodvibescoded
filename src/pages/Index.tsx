import { useState, useEffect } from "react";

const WORDS = [
  "Cheaply", "Wrongly", "Insecurely", "Recklessly", "Hastily",
  "Blindly", "Chaotically", "Duct-Taped", "Yolo'd", "Unreviewed",
  "Hallucinated", "Vibed", "Copy-Pasted", "Untested", "Spaghetti'd",
  "Yeet'd", "Procrastinated", "Over-Engineered", "Under-Documented",
];

const ARC_TEXT = "Good Vibes Coded";

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

  // Generate starburst rays
  const rays = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 360) / 24;
    return (
      <div
        key={i}
        className="absolute top-1/2 left-1/2 origin-bottom-center"
        style={{
          width: "0",
          height: "0",
          borderLeft: "30px solid transparent",
          borderRight: "30px solid transparent",
          borderBottom: `max(50vw, 50vh) solid`,
          borderBottomColor: i % 2 === 0
            ? "hsl(45 95% 58% / 0.35)"
            : "hsl(35 90% 55% / 0.25)",
          transform: `translate(-50%, -100%) rotate(${angle}deg)`,
          transformOrigin: "bottom center",
        }}
      />
    );
  });

  // Arc text using SVG
  const arcLetters = ARC_TEXT.split("");

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: "hsl(40 60% 92%)" }}>

      {/* Starburst rays */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {rays}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full">

        {/* Arc text above sun */}
        <svg viewBox="0 0 400 200" className="w-[340px] sm:w-[420px] md:w-[500px] mb-[-60px] sm:mb-[-80px] z-20"
          aria-label="Good Vibes Coded">
          <defs>
            <path id="arc" d="M 30,180 A 170,170 0 0,1 370,180" fill="none" />
          </defs>
          <text
            fill="hsl(25 50% 30%)"
            style={{ fontFamily: "'Bungee Shade', cursive", fontSize: "36px", letterSpacing: "2px" }}
          >
            <textPath href="#arc" startOffset="50%" textAnchor="middle">
              {ARC_TEXT}
            </textPath>
          </text>
        </svg>

        {/* Sun circle */}
        <div
          className="relative rounded-full flex items-center justify-center z-10"
          style={{
            width: "clamp(220px, 40vw, 360px)",
            height: "clamp(220px, 40vw, 360px)",
            background: "radial-gradient(circle at 40% 35%, hsl(50 95% 65%), hsl(45 95% 58%) 40%, hsl(35 90% 55%) 70%, hsl(20 80% 50%))",
            boxShadow: "0 0 60px hsl(45 95% 58% / 0.5), 0 0 120px hsl(35 90% 55% / 0.3)",
            animation: "pulse-glow 4s ease-in-out infinite",
          }}
        >
          {/* Rotating word */}
          <div className="text-center px-6">
            <span
              className="block font-bold transition-all duration-400"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
                color: "hsl(25 50% 30%)",
                opacity: visible ? 1 : 0,
                transform: visible ? "scale(1)" : "scale(0.85)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}
            >
              {WORDS[wordIndex]}
            </span>
          </div>
        </div>

        {/* "Coded" label under sun for context */}
        <p
          className="mt-4 text-lg sm:text-xl tracking-widest uppercase z-10"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 600,
            color: "hsl(25 50% 30% / 0.7)",
          }}
        >
          ...but coded ✌️
        </p>
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
