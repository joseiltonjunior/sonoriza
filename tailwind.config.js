/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          700: '#312e38',
          950: '#202022',
        },
        blue: {
          500: '#4FACFE',
          400: '#66a6ff',
        },
      },
    },
  },
  plugins: [],
}
