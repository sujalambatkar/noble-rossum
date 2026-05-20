import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.\n" +
      "Get the service role key from Supabase Dashboard → Settings → API → service_role."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

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

type RoundEntry = number | "DNF";

interface ParsedPlayer {
  name: string;
  rounds: RoundEntry[];
  statedTotal: number;
}

function parseCsv(content: string): ParsedPlayer[] {
  const lines = content.split(/\r?\n/);
  const players: ParsedPlayer[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const cells = line.split(",");
    // Only process rows that start with "P<digits>" (P1, P2, ... P10)
    if (!/^P\d+$/.test(cells[0]?.trim() ?? "")) continue;

    const name = (cells[1] ?? "").trim();
    if (!name) continue;
    const statedTotal = parseInt((cells[2] ?? "0").trim(), 10) || 0;

    const rounds: RoundEntry[] = [];
    for (let i = 3; i < cells.length; i++) {
      const raw = (cells[i] ?? "").trim();
      if (raw === "") break; // empty cell → no more rounds
      if (raw.toUpperCase() === "DNF") {
        rounds.push("DNF");
      } else {
        const n = parseInt(raw, 10);
        if (Number.isNaN(n)) break;
        rounds.push(n);
      }
    }

    players.push({ name, rounds, statedTotal });
  }

  return players;
}

async function clearAllData() {
  console.log("Clearing existing data…");
  // Reset season_state first so it doesn't hold a stale FK
  await supabase
    .from("season_state")
    .update({ winner_player_id: null, declared_at: null })
    .eq("id", 1);
  await supabase
    .from("results")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase
    .from("rounds")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase
    .from("players")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
}

async function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const csvPath = join(here, "data", "points-table.csv");
  const csv = readFileSync(csvPath, "utf-8");
  const allPlayers = parseCsv(csv);

  if (allPlayers.length === 0) {
    console.error("No player rows found in CSV. Aborting.");
    process.exit(1);
  }

  // Exclude players who never participated (all rounds are DNF).
  // Right now that's Jaydeep and Tushar — they aren't playing this season.
  const players = allPlayers.filter((p) => {
    const allDNF = p.rounds.length > 0 && p.rounds.every((r) => r === "DNF");
    if (allDNF) {
      console.log(`  Skipping ${p.name} (all rounds DNF — not participating)`);
    }
    return !allDNF;
  });

  const maxRounds = Math.max(...players.map((p) => p.rounds.length));
  console.log(`Importing ${players.length} active players, ${maxRounds} rounds.`);

  // Sanity check: verify computed totals match stated totals
  for (const p of players) {
    const computed = p.rounds.reduce(
      (sum: number, v) => sum + (v === "DNF" ? 0 : v),
      0
    );
    if (computed !== p.statedTotal) {
      console.warn(
        `  ⚠ ${p.name}: computed ${computed} != stated ${p.statedTotal}`
      );
    }
  }

  await clearAllData();

  // Insert players
  const { data: playersData, error: playersError } = await supabase
    .from("players")
    .insert(players.map((p) => ({ name: p.name })))
    .select();

  if (playersError) throw playersError;
  const playerMap = new Map(playersData!.map((p: any) => [p.name, p.id]));
  console.log(`Inserted ${playersData!.length} players`);

  // Insert rounds + results
  let totalResults = 0;
  for (let r = 0; r < maxRounds; r++) {
    const roundNum = r + 1;

    const { data: round, error: roundError } = await supabase
      .from("rounds")
      .insert([{ round_number: roundNum }])
      .select()
      .single();
    if (roundError) throw roundError;

    const resultsToInsert = players
      .filter((p) => r < p.rounds.length)
      .map((p) => {
        const entry = p.rounds[r];
        const isDNF = entry === "DNF";
        const points = isDNF ? 0 : (entry as number);
        const rank = isDNF ? null : POINTS_TO_RANK[points] ?? null;
        return {
          player_id: playerMap.get(p.name),
          round_id: round.id,
          rank,
          points,
          dnf: isDNF,
        };
      });

    if (resultsToInsert.length > 0) {
      const { error: resultsError } = await supabase
        .from("results")
        .insert(resultsToInsert);
      if (resultsError) throw resultsError;
      totalResults += resultsToInsert.length;
    }

    if (roundNum % 10 === 0 || roundNum === maxRounds) {
      console.log(`  Imported ${roundNum}/${maxRounds} rounds`);
    }
  }

  console.log(
    `\nDone. ${totalResults} results across ${maxRounds} rounds for ${players.length} players.`
  );
}

main().catch((e) => {
  console.error("Import failed:", e);
  process.exit(1);
});
