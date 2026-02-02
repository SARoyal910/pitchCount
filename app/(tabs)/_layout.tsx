import { Tabs, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

import { useSession } from "@/lib/session";

export default function TabsLayout() {
  const { user, loading, guest } = useSession();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!loading && !user && !guest && segments[0] === "(tabs)") {
      router.replace("/");
    }
  }, [guest, loading, router, segments, user]);

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
    <Tabs screenOptions={{ headerTitleAlign: "center", sceneStyle: { backgroundColor: "transparent" } }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/icons/dashboard.png")}
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
              source={require("../../assets/icons/stats.png")}
              style={{ width: 24, height: 24, opacity: focused ? 1 : 0.5 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
});
