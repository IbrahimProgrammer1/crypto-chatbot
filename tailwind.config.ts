import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Enhanced Web3 color palette
        electric: {
          blue: "#3b82f6",
          purple: "#a855f7",
          cyan: "#06b6d4",
          pink: "#ec4899",
        },
      },
      backgroundImage: {
        "premium-dark": "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh": "radial-gradient(at 40% 20%, rgba(59, 130, 246, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(168, 85, 247, 0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(236, 72, 153, 0.3) 0px, transparent 50%)",
      },
      boxShadow: {
        "glow-sm": "0 0 15px rgba(59, 130, 246, 0.15)",
        "glow-md": "0 0 25px rgba(59, 130, 246, 0.2)",
        "glow-lg": "0 0 35px rgba(59, 130, 246, 0.25)",
        "glow-emerald": "0 0 20px rgba(16, 185, 129, 0.2)",
        "glow-purple": "0 0 20px rgba(168, 85, 247, 0.2)",
        "glow-rose": "0 0 20px rgba(244, 63, 94, 0.2)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.2)",
        "glow-orange": "0 0 20px rgba(249, 115, 22, 0.2)",
      },
      animation: {
        "spin": "spin 1s linear infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-right": "slideRight 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.15)" },
          "50%": { boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
