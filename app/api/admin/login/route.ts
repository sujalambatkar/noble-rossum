import { NextRequest, NextResponse } from "next/server";
import {
  setAdminSession,
  verifyAdminPassword,
  isLoginLocked,
  recordLoginFailure,
  clearLoginFailures,
} from "@/lib/auth";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Brute-force lockout
  const { locked, retryInSec } = isLoginLocked(ip);
  if (locked) {
    return NextResponse.json(
      {
        error: `Too many failed attempts. Try again in ${Math.ceil(
          retryInSec / 60
        )} minute(s).`,
      },
      { status: 429 }
    );
  }

  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    if (!verifyAdminPassword(password)) {
      recordLoginFailure(ip);
      // Small artificial delay to slow scripted attacks
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    clearLoginFailures(ip);
    await setAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
