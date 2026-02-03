import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSession } from "@/lib/session";


export default function DashboardScreen() {
  const { signOutUser, user, guest, setGuest } = useSession();

  const handleSignOut = async () => {
    setGuest(false);
    router.replace("/index");
    await signOutUser();
  };

  const handleBackHome = () => {
    router.replace("/index");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRow}>
        {!guest && user && (
          <Pressable
            style={styles.signOut}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>PitchCount</Text>
        <Text style={styles.sub}>Quick start and recent games will go here.</Text>

        <Pressable style={[styles.button, styles.primary]} onPress={() => router.push("/(tabs)/live")}>
          <Text style={[styles.buttonText, styles.primaryText]}>Start Game</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondary]}
          onPress={handleBackHome}
        >
          <Text style={[styles.buttonText, styles.secondaryText]}>Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  topRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "rgba(10, 14, 24, 0.7)",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    maxWidth: 420,
    width: "100%",
    alignSelf: "center",
  },
  title: { fontSize: 36, fontWeight: "800", marginBottom: 8, color: "#ffffff" },
  sub: { fontSize: 16, opacity: 0.85, marginBottom: 18, color: "#E2E8F0" },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    marginTop: 12,
  },
  primary: { backgroundColor: "#B22234", borderColor: "#B22234" },
  primaryText: { color: "#fff" },
  secondary: { backgroundColor: "rgba(255, 255, 255, 0.92)", borderColor: "rgba(255, 255, 255, 0.9)" },
  secondaryText: { color: "#0f172a" },
  buttonText: { fontSize: 16, fontWeight: "700" },
  signOut: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
  },
  signOutText: { fontSize: 13, fontWeight: "700", color: "#F8FAFC" },
});
