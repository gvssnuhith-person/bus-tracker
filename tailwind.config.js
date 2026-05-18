/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#05050a",
        card: "rgba(10, 10, 20, 0.4)",
        primary: {
          DEFAULT: "#00f0ff",
          dark: "#00b8c4",
          light: "#80f7ff",
        },
        secondary: {
          DEFAULT: "#bd34fe",
          dark: "#8f00c7",
          light: "#df9aff",
        },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        muted: "#94a3b8",
        border: "rgba(255, 255, 255, 0.08)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "neon-cyan": "0 0 15px rgba(0, 240, 255, 0.35)",
        "neon-purple": "0 0 15px rgba(189, 52, 254, 0.35)",
        "neon-emerald": "0 0 15px rgba(16, 185, 129, 0.35)",
        "neon-amber": "0 0 15px rgba(245, 158, 11, 0.35)",
        "neon-rose": "0 0 15px rgba(239, 68, 68, 0.35)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.2", filter: "brightness(1)" },
          "50%": { opacity: "0.7", filter: "brightness(1.5)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}
