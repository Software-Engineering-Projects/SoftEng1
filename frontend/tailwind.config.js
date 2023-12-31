/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      maxHeight: {
        450: "450px",
      },

      animation: {
        "slide-in-from-left": "slideInFromLeft 1s ease-in-out",
        "slide-in-from-right": "slideInFromRight 1s ease-in-out",
        "slide-in-from-top": "slideInFromTop 1s ease-in-out",
        "slide-in-from-bottom": "slideInFromBottom 1s ease-in-out",
        "slide-out-to-left": "slideOutToLeft 1s ease both",
        "slide-out-to-right": "slideOutToRight 1s ease both",
        "slide-out-to-top": "slideOutToTop 1s ease both",
        "slide-out-to-bottom": "slideOutToBottom 1s ease both",
      },

      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
      fontFamily: {
        body: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      // TODO:
      // Added some custom styling for the future elements, i.e cart, checkout, etc..
      screens: {
        xs: { max: "639px" },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("flowbite/plugin"), [require("daisyui")]],
};
