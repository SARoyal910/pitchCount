import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { db } from "@/lib/firebase";
import { useSession } from "@/lib/session";

type Player = {
  id: string;
  name: string;
  number?: string;
  pitchHand?: "R" | "L" | "S";
  seasonPitches?: number;
  seasonInnings?: number;
  seasonHits?: number;
  seasonRuns?: number;
  gamePitches?: number;
  gameInnings?: number;
  gameHits?: number;
  gameRuns?: number;
};

type Team = {
  id: string;
  name: string;
};

type CounterState = {
  balls: number;
  strikes: number;
  outs: number;
  walks: number;
  pitches: number;
  hits: number;
  runs: number;
};

export default function StatsScreen() {
  const { user } = useSession();
  const uid = user?.uid ?? null;
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [playersByTeam, setPlayersByTeam] = useState<Record<string, Player[]>>({});
  const [recordsByTeam, setRecordsByTeam] = useState<Record<string, { wins: number; losses: number }>>({});
  const [practiceGlobal, setPracticeGlobal] = useState<CounterState | null>(null);
  const [practiceByTeam, setPracticeByTeam] = useState<Record<string, CounterState | null>>({});
  const [showPracticeDetails, setShowPracticeDetails] = useState(false);
  const [practicePitchers, setPracticePitchers] = useState<Record<string, CounterState | null>>({});

  const teamsCollection = useMemo(() => (uid ? collection(db, "users", uid, "teams") : null), [uid]);

  useEffect(() => {
    if (!teamsCollection) {
      setTeams([]);
      return;
    }

    const teamQuery = query(teamsCollection, orderBy("name"));
    const unsubscribe = onSnapshot(teamQuery, (snapshot) => {
      const next = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Team, "id">),
      }));
      setTeams(next);
      if (!selectedTeamId && next.length > 0) {
        setSelectedTeamId(next[0].id);
      } else if (selectedTeamId && !next.find((team) => team.id === selectedTeamId)) {
        setSelectedTeamId(next[0]?.id ?? null);
      }
    });

    return unsubscribe;
  }, [teamsCollection]);

  useEffect(() => {
    if (!uid) {
      setPracticeGlobal(null);
      return;
    }
    const globalPractice = doc(db, "users", uid, "practice", "global", "counter", "current");
    const unsubscribe = onSnapshot(globalPractice, (snapshot) => {
      if (snapshot.exists()) {
        setPracticeGlobal(snapshot.data() as CounterState);
      } else {
        setPracticeGlobal(null);
      }
    });
    return unsubscribe;
  }, [uid]);

  useEffect(() => {
    if (!uid || teams.length === 0) {
      setPlayersByTeam({});
      setRecordsByTeam({});
      setPracticeByTeam({});
      return;
    }

    const unsubs: Array<() => void> = [];

    teams.forEach((team) => {
      const playersCol = collection(db, "users", uid, "teams", team.id, "players");
      unsubs.push(
        onSnapshot(playersCol, (snapshot) => {
          const next = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Player, "id">),
          }));
          setPlayersByTeam((prev) => ({ ...prev, [team.id]: next }));
        })
      );

      const gamesCol = collection(db, "users", uid, "teams", team.id, "schedule");
      unsubs.push(
        onSnapshot(gamesCol, (snapshot) => {
          let wins = 0;
          let losses = 0;
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as { result?: string };
            if (data.result === "W") wins += 1;
            if (data.result === "L") losses += 1;
          });
          setRecordsByTeam((prev) => ({ ...prev, [team.id]: { wins, losses } }));
        })
      );

      const practiceDoc = doc(db, "users", uid, "practice", team.id, "counter", "current");
      unsubs.push(
        onSnapshot(practiceDoc, (snapshot) => {
          setPracticeByTeam((prev) => ({
            ...prev,
            [team.id]: snapshot.exists() ? (snapshot.data() as CounterState) : null,
          }));
        })
      );
    });

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [uid, teams]);

  useEffect(() => {
    if (!uid || !selectedTeamId) {
      setPracticePitchers({});
      return;
    }
    const players = playersByTeam[selectedTeamId] ?? [];
    const unsubs = players.map((player) =>
      onSnapshot(
        doc(db, "users", uid, "practice", selectedTeamId, "pitchers", player.id, "counter", "current"),
        (snapshot) => {
          setPracticePitchers((prev) => ({
            ...prev,
            [player.id]: snapshot.exists() ? (snapshot.data() as CounterState) : null,
          }));
        }
      )
    );
    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [uid, selectedTeamId, playersByTeam]);

  const selectedTeam = teams.find((team) => team.id === selectedTeamId) ?? null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!uid && (
        <View style={styles.card}>
          <Text style={styles.title}>Stats</Text>
          <Text style={styles.sub}>Sign in to see team and practice stats.</Text>
        </View>
      )}

      {uid && (
        <>
          <View style={styles.card}>
            <Text style={styles.title}>Teams</Text>
            <Text style={styles.sub}>Tap a team to view stats.</Text>
            {teams.length === 0 ? (
              <Text style={styles.sub}>No teams yet.</Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.teamPicker}
              >
                {teams.map((team) => {
                  const record = recordsByTeam[team.id] ?? { wins: 0, losses: 0 };
                  return (
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
                      <Text
                        style={[
                          styles.teamRecord,
                          selectedTeamId === team.id && styles.teamRecordActive,
                        ]}
                      >
                        Record {record.wins}-{record.losses}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>

          <View style={styles.card}>
            <Pressable style={styles.sectionHeader} onPress={() => setShowPracticeDetails((prev) => !prev)}>
              <Text style={styles.title}>Practice Totals</Text>
              <Text style={styles.toggleText}>{showPracticeDetails ? "Hide" : "Details"}</Text>
            </Pressable>
            <Text style={styles.sub}>Tap Details to see practice stats by player.</Text>
            {showPracticeDetails && selectedTeam && (
              <View style={styles.practiceDetails}>
                <Text style={styles.meta}>Team Practice ({selectedTeam.name})</Text>
                {(playersByTeam[selectedTeam.id] ?? []).length === 0 ? (
                  <Text style={styles.sub}>No players yet.</Text>
                ) : (
                  (playersByTeam[selectedTeam.id] ?? []).map((player) => {
                    const practice = practicePitchers[player.id];
                    return (
                      <View key={player.id} style={styles.playerRow}>
                        <Text style={styles.playerName}>
                          {player.name}
                          {player.number ? ` #${player.number}` : ""}
                          {player.pitchHand ? ` • ${player.pitchHand}` : ""}
                        </Text>
                        <Text style={styles.meta}>
                          Practice: {practice?.pitches ?? 0} pitches • {practice?.outs ?? 0} outs • {practice?.hits ?? 0} H • {practice?.runs ?? 0} R
                        </Text>
                      </View>
                    );
                  })
                )}
              </View>
            )}
          </View>

          {selectedTeam ? (
            <View style={styles.card}>
              <Text style={styles.title}>{selectedTeam.name}</Text>
              <Text style={styles.meta}>
                Record: {(recordsByTeam[selectedTeam.id]?.wins ?? 0)}-{(recordsByTeam[selectedTeam.id]?.losses ?? 0)}
              </Text>
              {practiceByTeam[selectedTeam.id] && (
                <Text style={styles.meta}>
                  Practice: {practiceByTeam[selectedTeam.id]?.pitches ?? 0} pitches • {practiceByTeam[selectedTeam.id]?.outs ?? 0} outs • {practiceByTeam[selectedTeam.id]?.runs ?? 0} runs
                </Text>
              )}

              {(playersByTeam[selectedTeam.id] ?? []).length === 0 ? (
                <Text style={styles.sub}>No players yet.</Text>
              ) : (
                (playersByTeam[selectedTeam.id] ?? []).map((player) => (
                  <View key={player.id} style={styles.playerRow}>
                    <Text style={styles.playerName}>
                      {player.name}
                      {player.number ? ` #${player.number}` : ""}
                      {player.pitchHand ? ` • ${player.pitchHand}` : ""}
                    </Text>
                    <Text style={styles.meta}>
                      Season: {player.seasonPitches ?? 0} pitches • {player.seasonInnings ?? 0} IP • {player.seasonHits ?? 0} H • {player.seasonRuns ?? 0} R
                    </Text>
                    <Text style={styles.meta}>
                      Game: {player.gamePitches ?? 0} pitches • {player.gameInnings ?? 0} IP • {player.gameHits ?? 0} H • {player.gameRuns ?? 0} R
                    </Text>
                  </View>
                ))
              )}
            </View>
          ) : null}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16 },
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
  title: { fontSize: 22, fontWeight: "800", marginBottom: 8, color: "#ffffff" },
  sub: { fontSize: 14, opacity: 0.85, color: "#E2E8F0" },
  meta: { fontSize: 13, color: "#CBD5F5", marginBottom: 6 },
  playerRow: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "rgba(255, 255, 255, 0.12)" },
  playerName: { color: "#F8FAFC", fontWeight: "700", fontSize: 15, marginBottom: 4 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  toggleText: { color: "#93C5FD", fontWeight: "700", fontSize: 12 },
  teamPicker: { gap: 10, paddingVertical: 4 },
  teamChip: {
    minWidth: 140,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },
  teamChipActive: { backgroundColor: "rgba(255, 255, 255, 0.92)", borderColor: "rgba(255, 255, 255, 0.9)" },
  teamChipText: { fontSize: 14, fontWeight: "700", color: "#E2E8F0", marginBottom: 4 },
  teamChipTextActive: { color: "#0f172a" },
  teamRecord: { fontSize: 12, color: "#94A3B8", fontWeight: "600" },
  teamRecordActive: { color: "#1E293B" },
  practiceDetails: { marginTop: 10 },
});
