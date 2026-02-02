import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { db } from '../../lib/firebase';
import { useSession } from '@/lib/session';

type CounterState = {
  balls: number;
  strikes: number;
  outs: number;
  walks: number;
  pitches: number;
};

const initialState: CounterState = {
  balls: 0,
  strikes: 0,
  outs: 0,
  walks: 0,
  pitches: 0,
};

export default function HomeScreen() {
  const { user } = useSession();
  const uid = user?.uid;
  const label = user?.email ?? 'Quick Game';
  const [state, setState] = useState<CounterState>(initialState);
  const stateRef = useRef<CounterState>(initialState);
  const counterDocRef = useMemo(
    () => (uid ? doc(db, 'users', uid, 'games', 'current') : null),
    [uid]
  );

  useEffect(() => {
    if (!counterDocRef) {
      stateRef.current = initialState;
      setState(initialState);
      return;
    }

    const unsubscribe = onSnapshot(counterDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Partial<CounterState>;
        const next = { ...initialState, ...data };
        stateRef.current = next;
        setState(next);
        return;
      }

      void setDoc(counterDocRef, initialState, { merge: true });
      stateRef.current = initialState;
      setState(initialState);
    });

    return unsubscribe;
  }, [counterDocRef]);

  const applyState = (next: CounterState) => {
    stateRef.current = next;
    setState(next);
    if (counterDocRef) {
      void setDoc(counterDocRef, next, { merge: true });
    }
  };

  const addBall = () => {
    const { balls, strikes, outs, walks, pitches } = stateRef.current;
    const next: CounterState = {
      balls: balls < 3 ? balls + 1 : 0,
      strikes: balls < 3 ? strikes : 0,
      outs,
      walks: balls < 3 ? walks : walks + 1,
      pitches: pitches + 1,
    };
    applyState(next);
  };

  const addStrike = () => {
    const { balls, strikes, outs, walks, pitches } = stateRef.current;
    const next: CounterState = {
      balls: strikes < 2 ? balls : 0,
      strikes: strikes < 2 ? strikes + 1 : 0,
      outs: strikes < 2 ? outs : outs + 1,
      walks,
      pitches: pitches + 1,
    };
    applyState(next);
  };

  const resetAll = () => {
    applyState(initialState);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Pitch Counter</Text>
        <Text style={styles.mode}>{uid ? `Saving as ${label}` : 'Quick Game'}</Text>

        <View style={styles.counterRow}>
          <View style={styles.counterBox}>
            <Text style={styles.label}>Pitches</Text>
            <Text style={styles.count}>{state.pitches}</Text>
          </View>

          <View style={styles.counterBox}>
            <Text style={styles.label}>Balls</Text>
            <Text style={styles.count}>{state.balls}</Text>
          </View>

          <View style={styles.counterBox}>
            <Text style={styles.label}>Strikes</Text>
            <Text style={styles.count}>{state.strikes}</Text>
          </View>

          <View style={styles.counterBox}>
            <Text style={styles.label}>Outs</Text>
            <Text style={styles.count}>{state.outs}</Text>
          </View>

          <View style={styles.counterBox}>
            <Text style={styles.label}>Walks</Text>
            <Text style={styles.count}>{state.walks}</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Button title="Ball" onPress={addBall} color="#2E7D32" />
          <Button title="Strike" onPress={addStrike} color="#C62828" />
        </View>

        <Button title="Reset Game" onPress={resetAll} color="#475569" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(10, 14, 24, 0.7)",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    width: "100%",
    maxWidth: 420,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#ffffff',
  },
  mode: {
    fontSize: 14,
    color: '#E2E8F0',
    marginBottom: 18,
  },
  counterRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  counterBox: {
    alignItems: 'center',
    minWidth: 90,
  },
  label: {
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 6,
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
    marginVertical: 20,
  },
});
