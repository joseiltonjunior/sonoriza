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
      fontFamily: {
        'baloo-bold': ['Baloo2-Bold'],
        'baloo-medium': ['Baloo2-Medium'],
        'baloo-regular': ['Baloo2-Regular'],
        'baloo-extrabold': ['Baloo2-ExtraBold'],
        'baloo-semibold': ['Baloo2-SemiBold'],
      },
    },
  },
  plugins: [],
}
