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
          DEFAULT: "#0a0f0f", // : primary color
          hover: "#000066",   // amber-600: accessible hover state on white
          border: "##005c99", // 
        },
        accent: {
          DEFAULT: "#24a850", // emerald-400: primary CTA fill
          hover: "#6ee7b7",   // emerald-300: CTA hover
          ink: "#0a0a0a",     // neutral-950: high-contrast text on light green
        },
        surface: {
          page: "#ffffff",
          card: "#ffffff",
          input: "#f3f4f6",   // gray-100
        },
        ink: {
          primary: "#00001a", // neutral-800: input text & primary copy
          label: "#404040",   // neutral-700: form labels
          muted: "#525252",   // neutral-600: subtitles & footer copy
        },
      },
    },
  },
  plugins: [forms],
};