import { NextRequest, NextResponse } from "next/server";
import { fetchSeasonState, declareWinner, withdrawWinner } from "@/lib/season";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const state = await fetchSeasonState();
    return NextResponse.json(state);
  } catch (error) {
    console.error("Error fetching season state:", error);
    return NextResponse.json(
      { error: "Failed to fetch season state" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { playerId } = await request.json();
    if (!playerId || typeof playerId !== "string") {
      return NextResponse.json(
        { error: "playerId is required" },
        { status: 400 }
      );
    }
    await declareWinner(playerId);
    return NextResponse.json(await fetchSeasonState());
  } catch (error) {
    console.error("Error declaring winner:", error);
    return NextResponse.json(
      { error: "Failed to declare winner" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await withdrawWinner();
    return NextResponse.json(await fetchSeasonState());
  } catch (error) {
    console.error("Error withdrawing winner:", error);
    return NextResponse.json(
      { error: "Failed to withdraw winner" },
      { status: 500 }
    );
  }
}
