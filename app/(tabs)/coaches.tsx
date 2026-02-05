import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

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

type Game = {
  id: string;
  opponent: string;
  date: string;
  time?: string;
  location?: string;
  opponentRecord?: string;
  result?: "W" | "L" | "";
  teamRuns?: number;
  opponentRuns?: number;
};

type Team = {
  id: string;
  name: string;
};

const toNumber = (value: string) => {
  const next = Number(value);
  return Number.isFinite(next) ? next : 0;
};

export default function CoachesScreen() {
  const { user } = useSession();
  const uid = user?.uid ?? null;
  const isAuthed = Boolean(uid);
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState<"players" | "games">("players");
  const [viewMode, setViewMode] = useState<"teams" | "details">("teams");
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamName, setTeamName] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  const teamsCollection = useMemo(
    () => (uid ? collection(db, "users", uid, "teams") : null),
    [uid]
  );
  const playersCollection = useMemo(
    () => (uid && selectedTeamId ? collection(db, "users", uid, "teams", selectedTeamId, "players") : null),
    [uid, selectedTeamId]
  );
  const gamesCollection = useMemo(
    () => (uid && selectedTeamId ? collection(db, "users", uid, "teams", selectedTeamId, "schedule") : null),
    [uid, selectedTeamId]
  );

  useEffect(() => {
    if (!teamsCollection) {
      setTeams([]);
      setSelectedTeamId(null);
      setViewMode("teams");
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
      if (selectedTeamId && !next.find((team) => team.id === selectedTeamId)) {
        setViewMode("teams");
      }
    });

    return unsubscribe;
  }, [teamsCollection, selectedTeamId]);

  useEffect(() => {
    if (!playersCollection) {
      setPlayers([]);
      return;
    }

    const playerQuery = query(playersCollection, orderBy("name"));
    const unsubscribe = onSnapshot(playerQuery, (snapshot) => {
      const next = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Omit<Player, "id">;
        return { id: docSnap.id, ...data };
      });
      setPlayers(next);
    });

    return unsubscribe;
  }, [playersCollection]);

  useEffect(() => {
    if (!gamesCollection) {
      setGames([]);
      return;
    }

    const gameQuery = query(gamesCollection, orderBy("date"));
    const unsubscribe = onSnapshot(gameQuery, (snapshot) => {
      const next = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Omit<Game, "id">;
        return { id: docSnap.id, ...data };
      });
      setGames(next);
    });

    return unsubscribe;
  }, [gamesCollection]);

  const [playerName, setPlayerName] = useState("");
  const [playerNumber, setPlayerNumber] = useState("");
  const [pitchHand, setPitchHand] = useState<"R" | "L" | "S">("R");
  const [seasonPitches, setSeasonPitches] = useState("");
  const [seasonInnings, setSeasonInnings] = useState("");
  const [gamePitches, setGamePitches] = useState("");
  const [gameInnings, setGameInnings] = useState("");
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [showPlayerForm, setShowPlayerForm] = useState(false);

  const [opponent, setOpponent] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [opponentRecord, setOpponentRecord] = useState("");
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [showGameForm, setShowGameForm] = useState(false);

  const resetPlayerForm = () => {
    setPlayerName("");
    setPlayerNumber("");
    setPitchHand("R");
    setSeasonPitches("");
    setSeasonInnings("");
    setGamePitches("");
    setGameInnings("");
    setEditingPlayerId(null);
    setShowPlayerForm(false);
  };

  const resetGameForm = () => {
    setOpponent("");
    setDate("");
    setTime("");
    setLocation("");
    setOpponentRecord("");
    setEditingGameId(null);
    setShowGameForm(false);
  };

  const handleSubmitPlayer = async () => {
    if (!playersCollection || !playerName.trim() || !selectedTeamId) return;

    const payload = {
      name: playerName.trim(),
      number: playerNumber.trim() || undefined,
      pitchHand,
      seasonPitches: toNumber(seasonPitches),
      seasonInnings: toNumber(seasonInnings),
      gamePitches: toNumber(gamePitches),
      gameInnings: toNumber(gameInnings),
    };

    if (editingPlayerId && uid && selectedTeamId) {
      await updateDoc(doc(db, "users", uid, "teams", selectedTeamId, "players", editingPlayerId), payload);
      resetPlayerForm();
      return;
    }

    await addDoc(playersCollection, payload);
    resetPlayerForm();
  };

  const handleRemovePlayer = async (id: string) => {
    if (!uid || !selectedTeamId) return;
    await deleteDoc(doc(db, "users", uid, "teams", selectedTeamId, "players", id));
  };

  const startEditPlayer = (player: Player) => {
    setEditingPlayerId(player.id);
    setPlayerName(player.name);
    setPlayerNumber(player.number ?? "");
    setPitchHand(player.pitchHand ?? "R");
    setSeasonPitches(String(player.seasonPitches ?? ""));
    setSeasonInnings(String(player.seasonInnings ?? ""));
    setGamePitches(String(player.gamePitches ?? ""));
    setGameInnings(String(player.gameInnings ?? ""));
    setShowPlayerForm(true);
  };

  const handleSubmitGame = async () => {
    if (!gamesCollection || !opponent.trim() || !date.trim() || !selectedTeamId) return;

    const payload = {
      opponent: opponent.trim(),
      date: date.trim(),
      time: time.trim() || undefined,
      location: location.trim() || undefined,
      opponentRecord: opponentRecord.trim() || undefined,
      result: "",
    };

    if (editingGameId && uid && selectedTeamId) {
      await updateDoc(doc(db, "users", uid, "teams", selectedTeamId, "schedule", editingGameId), payload);
      resetGameForm();
      return;
    }

    await addDoc(gamesCollection, payload);
    resetGameForm();
  };

  const handleRemoveGame = async (id: string) => {
    if (!uid || !selectedTeamId) return;
    await deleteDoc(doc(db, "users", uid, "teams", selectedTeamId, "schedule", id));
  };

  const startEditGame = (game: Game) => {
    setEditingGameId(game.id);
    setOpponent(game.opponent);
    setDate(game.date);
    setTime(game.time ?? "");
    setLocation(game.location ?? "");
    setOpponentRecord(game.opponentRecord ?? "");
    setShowGameForm(true);
  };

  const handleAddTeam = async () => {
    if (!teamsCollection || !teamName.trim()) return;
    const name = teamName.trim();

    if (editingTeamId && uid) {
      await updateDoc(doc(db, "users", uid, "teams", editingTeamId), { name });
      setTeamName("");
      setEditingTeamId(null);
      return;
    }

    const docRef = await addDoc(teamsCollection, { name });
    setTeamName("");
    setSelectedTeamId(docRef.id);
  };

  const startEditTeam = (team: Team) => {
    setEditingTeamId(team.id);
    setTeamName(team.name);
  };

  const cancelEditTeam = () => {
    setEditingTeamId(null);
    setTeamName("");
  };

  const handleRemoveTeam = async (id: string) => {
    if (!uid) return;
    await deleteDoc(doc(db, "users", uid, "teams", id));
  };

  const confirmDelete = (label: string, onConfirm: () => void) => {
    Alert.alert("Confirm Delete", `Delete ${label}? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onConfirm },
    ]);
  };

  const record = games.reduce(
    (acc, game) => {
      if (game.result === "W") acc.wins += 1;
      if (game.result === "L") acc.losses += 1;
      return acc;
    },
    { wins: 0, losses: 0 }
  );

  const setResult = async (game: Game, next: "W" | "L" | "") => {
    if (!uid || !selectedTeamId) return;
    await updateDoc(doc(db, "users", uid, "teams", selectedTeamId, "schedule", game.id), {
      result: next,
    });
  };

  const toggleResult = (game: Game) => {
    const current = game.result ?? "";
    const next = current === "" ? "W" : current === "W" ? "L" : "";
    void setResult(game, next);
  };

  const handlePlayBall = (game: Game) => {
    if (!selectedTeamId) return;
    router.push({
      pathname: "/(tabs)/live",
      params: {
        teamId: selectedTeamId,
        gameId: game.id,
        opponent: game.opponent,
      },
    });
  };

  const selectedTeam = teams.find((team) => team.id === selectedTeamId) ?? null;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft:
        isAuthed && viewMode === "details"
          ? () => (
              <Pressable style={styles.headerBack} onPress={() => setViewMode("teams")}>
                <Text style={styles.headerBackText}>Back to Teams</Text>
              </Pressable>
            )
          : undefined,
    });
  }, [navigation, isAuthed, viewMode]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!isAuthed && (
        <View style={styles.card}>
          <Text style={styles.title}>Coaches</Text>
          <Text style={styles.sub}>Sign in to manage players and schedule.</Text>
        </View>
      )}

      {isAuthed && viewMode === "teams" && (
        <View style={styles.card}>
          <Text style={styles.title}>Teams</Text>
          <Text style={styles.sub}>Add a team, then select it to manage players and games.</Text>

          <TextInput
            value={teamName}
            onChangeText={setTeamName}
            placeholder="Team name"
            placeholderTextColor="#6f7782"
            maxLength={25}
            style={styles.input}
          />
          <Text style={styles.helper}>Max 25 characters.</Text>
          <View style={styles.actionRow}>
            <Pressable style={[styles.button, styles.primary]} onPress={handleAddTeam}>
              <Text style={[styles.buttonText, styles.primaryText]}>
                {editingTeamId ? "Save Team" : "Add Team"}
              </Text>
            </Pressable>
            {editingTeamId && (
              <Pressable style={[styles.button, styles.ghost]} onPress={cancelEditTeam}>
                <Text style={[styles.buttonText, styles.ghostText]}>Cancel</Text>
              </Pressable>
            )}
          </View>

          {teams.length === 0 ? (
            <Text style={styles.empty}>No teams yet.</Text>
          ) : (
            <View style={styles.teamRow}>
              {teams.map((team) => {
                const isActive = selectedTeamId === team.id && viewMode === "details";
                return (
                  <View
                    key={team.id}
                    style={[styles.teamCard, selectedTeamId === team.id && styles.teamCardActive]}
                  >
                    <View style={styles.teamCardHeader}>
                      <View>
                        <Text style={styles.teamCardTitle}>{team.name}</Text>
                        <Text style={styles.teamMeta}>Tap open to manage players and games.</Text>
                      </View>
                      <Pressable
                      style={[styles.button, styles.manageButton]}
                      onPress={() => {
                        setSelectedTeamId(team.id);
                        setViewMode("details");
                        setActiveTab("players");
                      }}
                    >
                        <Text style={[styles.buttonText, styles.manageButtonText]}>
                          {isActive ? "Open" : "Open"}
                        </Text>
                      </Pressable>
                    </View>
                    <View style={styles.rowActions}>
                      <Pressable onPress={() => startEditTeam(team)}>
                        <Text style={styles.edit}>Edit</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => confirmDelete(`team "${team.name}"`, () => handleRemoveTeam(team.id))}
                      >
                        <Text style={styles.delete}>Delete</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}

      {isAuthed && selectedTeamId && viewMode === "details" && (
        <View style={styles.card}>
          <View style={styles.teamDetailHeader}>
            <View>
              <Text style={styles.title}>{selectedTeam?.name ?? "Team"}</Text>
              <Text style={styles.sub}>Manage players and games for this team.</Text>
            </View>
          </View>
          <Text style={styles.teamMeta}>Players: {players.length} • Games: {games.length}</Text>

          <View style={styles.tabRow}>
            <Pressable
              onPress={() => setActiveTab("players")}
              style={[styles.tab, activeTab === "players" && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === "players" && styles.tabTextActive]}>Players</Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab("games")}
              style={[styles.tab, activeTab === "games" && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === "games" && styles.tabTextActive]}>Games</Text>
            </Pressable>
          </View>
        </View>
      )}

      {isAuthed && activeTab === "players" && selectedTeamId && viewMode === "details" && (
        <View style={styles.card}>
          <View style={styles.scheduleHeader}>
            <View>
              <Text style={styles.title}>Players</Text>
              <Text style={styles.sub}>Add and manage your roster.</Text>
            </View>
            <Pressable style={styles.addGameToggle} onPress={() => setShowPlayerForm((prev) => !prev)}>
              <Text style={styles.addGameToggleText}>
                {showPlayerForm ? "Hide Add Player" : "Add Player"}
              </Text>
            </Pressable>
          </View>

          {showPlayerForm && (
            <View style={styles.gameForm}>
              <TextInput
                value={playerName}
                onChangeText={setPlayerName}
                placeholder="Player name"
                placeholderTextColor="#6f7782"
                maxLength={40}
                style={styles.input}
              />
              <Text style={styles.helper}>Max 40 characters.</Text>

              <View style={styles.formRow}>
                <TextInput
                  value={playerNumber}
                  onChangeText={setPlayerNumber}
                  placeholder="Jersey #"
                  placeholderTextColor="#6f7782"
                  keyboardType="number-pad"
                  maxLength={4}
                  style={[styles.input, styles.inputSmall]}
                />
                <View style={styles.handRow}>
                  {(["R", "L", "S"] as const).map((hand) => (
                    <Pressable
                      key={hand}
                      style={[styles.handChip, pitchHand === hand && styles.handChipActive]}
                      onPress={() => setPitchHand(hand)}
                    >
                      <Text style={[styles.handChipText, pitchHand === hand && styles.handChipTextActive]}>
                        {hand}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Text style={styles.sectionTitle}>Season Stats</Text>
              <View style={styles.formRow}>
                <TextInput
                  value={seasonPitches}
                  onChangeText={setSeasonPitches}
                  placeholder="Pitches"
                  placeholderTextColor="#6f7782"
                  keyboardType="number-pad"
                  style={[styles.input, styles.inputFlex]}
                />
                <TextInput
                  value={seasonInnings}
                  onChangeText={setSeasonInnings}
                  placeholder="Innings"
                  placeholderTextColor="#6f7782"
                  keyboardType="decimal-pad"
                  style={[styles.input, styles.inputFlex]}
                />
              </View>

              <Text style={styles.sectionTitle}>Game Stats</Text>
              <View style={styles.formRow}>
                <TextInput
                  value={gamePitches}
                  onChangeText={setGamePitches}
                  placeholder="Pitches"
                  placeholderTextColor="#6f7782"
                  keyboardType="number-pad"
                  style={[styles.input, styles.inputFlex]}
                />
                <TextInput
                  value={gameInnings}
                  onChangeText={setGameInnings}
                  placeholder="Innings"
                  placeholderTextColor="#6f7782"
                  keyboardType="decimal-pad"
                  style={[styles.input, styles.inputFlex]}
                />
              </View>

              <View style={styles.actionRow}>
                <Pressable style={[styles.button, styles.primary]} onPress={handleSubmitPlayer}>
                  <Text style={[styles.buttonText, styles.primaryText]}>
                    {editingPlayerId ? "Save Player" : "Add Player"}
                  </Text>
                </Pressable>
                {editingPlayerId && (
                  <Pressable style={[styles.button, styles.ghost]} onPress={resetPlayerForm}>
                    <Text style={[styles.buttonText, styles.ghostText]}>Cancel</Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}

          <View style={styles.list}>
            {players.length === 0 ? (
              <Text style={styles.empty}>No players yet.</Text>
            ) : (
              players.map((player) => (
                <View key={player.id} style={styles.listRow}>
                  <View style={styles.listStack}>
                    <Text style={styles.listText}>
                      {player.name}
                      {player.number ? ` #${player.number}` : ""}
                      {player.pitchHand ? ` • ${player.pitchHand}` : ""}
                    </Text>
                    <Text style={styles.listMeta}>
                      {player.number ? `#${player.number} ` : ""}{player.pitchHand ? `• ${player.pitchHand}` : ""}
                    </Text>
                  </View>
                  <View style={styles.rowActions}>
                    <Pressable onPress={() => startEditPlayer(player)}>
                      <Text style={styles.edit}>Edit</Text>
                    </Pressable>
                  <Pressable onPress={() => confirmDelete(`player "${player.name}"`, () => handleRemovePlayer(player.id))}>
                    <Text style={styles.delete}>Remove</Text>
                  </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      )}

        {isAuthed && activeTab === "games" && selectedTeamId && viewMode === "details" && (
          <View style={styles.card}>
            <Text style={styles.title}>Season Schedule</Text>
            <Text style={styles.sub}>Add opponents and game details.</Text>
            <View style={styles.scheduleHeader}>
              <Text style={styles.scheduleTitle}>Schedule</Text>
              <Pressable style={styles.addGameToggle} onPress={() => setShowGameForm((prev) => !prev)}>
                <Text style={styles.addGameToggleText}>{showGameForm ? "Hide Add Game" : "Add Game"}</Text>
              </Pressable>
            </View>

            <View style={styles.list}>
              {games.length === 0 ? (
                <Text style={styles.empty}>No games scheduled.</Text>
              ) : (
                games.map((game) => (
                  <View key={game.id} style={styles.gameRow}>
                    <View style={styles.gameRowTop}>
                      <View style={styles.listStack}>
                        <Text style={styles.listText}>{game.opponent}</Text>
                        <Text style={styles.listMeta}>
                          {game.date}
                          {game.time ? ` • ${game.time}` : ""}
                          {game.location ? ` • ${game.location}` : ""}
                        </Text>
                        <Text style={styles.listMeta}>
                          Opponent record: {game.opponentRecord ?? "—"}
                        </Text>
                        {(typeof game.teamRuns === "number" || typeof game.opponentRuns === "number") && (
                          <Text style={styles.listMeta}>
                            Score: {game.teamRuns ?? 0} - {game.opponentRuns ?? 0}
                          </Text>
                        )}
                        <Text style={styles.listMeta}>
                          Result: {game.result ?? "—"}
                        </Text>
                      </View>
                      <View style={styles.rowActions}>
                        <Pressable onPress={() => toggleResult(game)}>
                          <Text style={styles.edit}>Win/Loss</Text>
                        </Pressable>
                        <Pressable onPress={() => startEditGame(game)}>
                          <Text style={styles.edit}>Edit</Text>
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            confirmDelete(`game vs ${game.opponent}`, () => handleRemoveGame(game.id))
                          }
                        >
                          <Text style={styles.delete}>Remove</Text>
                        </Pressable>
                      </View>
                    </View>
                    <View style={styles.playRow}>
                      <Pressable onPress={() => handlePlayBall(game)}>
                        <Text style={styles.playBall}>Play Ball</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
            </View>

            {showGameForm && (
              <View style={styles.gameForm}>
                <TextInput
                  value={opponent}
                  onChangeText={setOpponent}
                  placeholder="Opponent"
                  placeholderTextColor="#6f7782"
                  style={styles.input}
                />
                <TextInput
                  value={date}
                  onChangeText={setDate}
                  placeholder="Date (YYYY-MM-DD)"
                  placeholderTextColor="#6f7782"
                  style={styles.input}
                />
                <TextInput
                  value={time}
                  onChangeText={setTime}
                  placeholder="Time (e.g. 6:30 PM)"
                  placeholderTextColor="#6f7782"
                  style={styles.input}
                />
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Location"
                  placeholderTextColor="#6f7782"
                  style={styles.input}
                />
                <TextInput
                  value={opponentRecord}
                  onChangeText={setOpponentRecord}
                  placeholder="Opponent W/L (e.g. 8-4)"
                  placeholderTextColor="#6f7782"
                  style={styles.input}
                />

                <View style={styles.actionRow}>
                  <Pressable style={[styles.button, styles.primary]} onPress={handleSubmitGame}>
                    <Text style={[styles.buttonText, styles.primaryText]}>
                      {editingGameId ? "Save Game" : "Add Game"}
                    </Text>
                  </Pressable>
                  {editingGameId && (
                    <Pressable style={[styles.button, styles.ghost]} onPress={resetGameForm}>
                      <Text style={[styles.buttonText, styles.ghostText]}>Cancel</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  headerBack: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.25)",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
  },
  headerBackText: { color: "#0f172a", fontWeight: "700", fontSize: 12 },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    borderRadius: 999,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  tabText: { fontSize: 14, fontWeight: "700", color: "#E2E8F0" },
  tabTextActive: { color: "#0f172a" },
  card: {
    backgroundColor: "rgba(10, 14, 24, 0.7)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 6, color: "#ffffff" },
  sub: { fontSize: 14, color: "#E2E8F0", marginBottom: 14 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#E2E8F0", marginBottom: 8 },
  helper: { color: "#94A3B8", fontSize: 12, marginTop: -6, marginBottom: 10 },
  formRow: { flexDirection: "row", gap: 10, marginBottom: 12, alignItems: "center" },
  handRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  teamRow: { gap: 12 },
  teamCard: {
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    backgroundColor: "rgba(15, 23, 42, 0.3)",
  },
  teamCardActive: { borderColor: "rgba(255, 255, 255, 0.5)" },
  teamCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  teamCardTitle: { fontSize: 16, fontWeight: "800", color: "#F8FAFC" },
  teamMeta: { color: "#CBD5F5", fontSize: 13 },
  teamDetailHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  handChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  handChipActive: { backgroundColor: "rgba(255, 255, 255, 0.9)" },
  handChipText: { fontSize: 12, fontWeight: "700", color: "#E2E8F0" },
  handChipTextActive: { color: "#0f172a" },
  input: {
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
  inputFlex: { flex: 1, marginBottom: 0 },
  inputSmall: { width: 90, marginBottom: 0 },
  actionRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  button: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  primary: { backgroundColor: "#B22234", borderColor: "#B22234" },
  primaryText: { color: "#fff" },
  ghost: { backgroundColor: "transparent", borderColor: "rgba(255, 255, 255, 0.35)" },
  ghostText: { color: "#E2E8F0" },
  buttonText: { fontSize: 15, fontWeight: "700" },
  manageButton: { backgroundColor: "#1D4ED8", borderColor: "#1D4ED8" },
  manageButtonText: { color: "#fff" },
  list: { gap: 10 },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
  },
  listStack: { flex: 1, paddingRight: 12 },
  listText: { color: "#F8FAFC", fontSize: 15, fontWeight: "600" },
  listMeta: { color: "#CBD5F5", fontSize: 13, marginTop: 2 },
  rowActions: { flexDirection: "row", gap: 12 },
  gameRow: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
    gap: 6,
  },
  gameRowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  playRow: { alignItems: "center", paddingTop: 2 },
  edit: { color: "#93C5FD", fontWeight: "700" },
  delete: { color: "#FCA5A5", fontWeight: "700" },
  playBall: { color: "#22C55E", fontWeight: "800" },
  empty: { color: "#94A3B8", fontStyle: "italic" },
  scheduleHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  scheduleTitle: { fontSize: 14, fontWeight: "700", color: "#E2E8F0" },
  addGameToggle: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  addGameToggleText: { color: "#E2E8F0", fontWeight: "700", fontSize: 12 },
  gameForm: { marginTop: 16 },
});
