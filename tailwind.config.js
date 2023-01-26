/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        pacifico: ['Pacifico'],
        mono: ['IBM Plex Mono', 'monospace'],
        sans: ['Montserrat'],
      },
      scale: {
        200: '2',
        300: '3',
      },
      animation: {
        'breathe': 'breathe 2s ease-in-out infinite',
      },
      transitionDuration: {
        1500: '1500ms',
        2000: '2000ms',
        2500: '2500ms',
        3000: '3000ms',
      }
    },
  },
  plugins: [],
}
