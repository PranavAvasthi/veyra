import { THEME_VARIABLES } from "@/theme/variables";
import { useColorScheme } from "nativewind";
import type { ReactNode } from "react";
import type { ViewProps } from "react-native";
import { StatusBar, View } from "react-native";

type ThemeProviderProps = {
  children: ReactNode;
  onLayout?: ViewProps["onLayout"];
};

export function ThemeProvider({ children, onLayout }: ThemeProviderProps) {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "light" ? "light" : "dark";

  return (
    <View
      className="flex-1 bg-background-0"
      style={THEME_VARIABLES[theme]}
      onLayout={onLayout}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />
      {children}
    </View>
  );
}
