import forms from "@tailwindcss/forms";


/** @type {import('tailwindcss').Config} */

// design tokens

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "plus-font": ["Plus Jakarta Sans", "sans-serif"],
        "poppins": ["Poppins", "serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#f59e0b", // amber-500: primary gold headings & focus rings
          hover: "#d97706",   // amber-600: accessible hover state on white
          border: "rgba(180, 83, 9, 0.35)", // subtle golden-brown border
        },
        accent: {
          DEFAULT: "#34d399", // emerald-400: primary CTA fill
          hover: "#6ee7b7",   // emerald-300: CTA hover
          ink: "#0a0a0a",     // neutral-950: high-contrast text on light green
        },
        surface: {
          page: "#ffffff",
          card: "#ffffff",
          input: "#f3f4f6",   // gray-100
        },
        ink: {
          primary: "#262626", // neutral-800: input text & primary copy
          label: "#404040",   // neutral-700: form labels
          muted: "#525252",   // neutral-600: subtitles & footer copy
        },
      },
    },
  },
  plugins: [forms],
};