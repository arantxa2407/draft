/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include Expo Router app files and any shared components.
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}