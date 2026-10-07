import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { ThemeProvider } from "@/components/wrappers/ThemeProvider";
import "@/global.css";
import { useAppReady } from "@/hooks/useAppReady";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isReady, onLayout } = useAppReady();

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider onLayout={onLayout}>
      <Slot />
    </ThemeProvider>
  );
}
