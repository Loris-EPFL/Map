"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  twinkleAmp: number;
  phase: number;
  speed: number;
  vx: number;
  vy: number;
  bright: boolean;
  hue: number;
};

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let raf: number | null = null;
    let lastT = 0;

    function rand(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function setup() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      const count = Math.max(100, Math.min(280, Math.floor((width * height) / 5200)));
      stars = Array.from({ length: count }, () => {
        const bright = Math.random() < 0.08;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: bright ? rand(0.9, 1.7) : Math.pow(Math.random(), 2) * 1.1 + 0.3,
          baseOpacity: bright ? rand(0.65, 0.95) : rand(0.25, 0.7),
          twinkleAmp: bright ? rand(0.25, 0.45) : rand(0.15, 0.35),
          phase: Math.random() * Math.PI * 2,
          speed: rand(0.0015, 0.0045),
          // Gentle global rightward drift + per-star variation
          vx: rand(-0.005, 0.025),
          vy: rand(-0.01, 0.01),
          bright,
          // Subtle color temperature: 0 = warm, 1 = neutral, 2 = cool
          hue: Math.floor(rand(0, 3)),
        };
      });
    }

    function colorFor(hue: number) {
      // r,g,b channel triplets — kept close to white
      if (hue === 0) return "255, 240, 220"; // warm
      if (hue === 2) return "215, 230, 255"; // cool
      return "245, 248, 255"; // neutral
    }

    function draw(t: number) {
      if (!ctx) return;
      const dt = lastT > 0 ? Math.min(64, t - lastT) : 16;
      lastT = t;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (const s of stars) {
        // Drift
        s.x += s.vx * (dt / 16);
        s.y += s.vy * (dt / 16);
        if (s.x < -5) s.x = width + 5;
        else if (s.x > width + 5) s.x = -5;
        if (s.y < -5) s.y = height + 5;
        else if (s.y > height + 5) s.y = -5;

        // Twinkle — sharper peaks for shine
        const wave = Math.sin(t * s.speed + s.phase);
        const o = Math.max(
          0,
          Math.min(1, s.baseOpacity + wave * s.twinkleAmp)
        );
        const c = colorFor(s.hue);

        // Outer halo
        ctx.fillStyle = `rgba(${c}, ${o * (s.bright ? 0.22 : 0.14)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (s.bright ? 6 : 3.4), 0, Math.PI * 2);
        ctx.fill();

        // Inner glow
        ctx.fillStyle = `rgba(${c}, ${o * 0.45})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(${c}, ${o})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // Diffraction spikes on the brightest stars at peak shine
        if (s.bright && wave > 0.85) {
          const len = s.r * 6 * (wave - 0.6);
          ctx.strokeStyle = `rgba(${c}, ${o * 0.55})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(s.x - len, s.y);
          ctx.lineTo(s.x + len, s.y);
          ctx.moveTo(s.x, s.y - len);
          ctx.lineTo(s.x, s.y + len);
          ctx.stroke();
        }
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    }

    setup();
    raf = requestAnimationFrame(draw);

    let resizeTimer: number | null = null;
    const onResize = () => {
      if (resizeTimer != null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => setup(), 120);
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (raf != null) cancelAnimationFrame(raf);
      if (resizeTimer != null) window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
