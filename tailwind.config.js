const { Color } = require("./src/theme/color.ts");
const { Spacing, BorderWidth } = require("./src/theme/spacing.ts");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{tsx,jsx,ts,js}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: Color,
      spacing: Spacing,
      borderWidth: BorderWidth,
    },
  },
  plugins: [],
};
