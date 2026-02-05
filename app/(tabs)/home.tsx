import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSession } from "@/lib/session";

export default function HomeScreen() {
  const { user, guest } = useSession();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.title}>PitchCount</Text>
          <Text style={styles.sub}>
            {guest ? "Quick practice mode is active." : "Earn it in practice. Win it in games."}
          </Text>

          <View style={styles.actionRow}>
            <Pressable style={[styles.button, styles.primary]} onPress={() => router.push("/(tabs)/live")}>
              <Text style={[styles.buttonText, styles.primaryText]}>Start Practice</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Game Flow</Text>
          <Text style={styles.sectionBody}>
            1. Start Practice to track bullpen sessions.{"\n"}
            2. Add teams and players in Coaches.{"\n"}
            3. Add a game to the schedule.{"\n"}
            4. Tap Play Ball to track a live game.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Session</Text>
          <Text style={styles.sectionBody}>
            {user ? `Signed in as ${user.email ?? "your account"}.` : "Guest mode (stats won’t be saved)."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 24,
    paddingBottom: 40,
    gap: 16,
  },
  heroCard: {
    backgroundColor: "rgba(10, 14, 24, 0.7)",
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  title: { fontSize: 36, fontWeight: "800", marginBottom: 8, color: "#ffffff" },
  sub: { fontSize: 16, opacity: 0.85, marginBottom: 18, color: "#E2E8F0" },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  button: {
    flexGrow: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  primary: { backgroundColor: "#B22234", borderColor: "#B22234" },
  primaryText: { color: "#fff" },
  secondary: { backgroundColor: "rgba(255, 255, 255, 0.92)", borderColor: "rgba(255, 255, 255, 0.9)" },
  secondaryText: { color: "#0f172a" },
  ghost: {
    marginTop: 12,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  ghostText: { color: "#E2E8F0" },
  buttonText: { fontSize: 16, fontWeight: "700" },
  card: {
    backgroundColor: "rgba(10, 14, 24, 0.55)",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#F8FAFC", marginBottom: 8 },
  sectionBody: { fontSize: 14, color: "#CBD5F5", lineHeight: 20 },
});
