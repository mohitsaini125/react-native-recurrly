import "@/global.css";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="mb-8 text-2xl font-sans-bold text-primary">Settings</Text>

      <Pressable
        className="items-center rounded-2xl border border-destructive/30 bg-destructive/10 py-4"
        onPress={handleSignOut}
      >
        <Text className="text-base font-sans-bold text-destructive">Sign out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;