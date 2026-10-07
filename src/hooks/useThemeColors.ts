import { useColorScheme } from "nativewind";

import { DarkPallete, LightPallete } from "@/theme/color";

export function useThemeColors() {
  const { colorScheme } = useColorScheme();

  return colorScheme === "light" ? LightPallete : DarkPallete;
}
