import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#06070a",
          800: "#0b0d12",
          700: "#11141b",
          600: "#1a1f29",
          500: "#272e3c",
          400: "#3a4252",
          300: "#5d6678",
          200: "#9aa3b5",
          100: "#cfd4df",
          50: "#eef0f4",
        },
        kafka: {
          50: "#fff7ec",
          100: "#ffe9c2",
          300: "#ffb454",
          500: "#f08a1e",
          600: "#c96b0a",
          700: "#8d4807",
          900: "#3b1d02",
          glow: "#ffb454",
        },
        redis: {
          50: "#fff1f1",
          100: "#ffd5d5",
          300: "#ff6a6a",
          500: "#e23838",
          600: "#b8201f",
          700: "#7d1313",
          900: "#380707",
          glow: "#ff6a6a",
        },
        pattern: {
          50: "#ecfeff",
          100: "#c5f8fb",
          300: "#5be6ee",
          500: "#19b5c0",
          600: "#0d8a93",
          700: "#075b62",
          900: "#022629",
          glow: "#5be6ee",
        },
      },
      fontFamily: {
        display: [
          "Inter Tight",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      fontSize: {
        hero: ["clamp(2.5rem, 6vw, 5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        title: ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        section: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
      },
      boxShadow: {
        glow: "0 0 60px -10px var(--tw-shadow-color)",
        inset: "inset 0 1px 0 0 rgba(255,255,255,0.04)",
      },
      keyframes: {
        pulse_soft: {
          "0%, 100%": { opacity: "0.9" },
          "50%": { opacity: "0.55" },
        },
        drift: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        pulse_soft: "pulse_soft 3.6s ease-in-out infinite",
        drift: "drift 3.2s ease-in-out infinite alternate",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
