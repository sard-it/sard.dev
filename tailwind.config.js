/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-orange': {
          DEFAULT: '#ef9c00',
          50: '#fef5e6',
          100: '#fde9cc',
          200: '#fbd399',
          300: '#f9bd66',
          400: '#f7a733',
          500: '#ef9c00',
          600: '#d18a00',
          700: '#b37800',
          800: '#956600',
          900: '#775400',
        },
      },
    },
  },
  plugins: [],
};