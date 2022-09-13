/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    fontFamily: {
      'sans': ['Montserrat', 'sans-serif'],
      'display': ['Pacifico', 'cursive'],
      'rounded': ['Comfortaa', 'Montserrat', 'sans-serif'],
      'body': ['Ralway', 'sans-serif'],
      'mono': ['Fira Code', 'monospace'],
    },
    extend: {
      dropShadow: {
        'light': '10px 10px 8px rgba(0,0,0,0.9)',
        'dark': '5px 5px 4px rgba(210,210,210,0.5)'
      },
      transitionDuration: {
        '1000': '1000ms',
        '2000': '2000ms',
        '3000': '3000ms',
        '4000': '4000ms',
        '5000': '5000ms',
        '6000': '6000ms',
        '7000': '7000ms',
        '8000': '8000ms',
        '9000': '9000ms',
        '10000': '10000ms',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
