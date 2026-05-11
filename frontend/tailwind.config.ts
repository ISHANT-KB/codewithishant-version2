import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#faf8f3",
        "parchment-hover": "#f5f1e8",
        "parchment-active": "#f0ead8",
        gold: "#c8a96e",
        "gold-bright": "#e8b84b",
        "gold-dark": "#8a6830",
        ink: "#1a1a18",
        "ink-muted": "#6b6560",
        "ink-faint": "#9b9590",
        "ink-ghost": "#c8c3bb",
        "warm-border": "#e4dfd5",
        "warm-border-dark": "#d8d3c8",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        mono: ["DM Mono", "Courier New", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.45s ease both",
        "slide-down": "slideDown 0.4s ease both",
        "load-bar": "loadBar 1.2s ease infinite",
        shake: "shake 0.4s ease",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        loadBar: {
          "0%":   { width: "0%",  marginLeft: "0" },
          "50%":  { width: "70%", marginLeft: "10%" },
          "100%": { width: "0%",  marginLeft: "100%" },
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "20%":     { transform: "translateX(-8px)" },
          "40%":     { transform: "translateX(8px)" },
          "60%":     { transform: "translateX(-6px)" },
          "80%":     { transform: "translateX(6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
