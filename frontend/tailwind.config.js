/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        nexora: {
          bg: "#070809",
          panel: "#111315",
          panelSoft: "#171a1d",
          text: "#e8e8e8",
          muted: "#9aa4b2",
          gold: "#f6c453",
          goldSoft: "#e6a91a",
        },
      },
      boxShadow: {
        premium: "0 10px 30px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};
