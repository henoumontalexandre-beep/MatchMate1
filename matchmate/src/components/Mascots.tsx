import React from "react";
import { motion } from "framer-motion";

export default function Mascots() {
  return (
    <div className="absolute right-8 bottom-8 hidden lg:block z-30 pointer-events-none">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-end gap-4"
      >
        {/* Small phone-like mascot */}
        <motion.div className="w-28 h-48 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 shadow-2xl p-2 flex items-center justify-center" whileHover={{ scale: 1.05 }}>
          <div className="w-24 h-40 bg-slate-900/50 rounded-xl flex items-center justify-center text-white font-bold">MM</div>
        </motion.div>

        {/* Character mascot */}
        <motion.div initial={{ rotate: -6 }} whileHover={{ rotate: 0 }} className="w-28">
          <svg viewBox="0 0 120 140" className="w-full h-auto">
            <defs>
              <linearGradient id="m1" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            <rect x="10" y="40" width="100" height="80" rx="16" fill="url(#m1)" />
            <circle cx="60" cy="30" r="24" fill="#111827" stroke="#fff2" strokeWidth="2" />
            <g fill="#fff">
              <circle cx="52" cy="28" r="3" />
              <circle cx="68" cy="28" r="3" />
            </g>
            <path d="M44 36 q16 10 32 0" stroke="#ffffff66" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
