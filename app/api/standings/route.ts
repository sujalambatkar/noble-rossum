import { NextResponse } from "next/server";
import { fetchStandings } from "@/lib/standings";

export async function GET() {
  try {
    const standings = await fetchStandings();
    return NextResponse.json(standings);
  } catch (error) {
    console.error("Error fetching standings:", error);
    return NextResponse.json(
      { error: "Failed to fetch standings" },
      { status: 500 }
    );
  }
}
