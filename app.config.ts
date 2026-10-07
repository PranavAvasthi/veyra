const {
  DarkPallete,
  LightPallete,
}: typeof import("./src/theme/color") = require("./src/theme/color.ts");

export default {
  expo: {
    name: "veyra",
    slug: "veyra",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "veyra",
    userInterfaceStyle: "automatic",
    ios: {
      bundleIdentifier: "com.veyra.mobileapp",
      icon: "./assets/images/ios-icon.png",
    },
    android: {
      package: "com.veyra.mobileapp",
      adaptiveIcon: {
        foregroundImage: "./assets/images/android-icon.png",
        backgroundColor: LightPallete.background[0],
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
      bundler: "metro",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash.png",
          imageWidth: 200,
          backgroundColor: LightPallete.background[0],
          dark: { backgroundColor: DarkPallete.background[0] },
        },
      ],
      "expo-font",
      "expo-asset",
      "expo-image",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
