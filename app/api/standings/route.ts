import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { calculateAveragePointsPerRound } from "@/lib/analytics";

export async function GET() {
  try {
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("*");

    if (playersError) throw playersError;

    const { data: results, error: resultsError } = await supabase
      .from("results")
      .select("*");

    if (resultsError) throw resultsError;

    // Calculate standings
    const standings = (players || []).map((player) => {
      const playerResults = results.filter((r: any) => r.player_id === player.id);
      const totalPoints = playerResults.reduce((sum, r: any) => sum + r.points, 0);
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

    return NextResponse.json(standings);
  } catch (error) {
    console.error("Error fetching standings:", error);
    return NextResponse.json(
      { error: "Failed to fetch standings" },
      { status: 500 }
    );
  }
}
