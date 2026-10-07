import { Image } from "@/components/common/Image";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function App() {
  const { top } = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-center bg-background-0"
      style={{ paddingBottom: top }}
    >
      <Image
        source={require("@/assets/images/splash.png")}
        style={{
          width: 200,
          height: 200,
        }}
      />
    </View>
  );
}
