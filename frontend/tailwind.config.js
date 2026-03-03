/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nova-primary': '#34ebd2',
        'nova-secondary': '#349beb',
        'nova-navy': '#000080',
      },
    },
  },
  plugins: [],
}
