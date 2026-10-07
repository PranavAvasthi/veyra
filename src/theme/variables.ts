import { vars } from "nativewind";

import { DarkPallete, LightPallete } from "@/theme/color";
import { createColorVariables } from "@/utils/color-variables";

export const THEME_VARIABLES = {
  light: vars(createColorVariables(LightPallete)),
  dark: vars(createColorVariables(DarkPallete)),
};
