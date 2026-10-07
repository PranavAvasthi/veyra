const { Color } = require("./src/theme/color.ts");
const { Spacing, BorderWidth } = require("./src/theme/spacing.ts");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{tsx,jsx,ts,js}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: Object.fromEntries(
        Object.entries(Color).map(([group, steps]) => [
          group,
          Object.fromEntries(
            Object.keys(steps).map((step) => [
              step,
              `var(--color-${group}-${step})`,
            ]),
          ),
        ]),
      ),
      fontFamily: {
        manropeExtraLight: "manropeExtraLight",
        manropeLight: "manropeLight",
        manropeNormal: "manropeNormal",
        manropeMedium: "manropeMedium",
        manropeSemiBold: "manropeSemiBold",
        manropeBold: "manropeBold",
        manropeExtraBold: "manropeExtraBold",
      },
      spacing: Spacing,
      borderWidth: BorderWidth,
    },
  },
  plugins: [],
};
