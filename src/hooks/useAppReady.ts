import { APP_ASSETS } from "@/constants/assets";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { colorScheme } from "nativewind";
import { useCallback, useEffect } from "react";

export function useAppReady() {
  const [loaded, error] = useFonts(APP_ASSETS.fonts);
  const isReady = loaded;

  useEffect(() => {
    colorScheme.set("system");
  }, []);

  useEffect(() => {
    if (error) {
      SplashScreen.hide();
      throw error;
    }
  }, [error]);

  const onLayout = useCallback(() => {
    if (isReady) {
      SplashScreen.hide();
    }
  }, [isReady]);

  return { isReady, onLayout };
}
