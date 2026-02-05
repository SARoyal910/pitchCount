import { addDoc, collection, deleteDoc, doc, increment, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { db } from '../../lib/firebase';
import { formatEra, formatInnings } from '@/lib/pitching';
import { useSession } from '@/lib/session';

type CounterState = {
  balls: number;
  strikes: number;
  outs: number;
  walks: number;
  pitches: number;
  hits: number;
  runs: number;
};

type Player = {
  id: string;
  name: string;
};

type Team = {
  id: string;
  name: string;
};

const initialState: CounterState = {
  balls: 0,
  strikes: 0,
  outs: 0,
  walks: 0,
  pitches: 0,
  hits: 0,
  runs: 0,
};

export default function HomeScreen() {
  const { user } = useSession();
  const uid = user?.uid;
  const router = useRouter();
  const { teamId, gameId, opponent } = useLocalSearchParams<{
    teamId?: string;
    gameId?: string;
    opponent?: string;
  }>();
  const isGameMode = typeof teamId === 'string' && typeof gameId === 'string';
  const label = user?.email ?? 'Quick Game';
  const [state, setState] = useState<CounterState>(initialState);
  const stateRef = useRef<CounterState>(initialState);
  const historyRef = useRef<CounterState[]>([]);
  const [pitcherState, setPitcherState] = useState<CounterState>(initialState);
  const pitcherStateRef = useRef<CounterState>(initialState);
  const pitcherHistoryRef = useRef<CounterState[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [pitcherIdState, setPitcherIdState] = useState<string | null>(null);
  const [pitcherNameState, setPitcherNameState] = useState<string | null>(null);
  const [showPitcherPicker, setShowPitcherPicker] = useState(false);
  const [newPitcherName, setNewPitcherName] = useState('');
  const [teamRunsInput, setTeamRunsInput] = useState('');
  const [opponentRunsInput, setOpponentRunsInput] = useState('');
  const [showEndGame, setShowEndGame] = useState(false);
  const effectiveTeamId = typeof teamId === 'string' ? teamId : selectedTeamId;
  const practiceScope = effectiveTeamId ?? 'global';
  const counterDocRef = useMemo(
    () => {
      if (!uid) return null;
      if (isGameMode) {
        return doc(db, 'users', uid, 'teams', teamId, 'schedule', gameId, 'counter', 'current');
      }
      return doc(db, 'users', uid, 'practice', practiceScope, 'counter', 'current');
    },
    [uid, isGameMode, teamId, gameId, practiceScope]
  );
  const gameDocRef = useMemo(
    () => {
      if (!uid) return null;
      if (typeof teamId === 'string' && typeof gameId === 'string') {
        return doc(db, 'users', uid, 'teams', teamId, 'schedule', gameId);
      }
      return null;
    },
    [uid, teamId, gameId]
  );
  const teamsCollection = useMemo(
    () => (uid ? collection(db, 'users', uid, 'teams') : null),
    [uid]
  );
  const playersCollection = useMemo(
    () => {
      if (!uid) return null;
      if (typeof effectiveTeamId === 'string') {
        return collection(db, 'users', uid, 'teams', effectiveTeamId, 'players');
      }
      return null;
    },
    [uid, effectiveTeamId]
  );
  const pitcherCounterDocRef = useMemo(() => {
    if (!uid || typeof pitcherIdState !== 'string') return null;
    if (isGameMode) {
      return doc(
        db,
        'users',
        uid,
        'teams',
        teamId,
        'schedule',
        gameId,
        'pitchers',
        pitcherIdState,
        'counter',
        'current'
      );
    }
    return doc(
      db,
      'users',
      uid,
      'practice',
      practiceScope,
      'pitchers',
      pitcherIdState,
      'counter',
      'current'
    );
  }, [uid, isGameMode, teamId, gameId, practiceScope, pitcherIdState]);

  const modeLabel =
    isGameMode
      ? `Game vs ${typeof opponent === 'string' && opponent ? opponent : 'Opponent'}`
      : uid
        ? `Practice (${label})`
        : 'Quick Game';

  const pitcherLabel =
    (typeof teamId === 'string' && typeof gameId === 'string') || effectiveTeamId
      ? `Now Pitching: ${pitcherNameState ?? 'Select pitcher'}`
      : '';
  const displayState =
    typeof teamId === 'string' && typeof gameId === 'string' && pitcherIdState
      ? pitcherState
      : state;

  useEffect(() => {
    if (!teamsCollection) {
      setTeams([]);
      setSelectedTeamId(null);
      return;
    }

    const teamQuery = query(teamsCollection, orderBy('name'));
    const unsubscribe = onSnapshot(teamQuery, (snapshot) => {
      const next = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Team, 'id'>),
      }));
      setTeams(next);
      if (!selectedTeamId && next.length > 0) {
        setSelectedTeamId(next[0].id);
      } else if (selectedTeamId && !next.find((team) => team.id === selectedTeamId)) {
        setSelectedTeamId(next[0]?.id ?? null);
      }
    });

    return unsubscribe;
  }, [teamsCollection, selectedTeamId]);

  useEffect(() => {
    if (!playersCollection) {
      setPlayers([]);
      return;
    }

    const playerQuery = query(playersCollection, orderBy('name'));
    const unsubscribe = onSnapshot(playerQuery, (snapshot) => {
      const next = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Omit<Player, 'id'>;
        return { id: docSnap.id, ...data };
      });
      setPlayers(next);
    });

    return unsubscribe;
  }, [playersCollection]);

  useEffect(() => {
    if (!gameDocRef) {
      setPitcherIdState(null);
      setPitcherNameState(null);
      return;
    }

    const unsubscribe = onSnapshot(gameDocRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.data() as { pitcherId?: string; pitcherName?: string };
      if (data.pitcherId !== undefined) {
        setPitcherIdState(data.pitcherId ?? null);
      }
      if (data.pitcherName !== undefined) {
        setPitcherNameState(data.pitcherName ?? null);
      }
    });

    return unsubscribe;
  }, [gameDocRef]);

  useEffect(() => {
    pitcherHistoryRef.current = [];
    if (!pitcherCounterDocRef) {
      pitcherStateRef.current = initialState;
      setPitcherState(initialState);
      return;
    }

    const unsubscribe = onSnapshot(pitcherCounterDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Partial<CounterState>;
        const next = { ...initialState, ...data };
        pitcherStateRef.current = next;
        setPitcherState(next);
        return;
      }

      void setDoc(pitcherCounterDocRef, initialState, { merge: true });
      pitcherStateRef.current = initialState;
      setPitcherState(initialState);
    });

    return unsubscribe;
  }, [pitcherCounterDocRef]);

  useEffect(() => {
    historyRef.current = [];
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

  const commitGameState = (next: CounterState, recordHistory = true) => {
    const previous = stateRef.current;
    if (recordHistory) {
      historyRef.current.push(previous);
    }
    stateRef.current = next;
    setState(next);
    if (counterDocRef) {
      void setDoc(counterDocRef, next, { merge: true }).catch((err) => {
        console.warn("counter write failed", counterDocRef.path, err?.code ?? err);
      });
    }
  };

  const commitPitcherState = (next: CounterState, recordHistory = true, updateSeason = true) => {
    const previous = pitcherStateRef.current;
    if (recordHistory) {
      pitcherHistoryRef.current.push(previous);
    }
    pitcherStateRef.current = next;
    setPitcherState(next);
    if (pitcherCounterDocRef) {
      void setDoc(pitcherCounterDocRef, next, { merge: true }).catch((err) => {
        console.warn("pitcher counter write failed", pitcherCounterDocRef.path, err?.code ?? err);
      });
    }
    if (isGameMode && uid && typeof effectiveTeamId === 'string' && typeof pitcherIdState === 'string') {
      const innings = Number((next.outs / 3).toFixed(2));
      const deltaPitches = next.pitches - previous.pitches;
      const deltaOuts = next.outs - previous.outs;
      const deltaInnings = Number((deltaOuts / 3).toFixed(2));
      const deltaHits = next.hits - previous.hits;
      const deltaRuns = next.runs - previous.runs;
      const playerRef = doc(db, 'users', uid, 'teams', effectiveTeamId, 'players', pitcherIdState);
      void updateDoc(playerRef, {
        gamePitches: next.pitches,
        gameInnings: innings,
        gameHits: next.hits,
        gameRuns: next.runs,
        ...(updateSeason
          ? {
              seasonPitches: increment(deltaPitches),
              seasonInnings: increment(deltaInnings),
              seasonHits: increment(deltaHits),
              seasonRuns: increment(deltaRuns),
            }
          : {}),
      }).catch((err) => {
        console.warn("player stats update failed", playerRef.path, err?.code ?? err);
      });
    }
  };

  const nextBallState = (current: CounterState) => {
    const { balls, strikes, outs, walks, pitches, hits, runs } = current;
    return {
      balls: balls < 3 ? balls + 1 : 0,
      strikes: balls < 3 ? strikes : 0,
      outs,
      walks: balls < 3 ? walks : walks + 1,
      pitches: pitches + 1,
      hits,
      runs,
    };
  };

  const nextStrikeState = (current: CounterState) => {
    const { balls, strikes, outs, walks, pitches, hits, runs } = current;
    return {
      balls: strikes < 2 ? balls : 0,
      strikes: strikes < 2 ? strikes + 1 : 0,
      outs: strikes < 2 ? outs : outs + 1,
      walks,
      pitches: pitches + 1,
      hits,
      runs,
    };
  };

  const nextHitState = (current: CounterState) => ({
    ...current,
    hits: current.hits + 1,
  });

  const nextRunState = (current: CounterState) => ({
    ...current,
    runs: current.runs + 1,
  });

  const addBall = () => {
    const gameNext = nextBallState(stateRef.current);
    commitGameState(gameNext);
    if (pitcherIdState) {
      const pitcherNext = nextBallState(pitcherStateRef.current);
      commitPitcherState(pitcherNext);
    }
  };

  const addStrike = () => {
    const gameNext = nextStrikeState(stateRef.current);
    commitGameState(gameNext);
    if (pitcherIdState) {
      const pitcherNext = nextStrikeState(pitcherStateRef.current);
      commitPitcherState(pitcherNext);
    }
  };

  const addHit = () => {
    const gameNext = nextHitState(stateRef.current);
    commitGameState(gameNext);
    if (pitcherIdState) {
      const pitcherNext = nextHitState(pitcherStateRef.current);
      commitPitcherState(pitcherNext);
    }
  };

  const addRun = () => {
    const gameNext = nextRunState(stateRef.current);
    commitGameState(gameNext);
    if (pitcherIdState) {
      const pitcherNext = nextRunState(pitcherStateRef.current);
      commitPitcherState(pitcherNext);
    }
  };

  const resetAll = () => {
    commitGameState(initialState);
    if (pitcherIdState) {
      commitPitcherState(initialState, true, false);
    }
  };

  const resetLocalState = () => {
    historyRef.current = [];
    stateRef.current = initialState;
    setState(initialState);
    pitcherHistoryRef.current = [];
    pitcherStateRef.current = initialState;
    setPitcherState(initialState);
    setPitcherIdState(null);
    setPitcherNameState(null);
    setShowPitcherPicker(false);
  };

  const undoLast = () => {
    const previous = historyRef.current.pop();
    if (!previous) return;
    commitGameState(previous, false);
    if (pitcherIdState) {
      const previousPitcher = pitcherHistoryRef.current.pop();
      if (previousPitcher) {
        commitPitcherState(previousPitcher, false);
      }
    }
  };

  const handleSelectPitcher = async (player: Player) => {
    setPitcherIdState(player.id);
    setPitcherNameState(player.name);
    setShowPitcherPicker(false);
    if (gameDocRef) {
      await updateDoc(gameDocRef, {
        pitcherId: player.id,
        pitcherName: player.name,
      });
    }
  };

  const handleAddPitcher = async () => {
    if (!playersCollection || !newPitcherName.trim()) return;
    await addDoc(playersCollection, { name: newPitcherName.trim() });
    setNewPitcherName('');
  };

  const handleRemovePitcher = async (player: Player) => {
    if (!uid || !effectiveTeamId) return;
    await deleteDoc(doc(db, 'users', uid, 'teams', effectiveTeamId, 'players', player.id));
    if (pitcherIdState === player.id) {
      setPitcherIdState(null);
      setPitcherNameState(null);
    }
  };

  const handleOpenEndGame = () => {
    if (isGameMode && !opponentRunsInput) {
      setOpponentRunsInput(String(state.runs));
    }
    setShowEndGame((prev) => !prev);
  };

  const handleEndPractice = () => {
    setTeamRunsInput('');
    setOpponentRunsInput('');
    setShowEndGame(false);
    resetLocalState();
    router.replace('/(tabs)/home');
  };

  const handleSaveFinal = async () => {
    if (!gameDocRef) return;
    const runsFor = Number(teamRunsInput || 0);
    const runsAgainst = Number(opponentRunsInput || state.runs || 0);
    if (!Number.isFinite(runsFor) || !Number.isFinite(runsAgainst)) return;
    const result = runsFor > runsAgainst ? 'W' : runsFor < runsAgainst ? 'L' : '';
    await updateDoc(gameDocRef, {
      teamRuns: runsFor,
      opponentRuns: runsAgainst,
      result,
      status: 'final',
    });
    setTeamRunsInput('');
    setOpponentRunsInput('');
    setShowEndGame(false);
    resetLocalState();
    router.setParams({ teamId: undefined, gameId: undefined, opponent: undefined });
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Pitch Counter</Text>
            <Text style={styles.mode}>{modeLabel}</Text>
            {pitcherLabel ? <Text style={styles.pitcher}>{pitcherLabel}</Text> : null}
          </View>
          {effectiveTeamId ? (
            <Pressable
              style={styles.pitcherButton}
              onPress={() => setShowPitcherPicker((prev) => !prev)}
            >
              <Text style={styles.pitcherButtonText}>
                {pitcherNameState ? 'Change Pitcher' : 'Select Pitcher'}
              </Text>
            </Pressable>
          ) : null}
        </View>
        <Modal visible={showPitcherPicker && Boolean(effectiveTeamId)} transparent animationType="fade">
          <View style={styles.pitcherOverlay}>
            <View style={styles.pitcherCard}>
              <View style={styles.pitcherHeader}>
                <Text style={styles.pitcherTitle}>Select Pitcher</Text>
                <Pressable onPress={() => setShowPitcherPicker(false)}>
                  <Text style={styles.pitcherClose}>Close</Text>
                </Pressable>
              </View>
              <ScrollView contentContainerStyle={styles.pitcherBody} showsVerticalScrollIndicator={false}>
                {typeof teamId !== 'string' && teams.length > 0 ? (
                  <View style={styles.teamPicker}>
                    {teams.map((team) => (
                      <Pressable
                        key={team.id}
                        style={[styles.teamChip, selectedTeamId === team.id && styles.teamChipActive]}
                        onPress={() => setSelectedTeamId(team.id)}
                      >
                        <Text
                          style={[
                            styles.teamChipText,
                            selectedTeamId === team.id && styles.teamChipTextActive,
                          ]}
                        >
                          {team.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
                {players.length === 0 ? (
                  <Text style={styles.pitcherEmpty}>Add players to assign a pitcher.</Text>
                ) : (
                  <View style={styles.pitcherChips}>
                    {players.map((player) => (
                      <Pressable
                        key={player.id}
                        style={[
                          styles.pitcherChip,
                          pitcherIdState === player.id && styles.pitcherChipActive,
                        ]}
                        onPress={() => handleSelectPitcher(player)}
                      >
                        <Text
                          style={[
                            styles.pitcherChipText,
                            pitcherIdState === player.id && styles.pitcherChipTextActive,
                          ]}
                        >
                          {player.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
                <View style={styles.pitcherActions}>
                  <TextInput
                    value={newPitcherName}
                    onChangeText={setNewPitcherName}
                    placeholder="Add pitcher name"
                    placeholderTextColor="#6f7782"
                    style={styles.pitcherInput}
                  />
                  <Pressable style={styles.pitcherAdd} onPress={handleAddPitcher}>
                    <Text style={styles.pitcherAddText}>Add</Text>
                  </Pressable>
                </View>
                <View style={styles.pitcherRemoveRow}>
                  {players.map((player) => (
                    <Pressable key={player.id} onPress={() => handleRemovePitcher(player)}>
                      <Text style={styles.pitcherRemoveText}>Remove {player.name}</Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <View style={styles.counterRow}>
          <View style={styles.counterBox}>
            <Text style={styles.label}>Pitches</Text>
            <Text style={styles.count}>{displayState.pitches}</Text>
          </View>

          <View style={styles.counterBox}>
            <Text style={styles.label}>Balls</Text>
            <Text style={styles.count}>{displayState.balls}</Text>
          </View>

          <View style={styles.counterBox}>
            <Text style={styles.label}>Strikes</Text>
            <Text style={styles.count}>{displayState.strikes}</Text>
          </View>

          <View style={styles.counterBox}>
            <Text style={styles.label}>Outs</Text>
            <Text style={styles.count}>{displayState.outs}</Text>
          </View>

          <View style={styles.counterBox}>
            <Text style={styles.label}>Walks</Text>
            <Text style={styles.count}>{displayState.walks}</Text>
          </View>

          <View style={styles.counterBox}>
            <Text style={styles.label}>Hits</Text>
            <Text style={styles.count}>{displayState.hits}</Text>
          </View>

          <View style={styles.counterBox}>
            <Text style={styles.label}>Runs</Text>
            <Text style={styles.count}>{displayState.runs}</Text>
          </View>
        </View>

        <View style={styles.eraRow}>
          <Text style={styles.eraText}>
            Innings Pitched: {formatInnings(displayState.outs)}
          </Text>
          <Text style={styles.eraText}>
            ERA: {formatEra(displayState.runs, displayState.outs)}
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <View style={styles.buttonSlotLeft}>
            <Button title="Ball" onPress={addBall} color="#2E7D32" />
          </View>
          <View style={styles.buttonSlotCenter}>
            <Button title="Undo" onPress={undoLast} color="#1D4ED8" />
          </View>
          <View style={styles.buttonSlotRight}>
            <Button title="Strike" onPress={addStrike} color="#C62828" />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <View style={styles.buttonSlotLeft}>
            <Button title="Hit" onPress={addHit} color="#F59E0B" />
          </View>
          <View style={styles.buttonSlotRight}>
            <Button title="Run" onPress={addRun} color="#7C3AED" />
          </View>
        </View>

        {typeof teamId === 'string' && typeof gameId === 'string' ? (
          <View style={styles.endGameBlock}>
            <Pressable style={styles.endGameToggle} onPress={handleOpenEndGame}>
              <Text style={styles.endGameToggleText}>{showEndGame ? 'Cancel' : 'End Game'}</Text>
            </Pressable>
            <Modal visible={showEndGame} transparent animationType="fade">
              <View style={styles.endGameOverlay}>
                <View style={styles.endGameCard}>
                  <Text style={styles.endGameTitle}>End Game</Text>
                  <Text style={styles.endGameLabel}>Your Team Runs</Text>
                  <TextInput
                    value={teamRunsInput}
                    onChangeText={setTeamRunsInput}
                    placeholder="Enter your team runs"
                    placeholderTextColor="#6f7782"
                    keyboardType="number-pad"
                    style={styles.endGameInput}
                  />
                  <Text style={styles.endGameLabel}>Opponent Team Runs</Text>
                  <TextInput
                    value={opponentRunsInput}
                    onChangeText={setOpponentRunsInput}
                    placeholder="Enter opponent runs"
                    placeholderTextColor="#6f7782"
                    keyboardType="number-pad"
                    style={styles.endGameInput}
                  />
                  <View style={styles.endGameActions}>
                    <Pressable style={styles.endGameCancel} onPress={() => setShowEndGame(false)}>
                      <Text style={styles.endGameCancelText}>Cancel</Text>
                    </Pressable>
                    <Pressable style={styles.endGameSave} onPress={handleSaveFinal}>
                      <Text style={styles.endGameSaveText}>Save Final</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        ) : (
          <View style={styles.endGameBlock}>
            <Pressable style={styles.endGameToggle} onPress={handleOpenEndGame}>
              <Text style={styles.endGameToggleText}>{showEndGame ? 'Cancel' : 'End Practice'}</Text>
            </Pressable>
            <Modal visible={showEndGame} transparent animationType="fade">
              <View style={styles.endGameOverlay}>
                <View style={styles.endGameCard}>
                  <Text style={styles.endGameTitle}>End Practice</Text>
                  <Text style={styles.endGameNote}>Practice totals will stay in Stats.</Text>
                  <View style={styles.endGameActions}>
                    <Pressable style={styles.endGameCancel} onPress={() => setShowEndGame(false)}>
                      <Text style={styles.endGameCancelText}>Cancel</Text>
                    </Pressable>
                    <Pressable style={styles.endGameSave} onPress={handleEndPractice}>
                      <Text style={styles.endGameSaveText}>Save Session</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}

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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerText: { flex: 1 },
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
  pitcher: {
    fontSize: 13,
    color: '#A7F3D0',
    marginBottom: 10,
    fontWeight: '700',
  },
  pitcherButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  pitcherButtonText: { color: '#F8FAFC', fontWeight: '700', fontSize: 12 },
  pitcherOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pitcherCard: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '80%',
    backgroundColor: 'rgba(10, 14, 24, 0.95)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pitcherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pitcherTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '800' },
  pitcherClose: { color: '#93C5FD', fontWeight: '700' },
  pitcherBody: { paddingBottom: 12 },
  teamPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  teamChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  teamChipActive: { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
  teamChipText: { fontSize: 12, fontWeight: '700', color: '#E2E8F0' },
  teamChipTextActive: { color: '#0f172a' },
  pitcherEmpty: { color: '#94A3B8', fontSize: 13, fontStyle: 'italic' },
  pitcherChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pitcherChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  pitcherChipActive: { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
  pitcherChipText: { fontSize: 12, fontWeight: '700', color: '#E2E8F0' },
  pitcherChipTextActive: { color: '#0f172a' },
  pitcherActions: { marginTop: 10, gap: 8 },
  pitcherInput: {
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.25)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    color: "#0f172a",
  },
  pitcherAdd: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#16A34A',
  },
  pitcherAddText: { color: '#fff', fontWeight: '700' },
  pitcherRemoveRow: { marginTop: 8, gap: 6 },
  pitcherRemoveText: { color: '#FCA5A5', fontWeight: '700', fontSize: 12 },
  counterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 16,
  },
  counterBox: {
    alignItems: 'center',
    width: '30%',
    minWidth: 90,
  },
  label: {
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 6,
  },
  count: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginVertical: 20,
  },
  eraRow: {
    marginTop: 6,
    marginBottom: 14,
    gap: 6,
  },
  eraText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '700',
  },
  buttonSlotLeft: { flex: 1, alignItems: 'flex-start' },
  buttonSlotCenter: { flex: 1, alignItems: 'center' },
  buttonSlotRight: { flex: 1, alignItems: 'flex-end' },
  endGameBlock: { marginTop: 8, marginBottom: 10, gap: 10 },
  endGameToggle: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  endGameToggleText: { color: '#F8FAFC', fontWeight: '700' },
  endGameOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  endGameCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'rgba(10, 14, 24, 0.95)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  endGameTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '800', marginBottom: 10 },
  endGameLabel: { color: '#CBD5F5', fontSize: 13, fontWeight: '700', marginBottom: 6 },
  endGameNote: { color: '#CBD5F5', fontSize: 13, marginBottom: 16 },
  endGameInput: {
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.25)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    color: "#0f172a",
    marginBottom: 12,
  },
  endGameActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  endGameCancel: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  endGameCancelText: { color: '#F8FAFC', fontWeight: '700' },
  endGameSave: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#16A34A',
  },
  endGameSaveText: { color: '#fff', fontWeight: '800' },
});
