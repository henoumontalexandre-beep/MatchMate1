import { motion } from "framer-motion";
import { useMemo } from "react";

interface CompatibilityScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function CompatibilityScore({ score, size = "md" }: CompatibilityScoreProps) {
  const sizeMap = {
    sm: { box: "w-16 h-16", r: 30, stroke: 3.5, font: "text-sm" },
    md: { box: "w-28 h-28", r: 42, stroke: 4.5, font: "text-3xl" },
    lg: { box: "w-36 h-36", r: 54, stroke: 5.5, font: "text-5xl" },
  } as const;

  const cfg = sizeMap[size];
  const circumference = 2 * Math.PI * cfg.r;
  const strokeDashoffset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;
  const gradId = useMemo(() => `score-${Math.random()}`, []);

  return (
    <motion.div
      className={`relative flex items-center justify-center ${cfg.box}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 14 }}
      role="img"
      aria-label={`Compatibilité: ${score}%`}
      style={{
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15)) drop-shadow(0 0 12px rgba(250,200,50,0.04))",
      }}
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.6)" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle background ring with ultra-light color */}
        <circle
          cx="50"
          cy="50"
          r={cfg.r}
          fill="none"
          stroke="hsl(var(--primary) / 0.06)"
          strokeWidth={cfg.stroke}
        />

        {/* Modern gradient progress ring with subtle glow */}
        <motion.circle
          cx="50"
          cy="50"
          r={cfg.r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={cfg.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          filter="url(#glow)"
          style={{ opacity: 0.95 }}
        />
      </svg>

      {/* Centered percentage text with subtle styling */}
      <div className="relative flex items-center justify-center z-10">
        <span
          className={`${cfg.font} font-semibold tracking-tight text-foreground`}
          style={{
            textShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          {Math.round(score)}%
        </span>
      </div>
    </motion.div>
  );
}
