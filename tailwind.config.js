/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0a0612",
        nightcard: "#150d24",
        nightcard2: "#1d1233",
        neon: {
          pink: "#ff2d95",
          purple: "#b14aff",
          cyan: "#22e0ff",
          lime: "#aaff00",
          yellow: "#ffd60a",
          orange: "#ff7849",
        },
        corp: {
          bg: "#f0f3f7",
          header: "#1b4e8c",
          headerdark: "#143a68",
          text: "#33475b",
          border: "#d4dde8",
        },
      },
      fontFamily: {
        display: ["'Outfit'", "system-ui", "sans-serif"],
        corp: ["'Inter'", "Arial", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(255,45,149,0.5)",
        neoncyan: "0 0 20px rgba(34,224,255,0.45)",
      },
      keyframes: {
        glitchin: {
          "0%": { opacity: "0", filter: "blur(8px) hue-rotate(0deg)", transform: "scale(1.04)" },
          "60%": { filter: "blur(0) hue-rotate(90deg)" },
          "100%": { opacity: "1", filter: "blur(0) hue-rotate(0deg)", transform: "scale(1)" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseglow: {
          "0%,100%": { boxShadow: "0 0 12px rgba(177,74,255,0.4)" },
          "50%": { boxShadow: "0 0 28px rgba(177,74,255,0.8)" },
        },
      },
      animation: {
        glitchin: "glitchin 0.7s ease-out",
        floaty: "floaty 3s ease-in-out infinite",
        pop: "pop 0.35s ease-out",
        shimmer: "shimmer 1.4s linear infinite",
        pulseglow: "pulseglow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
