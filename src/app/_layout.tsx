import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { useEffect } from "react";
import "../global.css";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    manropeExtraLight: require("../../assets/fonts/manrope-200.ttf"),
    manropeLight: require("../../assets/fonts/manrope-300.ttf"),
    manropeNormal: require("../../assets/fonts/manrope-400.ttf"),
    manropeMedium: require("../../assets/fonts/manrope-500.ttf"),
    manropeSemiBold: require("../../assets/fonts/manrope-600.ttf"),
    manropeBold: require("../../assets/fonts/manrope-700.ttf"),
    manropeExtraBold: require("../../assets/fonts/manrope-800.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const RootLayoutNav = () => {
  return <Slot />;
};
