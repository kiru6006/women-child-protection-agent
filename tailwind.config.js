/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: "var(--bg-app)",
        card: "var(--bg-card)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        muted: {
          foreground: "var(--text-muted)",
        },
        gov: {
          navy: "#0F2744",
          blue: "#1D4ED8",
          light: "#F1F5F9",
          slate: "#334155",
          women: "#BE185D",
          child: "#0369A1",
          accent: "#EA580C",
          alert: "#DC2626",
          success: "#047857",
        },
      },
    },
  },
  plugins: [],
};
