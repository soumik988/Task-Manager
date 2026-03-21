/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ include JSX
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2172f0", // ✅ your custom color
      },
    },
  },
  plugins: [],
}