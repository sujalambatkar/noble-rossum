import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("name");

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Player name is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("players")
      .insert([{ name: name.trim() }])
      .select();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Player already exists" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error creating player:", error);
    return NextResponse.json(
      { error: "Failed to create player" },
      { status: 500 }
    );
  }
}
