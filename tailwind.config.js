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
      },
      boxShadow: {
        '3xl': '10px 35px 60px -15px rgba(0, 0, 0, 0.3)',
        '4xl': '30px 45px 80px -20px rgba(0, 0, 0, 0.4)',
        '5xl': '50px 55px 100px -25px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
