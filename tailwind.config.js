/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#ff702e",
        "background-light": "#ffffff",
        "background-dark": "#141414",
        "surface": "#1f1f1f",
        "surface-highlight": "#2a2a2a",
        "border-muted": "#333333"
      },
      fontFamily: {
        "display": ["Epilogue", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
