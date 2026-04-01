"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

export interface DotGlobeProps {
  size?: number;
  dotCount?: number;
  dotColor?: string;
  rotationSpeed?: number;
  className?: string;
}

interface Dot {
  phi: number;
  theta: number;
}

export const DotGlobe: React.FC<DotGlobeProps> = ({
  size = 300,
  dotCount = 800,
  dotColor = "#E77630",
  rotationSpeed = 0.002,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const dots: Dot[] = useMemo(() => {
    const pts: Dot[] = [];
    // fibonacci sphere for even distribution
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < dotCount; i++) {
      const y = 1 - (i / (dotCount - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const phi = Math.acos(y);
      pts.push({ phi, theta });
    }
    return pts;
  }, [dotCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let rotation = 0;
    const center = size / 2;
    const radius = size * 0.38;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      rotation += rotationSpeed;

      for (const dot of dots) {
        const x =
          radius *
          Math.sin(dot.phi) *
          Math.cos(dot.theta + rotation);
        const y = radius * Math.cos(dot.phi);
        const z =
          radius *
          Math.sin(dot.phi) *
          Math.sin(dot.theta + rotation);

        // only draw front-facing dots
        if (z < 0) continue;

        const scale = (z + radius) / (2 * radius);
        const dotSize = 1 + scale * 1.5;
        const alpha = 0.15 + scale * 0.6;

        ctx.beginPath();
        ctx.arc(center + x, center - y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.globalAlpha = alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [dots, size, dotColor, rotationSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none", className)}
      style={{ width: size, height: size }}
    />
  );
};
