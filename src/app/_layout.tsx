import { Slot } from "expo-router";
import { View, StatusBar } from "react-native";

import "@/styles/global.css";

import {
  useFonts,
  Inter_500Medium,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import Loading from "@/components/loading";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return <Loading />;
  }
  return (
    <View className="bg-zinc-950 flex-1 justify-center">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Slot />
    </View>
  );
}
