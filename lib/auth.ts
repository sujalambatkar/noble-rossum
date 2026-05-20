import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Admin auth — HMAC-signed session cookies.
 *
 * The cookie value is `v1.{expiresMs}.{HMAC_SHA256(SESSION_SECRET, "v1." + expiresMs)}`.
 * Anyone who tries to forge a cookie without knowing SESSION_SECRET cannot produce
 * a valid signature, so the cookie fails verification on the server.
 */

const ADMIN_COOKIE_NAME = "bl_admin"; // renamed → invalidates old plaintext cookies
const SESSION_VERSION = "v1";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET env var must be set to a random string of 16+ characters"
    );
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function createToken(): string {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = `${SESSION_VERSION}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [version, expiresStr, sig] = parts;
  if (version !== SESSION_VERSION) return false;
  const expiresAt = Number(expiresStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  const expectedSig = sign(`${version}.${expiresStr}`);
  try {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expectedSig, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

/**
 * Constant-time password comparison. Returns false if either side is missing
 * or lengths differ. Prevents timing-based length / prefix leaks.
 */
export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !password) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Brute-force protection: in-memory per-IP rate limit on login.
 * After 5 failed attempts within 15 minutes, the IP is locked for 15 minutes.
 *
 * This is in-process memory — fine for the single-region serverless deployment
 * because Vercel reuses instances for short windows. For stronger protection
 * across all instances you'd back this with a KV store (e.g., Vercel KV).
 */
interface AttemptRecord {
  count: number;
  firstAt: number;
  lockedUntil?: number;
}
const attempts = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;

export function isLoginLocked(ip: string): { locked: boolean; retryInSec: number } {
  const rec = attempts.get(ip);
  if (!rec?.lockedUntil) return { locked: false, retryInSec: 0 };
  if (Date.now() >= rec.lockedUntil) {
    attempts.delete(ip);
    return { locked: false, retryInSec: 0 };
  }
  return {
    locked: true,
    retryInSec: Math.ceil((rec.lockedUntil - Date.now()) / 1000),
  };
}

export function recordLoginFailure(ip: string): void {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now });
    return;
  }
  rec.count += 1;
  if (rec.count >= MAX_ATTEMPTS) {
    rec.lockedUntil = now + LOCKOUT_MS;
  }
}

export function clearLoginFailures(ip: string): void {
  attempts.delete(ip);
}
