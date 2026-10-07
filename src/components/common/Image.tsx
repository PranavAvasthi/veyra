import { Image as ExpoImage, ImageProps } from "expo-image";

export const Image = (props: ImageProps) => {
  return <ExpoImage {...props} cachePolicy="disk" />;
};
