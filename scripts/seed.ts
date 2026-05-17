import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const PLAYERS = [
  "Varun",
  "Prikshit",
  "Rayyan",
  "Niraj",
  "Rahul",
  "Ashish Academy",
  "Sujal",
  "Sahil",
];

const F1_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

// Simulated 90 rounds of race data
function generateRaceResults(): Record<number, number[]> {
  const results: Record<number, number[]> = {};

  // Distribute wins to match final standings
  const winDistribution = [9, 9, 9, 8, 8, 8, 3, 3]; // wins per player
  let totalWins = 0;

  for (let round = 1; round <= 90; round++) {
    // Determine winner based on win distribution
    let winner = 0;
    let accumulatedWins = 0;

    for (let i = 0; i < PLAYERS.length; i++) {
      accumulatedWins += winDistribution[i];
      if (totalWins < accumulatedWins) {
        winner = i;
        break;
      }
    }
    totalWins++;

    // Generate race order with some randomness but weighted by skill
    const order: number[] = [];
    const available = Array.from({ length: PLAYERS.length }, (_, i) => i);

    // Winner in first position
    order.push(available[winner]);
    available.splice(available.indexOf(winner), 1);

    // Shuffle remaining with bias towards top players
    while (available.length > 0) {
      const idx = Math.floor(Math.random() ** 1.5 * available.length);
      order.push(available[idx]);
      available.splice(idx, 1);
    }

    results[round] = order;
  }

  return results;
}

async function seed() {
  console.log("🌱 Starting complete data seeding with 90 rounds...");

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await supabase.from("results").delete().neq("id", "");
    await supabase.from("rounds").delete().neq("id", "");
    await supabase.from("players").delete().neq("id", "");

    // Insert players
    console.log("Inserting 8 players...");
    const { data: playersData, error: playersError } = await supabase
      .from("players")
      .insert(PLAYERS.map((name) => ({ name })))
      .select();

    if (playersError) throw playersError;

    const playerMap = new Map(playersData.map((p: any) => [p.name, p.id]));
    console.log(`✓ Inserted ${playersData.length} players`);

    // Generate race results
    const raceResults = generateRaceResults();

    // Insert rounds and results
    console.log("Inserting 90 rounds of data...");
    let totalResults = 0;

    for (let roundNum = 1; roundNum <= 90; roundNum++) {
      // Create round
      const { data: round, error: roundError } = await supabase
        .from("rounds")
        .insert([{ round_number: roundNum }])
        .select()
        .single();

      if (roundError) throw roundError;

      // Insert results for this round
      const finishOrder = raceResults[roundNum];
      const resultsToInsert = finishOrder.map((playerIdx, position) => ({
        player_id: playerMap.get(PLAYERS[playerIdx]),
        round_id: round.id,
        rank: position + 1,
        points: F1_POINTS[position],
        dnf: false,
      }));

      const { error: resultsError } = await supabase
        .from("results")
        .insert(resultsToInsert);

      if (resultsError) throw resultsError;
      totalResults += resultsToInsert.length;
    }

    console.log(`✓ Inserted ${totalResults} race results (90 rounds × 8 players)`);
    console.log("\n✅ Seeding complete!");
    console.log("Your app is ready with full championship data!");
    console.log("\n🏁 Next: npm run dev and visit http://localhost:3000\n");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
