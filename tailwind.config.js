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
        'baloo-bold': ['Baloo2-Bold', 'sans'],
        'baloo-medium': ['Baloo2-Medium', 'sans'],
        'baloo-regular': ['Baloo2-Regular', 'sans'],
        'baloo-extrabold': ['Baloo2-ExtraBold', 'sans'],
        'baloo-semibold': ['Baloo2-SemiBold', 'sans'],
      },
    },
  },
  plugins: [],
}
