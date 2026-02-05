import { router } from "expo-router";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { auth } from "@/lib/firebase";
import { useSession } from "@/lib/session";

export default function HomeScreen() {
  const { signOutUser, setGuest } = useSession();
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = colorScheme === 'dark' ? '#060912' : '#0b0f1d';
    }
  }, [colorScheme]);

  const getAuthErrorMessage = (err: unknown) => {
    if (!err || typeof err !== "object" || !("code" in err)) {
      return "Authentication failed. Try again.";
    }

    const code = String((err as { code: string }).code);

    switch (code) {
      case "auth/invalid-email":
        return "Enter a valid email address.";
      case "auth/user-not-found":
        return "No account found for that email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/email-already-in-use":
        return "That email is already in use.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/too-many-requests":
        return "Too many attempts. Try again later.";
      default:
        return "Authentication failed. Try again.";
    }
  };

  const handleAuth = async () => {
    const trimmedEmail = email.trim();
    const pw = password.trim();

    if (!trimmedEmail || !pw) {
      setError("Enter an email and password to save your games.");
      return;
    }

    setError("");
    setBusy(true);

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, trimmedEmail, pw);
      } else {
        await signInWithEmailAndPassword(auth, trimmedEmail, pw);
      }
      setGuest(false);
      router.replace("/(tabs)/home");
    } catch (err) {
      if (err && typeof err === "object" && "code" in err) {
        const code = String((err as { code: string }).code);
        setError(`${getAuthErrorMessage(err)} (${code})`);
      } else if (err instanceof Error && err.message) {
        setError(`Authentication failed: ${err.message}`);
      } else {
        setError(getAuthErrorMessage(err));
      }
    } finally {
      setBusy(false);
    }
  };

  const handleQuickGame = async () => {
    setError("");
    await signOutUser();
    setGuest(true);
    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>PitchCount</Text>
        <Text style={styles.sub}>Sign in to save your data, or jump right into a game.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            textContentType="username"
            autoComplete="email"
            placeholderTextColor="#6f7782"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            autoCapitalize="none"
            secureTextEntry
            style={styles.input}
            textContentType="password"
            autoComplete="password"
            placeholderTextColor="#6f7782"
          />

          {!!error && <Text style={styles.error}>{error}</Text>}
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[styles.button, styles.primary, busy && styles.disabled]}
            onPress={handleAuth}
            disabled={busy}
          >
            <Text style={[styles.buttonText, styles.primaryText]}>
              {busy ? "Working..." : isSignup ? "Create Account" : "Sign In"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.secondary, busy && styles.disabled]}
            onPress={handleQuickGame}
            disabled={busy}
          >
            <Text style={[styles.buttonText, styles.secondaryText]}>Quick Game</Text>
          </Pressable>

          <Pressable onPress={() => setIsSignup((prev) => !prev)}>
            <Text style={styles.link}>
              {isSignup ? "Already have an account? Sign in" : "New here? Create an account"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  card: {
    backgroundColor: "rgba(10, 14, 24, 0.72)",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    maxWidth: 420,
    alignSelf: "center",
    width: "100%",
  },
  title: { fontSize: 36, fontWeight: "800", marginBottom: 10, color: "#ffffff" },
  sub: { fontSize: 16, opacity: 0.85, marginBottom: 24, color: "#E2E8F0" },
  form: { gap: 12, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: "600", color: "#F8FAFC" },
  input: {
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.25)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    color: "#0f172a",
  },
  error: { color: "#FCA5A5", fontSize: 14 },
  actions: { gap: 12 },
  button: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: { fontSize: 16, fontWeight: "700" },
  primary: { backgroundColor: "#B22234", borderColor: "#B22234" },
  primaryText: { color: "#fff" },
  secondary: { backgroundColor: "rgba(255, 255, 255, 0.92)", borderColor: "rgba(255, 255, 255, 0.9)" },
  secondaryText: { color: "#0f172a" },
  link: { textAlign: "center", fontSize: 14, color: "#93C5FD" },
  disabled: { opacity: 0.6 },
});
