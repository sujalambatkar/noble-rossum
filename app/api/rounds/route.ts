import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getPointsForRank } from "@/lib/points";

export async function GET() {
  try {
    const { data: rounds, error: roundsError } = await supabase
      .from("rounds")
      .select("*")
      .order("round_number");

    if (roundsError) throw roundsError;

    const { data: results, error: resultsError } = await supabase
      .from("results")
      .select("*");

    if (resultsError) throw resultsError;

    return NextResponse.json({ rounds, results });
  } catch (error) {
    console.error("Error fetching rounds:", error);
    return NextResponse.json(
      { error: "Failed to fetch rounds" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { roundNumber, results: resultData } = await request.json();

    if (!roundNumber || typeof roundNumber !== "number") {
      return NextResponse.json(
        { error: "Round number is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(resultData) || resultData.length === 0) {
      return NextResponse.json(
        { error: "Results data is required" },
        { status: 400 }
      );
    }

    // Create the round
    const { data: round, error: roundError } = await supabase
      .from("rounds")
      .insert([{ round_number: roundNumber }])
      .select()
      .single();

    if (roundError) {
      if (roundError.code === "23505") {
        return NextResponse.json(
          { error: "Round already exists" },
          { status: 409 }
        );
      }
      throw roundError;
    }

    // Insert results
    const resultsToInsert = resultData.map((result: any) => ({
      player_id: result.playerId,
      round_id: round.id,
      rank: result.dnf ? null : result.rank,
      points: result.dnf ? 0 : getPointsForRank(result.rank),
      dnf: result.dnf || false,
    }));

    const { error: resultsError } = await supabase
      .from("results")
      .insert(resultsToInsert);

    if (resultsError) throw resultsError;

    return NextResponse.json({ round });
  } catch (error) {
    console.error("Error creating round:", error);
    return NextResponse.json(
      { error: "Failed to create round" },
      { status: 500 }
    );
  }
}
