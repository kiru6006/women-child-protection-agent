/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: "#0b2545",
          blue: "#134074",
          light: "#eef4f8",
          slate: "#334155",
          accent: "#d97706",
          alert: "#b91c1c",
          success: "#15803d"
        }
      }
    },
  },
  plugins: [],
}
