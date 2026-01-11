/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./sections/**/*.{js,jsx,ts,tsx}",
    "./layouts/**/*.{js,jsx,ts,tsx}",

  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'azure-radiance': {
    '50': '#edfaff',
    '100': '#d6f2ff',
    '200': '#b5eaff',
    '300': '#83dfff',
    '400': '#48cbff',
    '500': '#1eadff',
    '600': '#068fff',
    '700': '#007bff',
    '800': '#085ec5',
    '900': '#0d519b',
    '950': '#0e315d',
      },
        
      }
    },
   
  },
  plugins: [],
}