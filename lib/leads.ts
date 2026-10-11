// Server only. Never import this from a client component: it reads secret keys.
import { topics, type Lead } from "./contact";
import { contactEmail } from "./site";

export type SaveResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };
type Step = "skipped" | "ok" | "failed";

/** Stores the message in Supabase (table: contact_messages, see docs/supabase.sql). Uses PostgREST over fetch. */
async function store(lead: Lead, source: string): Promise<Step> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return "skipped";
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/contact_messages`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        topic: lead.topic,
        name: lead.name,
        email: lead.email,
        company: lead.company || null,
        product: lead.product || null,
        message: lead.message,
        source,
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (res.ok) return "ok";
    console.error("contact: supabase insert failed", res.status, (await res.text()).slice(0, 300));
    return "failed";
  } catch (err) {
    console.error("contact: supabase request error", err instanceof Error ? err.message : err);
    return "failed";
  }
}

/** Emails the founders through Resend. Off unless RESEND_API_KEY and RESEND_FROM are set. Plain text only. */
async function notify(lead: Lead, source: string): Promise<Step> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from) return "skipped";
  const clean = (v: string) => v.replace(/[\r\n\u0000-\u001f]+/g, " ").trim(); // no header injection through the subject
  const lines = [
    lead.message,
    "",
    "—",
    `Topic: ${topics[lead.topic].label}`,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    ...(lead.company ? [`Company: ${lead.company}`] : []),
    ...(lead.product ? [`Product: ${lead.product}`] : []),
    `Sent from: ${source}`,
  ];
  try {
    const res = await fetch(`${(process.env.RESEND_API_URL || "https://api.resend.com").replace(/\/$/, "")}/emails`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [process.env.CONTACT_NOTIFY_TO || contactEmail],
        reply_to: lead.email,
        subject: clean(`${topics[lead.topic].label}: ${lead.name}`).slice(0, 200),
        text: lines.join("\n"),
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (res.ok) return "ok";
    console.error("contact: resend failed", res.status, (await res.text()).slice(0, 300));
    return "failed";
  } catch (err) {
    console.error("contact: resend request error", err instanceof Error ? err.message : err);
    return "failed";
  }
}

/**
 * Delivers a contact message. Each channel is optional; the message counts as delivered if at least one
 * configured channel succeeded, so a Supabase outage never loses a message that still reached the founders' inbox.
 * To use another service, change `store` or `notify`.
 */
export async function saveLead(lead: Lead, source: string): Promise<SaveResult> {
  const steps = await Promise.all([store(lead, source), notify(lead, source)]);
  const used = steps.filter((s) => s !== "skipped");
  if (!used.length) return { ok: false, reason: "not-configured" };
  return used.includes("ok") ? { ok: true } : { ok: false, reason: "failed" };
}
