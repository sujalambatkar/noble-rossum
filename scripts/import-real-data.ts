import { createClient } from "@supabase/supabase-js";
import { ROUND_DATA } from "./round-data";

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
};

async function importRealData() {
  console.log(`Importing ${ROUND_DATA.length} real rounds from Google Sheet...`);

  try {
    console.log("Clearing existing data...");
    await supabase.from("results").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("rounds").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("players").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    console.log(`Inserting ${PLAYERS.length} players...`);
    const { data: playersData, error: playersError } = await supabase
      .from("players")
      .insert(PLAYERS.map((name) => ({ name })))
      .select();

    if (playersError) throw playersError;

    const playerMap = new Map(playersData!.map((p: any) => [p.name, p.id]));
    console.log(`Inserted ${playersData!.length} players`);

    let totalResults = 0;
    for (let i = 0; i < ROUND_DATA.length; i++) {
      const roundNum = i + 1;
      const entries = ROUND_DATA[i];

      const { data: round, error: roundError } = await supabase
        .from("rounds")
        .insert([{ round_number: roundNum }])
        .select()
        .single();

      if (roundError) throw roundError;

      const resultsToInsert = entries
        .filter((entry) => playerMap.has(entry.name))
        .map((entry) => ({
          player_id: playerMap.get(entry.name),
          round_id: round.id,
          rank: entry.dnf ? null : POINTS_TO_RANK[entry.points] ?? null,
          points: entry.points,
          dnf: !!entry.dnf,
        }));

      if (resultsToInsert.length > 0) {
        const { error: resultsError } = await supabase
          .from("results")
          .insert(resultsToInsert);

        if (resultsError) throw resultsError;
        totalResults += resultsToInsert.length;
      }

      if (roundNum % 10 === 0) {
        console.log(`  Imported ${roundNum}/${ROUND_DATA.length} rounds`);
      }
    }

    console.log(`Inserted ${totalResults} race results across ${ROUND_DATA.length} rounds`);
    console.log("\nImport complete. Run `npm run dev` and visit http://localhost:3000");
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  }
}

importRealData();
