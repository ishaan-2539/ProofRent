/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#E11D48',
          600: '#C80D2E',
          700: '#B80D1D',
          800: '#8B0000',
        },
        olive: {
          800: '#1A261C',
          900: '#121B13',
          950: '#0B110C',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F4EFEA',
          200: '#E9DEC3',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(18, 27, 19, 0.07), 0 0 15px 0 rgba(184, 13, 29, 0.03)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'red-glow': '0 8px 25px -5px rgba(184, 13, 29, 0.35)',
      },
    },
  },
  plugins: [],
}