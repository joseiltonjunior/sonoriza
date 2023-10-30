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
      },
      fontFamily: {
        'nunito-bold': ['Nunito-Bold'],
        'nunito-medium': ['Nunito-Medium'],
        'nunito-regular': ['Nunito-Regular'],
        'nunito-light': ['Nunito-Light'],
        'nunito-semibold': ['Nunito-SemiBold'],
      },
    },
  },
  plugins: [],
}
