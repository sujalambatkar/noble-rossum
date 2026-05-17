import { supabase } from "./supabase";

export interface SeasonState {
  isFinished: boolean;
  winnerId: string | null;
  winnerName: string | null;
  declaredAt: string | null;
}

export async function fetchSeasonState(): Promise<SeasonState> {
  const { data, error } = await supabase
    .from("season_state")
    .select("winner_player_id, declared_at")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;

  const winnerId = (data?.winner_player_id as string | null) ?? null;
  const declaredAt = (data?.declared_at as string | null) ?? null;

  let winnerName: string | null = null;
  if (winnerId) {
    const { data: player } = await supabase
      .from("players")
      .select("name")
      .eq("id", winnerId)
      .maybeSingle();
    winnerName = (player?.name as string | undefined) ?? null;
  }

  return {
    isFinished: !!winnerId,
    winnerId,
    winnerName,
    declaredAt,
  };
}

export async function declareWinner(playerId: string): Promise<void> {
  const { error } = await supabase
    .from("season_state")
    .upsert(
      {
        id: 1,
        winner_player_id: playerId,
        declared_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
  if (error) throw error;
}

export async function withdrawWinner(): Promise<void> {
  const { error } = await supabase
    .from("season_state")
    .upsert(
      { id: 1, winner_player_id: null, declared_at: null },
      { onConflict: "id" }
    );
  if (error) throw error;
}
