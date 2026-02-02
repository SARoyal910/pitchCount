import { StyleSheet, Text, View } from "react-native";

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Stats</Text>
        <Text style={styles.sub}>
          This is where season totals + averages will show once I pull from Firebase.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
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
  title: { fontSize: 28, fontWeight: "800", marginBottom: 8, color: "#ffffff" },
  sub: { fontSize: 16, opacity: 0.85, color: "#E2E8F0" },
});

