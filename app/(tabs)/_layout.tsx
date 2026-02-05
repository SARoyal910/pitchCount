import { Stack, Tabs, usePathname, useRouter } from "expo-router";
import { ActivityIndicator, Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { useSession } from "@/lib/session";

export default function TabsLayout() {
  const { user, loading, guest, signOutUser, setGuest } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isGuestOnly = !user && guest;
  const isWeb = Platform.OS === "web";
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

  if (isWeb) {
    const navItems = [
      { label: "Home", href: "/(tabs)/home", show: true },
      { label: "Live", href: "/(tabs)/live", show: true },
      { label: "Stats", href: "/(tabs)/stats", show: !isGuestOnly },
      { label: "Coaches", href: "/(tabs)/coaches", show: !isGuestOnly },
    ].filter((item) => item.show);

    return (
      <View style={styles.webShell}>
        <View style={styles.webNav}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Pressable
                key={item.href}
                style={[styles.webNavItem, active && styles.webNavItemActive]}
                onPress={() => router.replace(item.href)}
              >
                <Text style={[styles.webNavText, active && styles.webNavTextActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.webContent}>
          <Stack
            screenOptions={{
              headerTitleAlign: "center",
              contentStyle: { backgroundColor: "transparent" },
              headerShown: !isGuestOnly,
              headerRight: () =>
                user || guest ? (
                  <Pressable onPress={handleSignOut} style={styles.headerButton}>
                    <Text style={styles.headerButtonText}>{user ? "Sign Out" : "Exit"}</Text>
                  </Pressable>
                ) : null,
            }}
          >
            <Stack.Screen name="home" options={{ title: "Home" }} />
            <Stack.Screen name="live" options={{ title: "Live" }} />
            {!isGuestOnly && <Stack.Screen name="stats" options={{ title: "Stats" }} />}
            {!isGuestOnly && <Stack.Screen name="coaches" options={{ title: "Coaches" }} />}
          </Stack>
        </View>
      </View>
    );
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
  webShell: { flex: 1 },
  webContent: { flex: 1 },
  webNav: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(10, 14, 24, 0.6)",
  },
  webNavItem: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  webNavItemActive: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderColor: "rgba(255, 255, 255, 0.9)",
  },
  webNavText: { color: "#E2E8F0", fontWeight: "700" },
  webNavTextActive: { color: "#0f172a" },
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
