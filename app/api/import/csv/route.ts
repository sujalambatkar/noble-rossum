import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { F1_POINTS } from "@/lib/points";
import { isAdminAuthenticated } from "@/lib/auth";

interface CSVRow {
  roundNumber: number;
  playerName: string;
  points: number;
  dnf: boolean;
}

function parseCSVData(csvText: string): CSVRow[] {
  const lines = csvText.trim().split("\n");
  const rows: CSVRow[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",").map((p) => p.trim());
    if (parts.length < 4) continue;

    const roundNumber = parseInt(parts[0]);
    const playerName = parts[1];
    const points = parseInt(parts[2]);
    const dnf = parts[3].toLowerCase() === "true";

    if (!isNaN(roundNumber) && playerName) {
      rows.push({ roundNumber, playerName, points, dnf });
    }
  }

  return rows;
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const csvText = await file.text();
    const csvRows = parseCSVData(csvText);

    if (csvRows.length === 0) {
      return NextResponse.json(
        { error: "No valid data found in CSV" },
        { status: 400 }
      );
    }

    // Get all players
    const { data: players } = await supabase
      .from("players")
      .select("id, name");

    const playerMap = new Map(
      players?.map((p: any) => [p.name.toLowerCase(), p.id]) || []
    );

    // Group by round
    const roundsMap = new Map<number, CSVRow[]>();
    for (const row of csvRows) {
      if (!roundsMap.has(row.roundNumber)) {
        roundsMap.set(row.roundNumber, []);
      }
      roundsMap.get(row.roundNumber)!.push(row);
    }

    let successCount = 0;
    const errors: string[] = [];

    // Process each round
    for (const [roundNumber, results] of roundsMap) {
      try {
        // Check if round already exists
        const { data: existingRound } = await supabase
          .from("rounds")
          .select("id")
          .eq("round_number", roundNumber)
          .single();

        let roundId: string;

        if (existingRound) {
          roundId = existingRound.id;
          // Delete existing results for this round
          await supabaseAdmin.from("results").delete().eq("round_id", roundId);
        } else {
          // Create new round
          const { data: newRound, error: roundError } = await supabaseAdmin
            .from("rounds")
            .insert([{ round_number: roundNumber }])
            .select()
            .single();

          if (roundError) throw roundError;
          roundId = newRound.id;
        }

        // Helper: Convert points to rank
        const getRankFromPoints = (points: number): number | null => {
          if (points === 0) return null;
          for (const [rank, pts] of Object.entries(F1_POINTS)) {
            if (pts === points) return parseInt(rank);
          }
          return null;
        };

        // Insert results
        const resultsToInsert = results
          .filter((r) => playerMap.has(r.playerName.toLowerCase()))
          .map((r) => ({
            player_id: playerMap.get(r.playerName.toLowerCase()),
            round_id: roundId,
            rank: getRankFromPoints(r.points),
            points: r.points,
            dnf: r.dnf,
          }));

        if (resultsToInsert.length > 0) {
          const { error: resultsError } = await supabaseAdmin
            .from("results")
            .insert(resultsToInsert);

          if (resultsError) throw resultsError;
          successCount++;
        }
      } catch (error) {
        errors.push(
          `Round ${roundNumber}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      roundsImported: successCount,
      totalRounds: roundsMap.size,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("CSV import error:", error);
    return NextResponse.json(
      { error: "Failed to import CSV" },
      { status: 500 }
    );
  }
}
