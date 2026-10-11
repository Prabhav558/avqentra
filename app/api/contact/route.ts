import { NextResponse } from "next/server";
import { validate } from "@/lib/contact";
import { saveLead } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Best-effort limiter: per server instance, resets on restart. Real abuse protection belongs at the edge (WAF / Turnstile).
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60_000;
const MAX_HITS = 5;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_HITS;
}

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  // Same-origin only: a cross-site page should not be able to post messages through a visitor's browser.
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return json({ error: "forbidden" }, 403);

  if (Number(req.headers.get("content-length") ?? 0) > 20_000) return json({ error: "too_large" }, 413);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  // Honeypot: real visitors never see or fill this field. Pretend success so bots learn nothing.
  if (body && typeof body === "object" && (body as Record<string, unknown>).website) return json({ ok: true });

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return json({ error: "rate_limited" }, 429);

  const parsed = validate(body);
  if (!parsed.ok) return json({ error: "invalid", errors: parsed.errors }, 400);

  const result = await saveLead(parsed.value, "website /contact");
  if (result.ok) return json({ ok: true });
  return result.reason === "not-configured" ? json({ error: "not_configured" }, 503) : json({ error: "save_failed" }, 502);
}
