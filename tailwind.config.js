/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBF7F0",
        ink: "#1a1a1a",
        sketchPink: "#FF4D8D",
        sketchOrange: "#FF8A3C",
        sketchBlue: "#4A90E2",
        sketchYellow: "#F6C667",
        sketchGreen: "#6FCF97",
      },
      fontFamily: {
        display: ["Caveat", "cursive"],
        hand: ["Kalam", "cursive"],
        ui: ["'Patrick Hand'", "cursive"],
      },
      keyframes: {
        bob: {
          "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-8px) rotate(2deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
      },
      animation: {
        bob: "bob 4s ease-in-out infinite",
        wiggle: "wiggle 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
