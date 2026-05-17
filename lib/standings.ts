import { supabase } from "./supabase";
import { calculateAveragePointsPerRound } from "./analytics";

export interface LeaderboardPlayer {
  id: string;
  name: string;
  totalPoints: number;
  wins: number;
  roundsParticipated: number;
  avgPointsPerRound: number;
}

export async function fetchStandings(): Promise<LeaderboardPlayer[]> {
  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("*");
  if (playersError) throw playersError;

  const { data: results, error: resultsError } = await supabase
    .from("results")
    .select("*");
  if (resultsError) throw resultsError;

  const standings: LeaderboardPlayer[] = (players ?? []).map((player: any) => {
    const playerResults = (results ?? []).filter(
      (r: any) => r.player_id === player.id
    );
    const totalPoints = playerResults.reduce(
      (sum: number, r: any) => sum + r.points,
      0
    );
    const wins = playerResults.filter((r: any) => r.rank === 1).length;
    const roundsParticipated = playerResults.length;
    const avgPPR = calculateAveragePointsPerRound(totalPoints, roundsParticipated);

    return {
      id: player.id,
      name: player.name,
      totalPoints,
      wins,
      roundsParticipated,
      avgPointsPerRound: Math.round(avgPPR * 100) / 100,
    };
  });

  standings.sort((a, b) => b.totalPoints - a.totalPoints);
  return standings;
}

export async function fetchRoundCount(): Promise<number> {
  const { count, error } = await supabase
    .from("rounds")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}
