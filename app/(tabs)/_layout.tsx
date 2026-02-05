import { Tabs, useRouter } from "expo-router";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { useSession } from "@/lib/session";

export default function TabsLayout() {
  const { user, loading, guest, signOutUser, setGuest } = useSession();
  const router = useRouter();
  const isGuestOnly = !user && guest;
  const hiddenTabOptions = isGuestOnly ? { tabBarButton: () => null } : {};

  const handleSignOut = async () => {
    setGuest(false);
    await signOutUser();
    router.replace("/");
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user && !guest) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        sceneStyle: { backgroundColor: "transparent" },
        tabBarStyle: isGuestOnly ? { display: "none" } : undefined,
        headerRight: () =>
          user || guest ? (
            <Pressable onPress={handleSignOut} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>{user ? "Sign Out" : "Exit"}</Text>
            </Pressable>
          ) : null,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/icons/AdobeStock_227314847.jpeg")}
              style={{ width: 24, height: 24, opacity: focused ? 1 : 0.5 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="live"
        options={{
          title: "Live",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/icons/AdobeStock_125776404.jpeg")}
              style={{ width: 36, height: 36, opacity: focused ? 1 : 0.5 }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/icons/ChatGPT Image Feb 5, 2026, 03_02_05 AM.png")}
              style={{ width: 24, height: 24, opacity: focused ? 1 : 0.5 }}
            />
          ),
          ...hiddenTabOptions,
        }}
      />

      <Tabs.Screen
        name="coaches"
        options={{
          title: "Coaches",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/icons/AdobeStock_468903121.jpeg")}
              style={{ width: 24, height: 24, opacity: focused ? 1 : 0.5 }}
            />
          ),
          ...hiddenTabOptions,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.2)",
    marginRight: 12,
  },
  headerButtonText: { fontSize: 12, fontWeight: "700", color: "#0f172a" },
});
