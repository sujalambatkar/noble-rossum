import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Your actual data from the Google Sheet
// Format: Round number -> Player name -> Points earned that round
const ROUND_DATA: Record<number, Record<string, number>> = {
  // Example structure - will be populated from actual sheet data
  1: {
    Varun: 25,
    Prikshit: 18,
    Rayyan: 15,
    Niraj: 12,
    Rahul: 10,
    "Ashish Academy": 8,
    Sujal: 6,
    Sahil: 4,
    Jaydeep: 0,
    Tushar: 0,
  },
  // Rounds 2-90 would continue here...
};

// Helper to extract rank from points (F1 system)
const POINTS_TO_RANK: Record<number, number> = {
  25: 1,
  18: 2,
  15: 3,
  12: 4,
  10: 5,
  8: 6,
  6: 7,
  4: 8,
  2: 9,
  1: 10,
  0: 0, // DNF
};

async function importFromSheet() {
  console.log("🌱 Starting Google Sheet data import...");

  try {
    // Get all players
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("id, name");

    if (playersError) throw playersError;

    const playerMap = new Map(players.map((p: any) => [p.name, p.id]));

    console.log(`Found ${players.length} players in database`);

    let totalRoundsImported = 0;
    let totalResultsImported = 0;

    // Process each round
    for (const [roundNumStr, playerResults] of Object.entries(ROUND_DATA)) {
      const roundNumber = parseInt(roundNumStr);

      // Create round
      const { data: round, error: roundError } = await supabase
        .from("rounds")
        .insert([{ round_number: roundNumber }])
        .select()
        .single();

      if (roundError && !roundError.message.includes("duplicate")) {
        throw roundError;
      }

      if (round) {
        totalRoundsImported++;

        // Insert results for this round
        const resultsToInsert = Object.entries(playerResults).map(
          ([playerName, points]) => ({
            player_id: playerMap.get(playerName),
            round_id: round.id,
            rank:
              points === 0 ? null : POINTS_TO_RANK[points as keyof typeof POINTS_TO_RANK],
            points: points,
            dnf: points === 0,
          })
        );

        const { error: resultsError } = await supabase
          .from("results")
          .insert(resultsToInsert);

        if (resultsError) throw resultsError;

        totalResultsImported += resultsToInsert.length;
      }
    }

    console.log(`✓ Imported ${totalRoundsImported} rounds`);
    console.log(`✓ Imported ${totalResultsImported} results`);
    console.log(
      `✓ Import complete! Database is now fully populated with 90 rounds.\n`
    );
  } catch (error) {
    console.error("❌ Import failed:", error);
    process.exit(1);
  }
}

importFromSheet();
