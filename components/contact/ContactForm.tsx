"use client";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import h from "@/components/home/home.module.css";
import { contactEmail, responseTime } from "@/lib/site";
import { limits, topicKeys, topics, validate, type Errors, type Field, type Lead, type Topic } from "@/lib/contact";
import s from "./contact.module.css";

type Props = { productNames: string[]; initialTopic: Topic; initialProduct?: string };
type Status = "idle" | "sending" | "sent" | "unavailable" | "error";

function Arrow() {
  return (
    <svg className={h.arrow} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 10 10 2M3.5 2H10v6.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export default function ContactForm({ productNames, initialTopic, initialProduct }: Props) {
  const uid = useId();
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [values, setValues] = useState({ name: "", email: "", company: "", product: initialProduct ?? productNames[0] ?? "", message: "", website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverErrors, setServerErrors] = useState(false);
  const summary = useRef<HTMLDivElement>(null);
  const t = topics[topic];
  const busy = status === "sending";

  const lead = (): Lead => ({
    topic,
    name: values.name,
    email: values.email,
    company: topic === "project" ? values.company : "",
    product: topic === "early-access" ? values.product : "",
    message: values.message,
  });

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (k !== "website" && errors[k as Field]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  // Opens the visitor's own email app with their message filled in. Used whenever the site can't send it.
  const mailto = () => {
    const l = lead();
    const body = [l.message, "", `— ${l.name}${l.company ? `, ${l.company}` : ""}`, l.email, l.product ? `Product: ${l.product}` : ""].filter((x) => x !== "").join("\n");
    return `mailto:${contactEmail}?subject=${encodeURIComponent(`${topics[l.topic].label}: ${l.name || "new message"}`)}&body=${encodeURIComponent(body)}`;
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const check = validate(lead());
    if (!check.ok) {
      setErrors(check.errors);
      setStatus("idle");
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    setErrors({});
    setServerErrors(false);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...check.value, website: values.website }),
      });
      if (res.ok) return setStatus("sent");
      const data = await res.json().catch(() => ({}));
      if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setServerErrors(true);
        setStatus("idle");
        return requestAnimationFrame(() => summary.current?.focus());
      }
      setStatus(res.status === 503 ? "unavailable" : "error");
    } catch {
      setStatus("error");
    }
  }

  const reset = () => {
    setValues((v) => ({ ...v, message: "", website: "" }));
    setStatus("idle");
  };

  if (status === "sent") {
    return (
      <div className={s.plate}>
        <Corners />
        <div className={s.done} role="status">
          <p className={s.eyebrow}>— Sent</p>
          <h2 className={s.doneTitle}>Message <span className={h.gold}>received.</span></h2>
          <p className={h.sub}>A founder will reply to {values.email} within {responseTime}. If it&rsquo;s urgent, you can also write to {contactEmail}.</p>
          <div className={s.doneActions}>
            <button type="button" className={`${h.btn} ${h.btnGhost}`} onClick={reset}>Send another <Arrow /></button>
          </div>
        </div>
      </div>
    );
  }

  const errorList = (Object.entries(errors) as [Field, string | undefined][]).filter(([, m]) => m);
  const id = (k: string) => `${uid}-${k}`;
  const fieldProps = (k: Field) => ({
    id: id(k),
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${id(k)}-err` : undefined,
    disabled: busy,
  });
  const Err = ({ k }: { k: Field }) => (errors[k] ? <span className={s.err} id={`${id(k)}-err`}>{errors[k]}</span> : null);

  return (
    <div className={s.plate}>
      <Corners />
      <form className={s.form} onSubmit={onSubmit} noValidate aria-busy={busy}>
        <fieldset className={s.topics} disabled={busy}>
          <legend className={s.label}>What is this about?</legend>
          <div className={s.topicRow}>
            {topicKeys.map((k) => (
              <label key={k} className={s.topic} data-on={topic === k}>
                <input type="radio" name="topic" value={k} checked={topic === k} onChange={() => setTopic(k)} />
                <span>{topics[k].label}</span>
              </label>
            ))}
          </div>
          <p className={s.help}>{t.intro}</p>
        </fieldset>

        {errorList.length > 0 && (
          <div ref={summary} tabIndex={-1} className={s.summary} role="alert">
            <b>{serverErrors ? "The server couldn't accept this yet." : "A few things need another look."}</b>
            <ul>
              {errorList.map(([k, m]) => (
                <li key={k}><a href={`#${id(k)}`}>{m}</a></li>
              ))}
            </ul>
          </div>
        )}

        <div className={s.row}>
          <div className={s.field}>
            <label className={s.label} htmlFor={id("name")}>Name</label>
            <input {...fieldProps("name")} name="name" autoComplete="name" required maxLength={limits.name} value={values.name} onChange={set("name")} />
            <Err k="name" />
          </div>
          <div className={s.field}>
            <label className={s.label} htmlFor={id("email")}>Email</label>
            <input {...fieldProps("email")} name="email" type="email" autoComplete="email" inputMode="email" required maxLength={limits.email} value={values.email} onChange={set("email")} />
            <Err k="email" />
          </div>
        </div>

        {topic === "project" && (
          <div className={s.field}>
            <label className={s.label} htmlFor={id("company")}>Company <i>optional</i></label>
            <input {...fieldProps("company")} name="company" autoComplete="organization" maxLength={limits.company} value={values.company} onChange={set("company")} />
            <Err k="company" />
          </div>
        )}

        {topic === "early-access" && (
          <div className={s.field}>
            <label className={s.label} htmlFor={id("product")}>Product</label>
            <select {...fieldProps("product")} name="product" value={values.product} onChange={set("product")}>
              {productNames.map((n) => <option key={n}>{n}</option>)}
            </select>
            <Err k="product" />
          </div>
        )}

        <div className={s.field}>
          <label className={s.label} htmlFor={id("message")}>{t.prompt}</label>
          <textarea {...fieldProps("message")} name="message" required rows={6} maxLength={limits.message} value={values.message} onChange={set("message")} placeholder={t.hint} />
          <span className={s.count} aria-hidden="true">{values.message.length} / {limits.message}</span>
          <Err k="message" />
        </div>

        {/* honeypot: hidden from people and assistive tech; bots fill it in */}
        <div className={s.trap} aria-hidden="true">
          <label>Leave this empty<input tabIndex={-1} autoComplete="off" name="website" value={values.website} onChange={set("website")} /></label>
        </div>

        <div className={s.actions}>
          <button type="submit" className={`${h.btn} ${h.btnSolid}`} disabled={busy}>
            {busy ? "Sending…" : "Send message"} <Arrow />
          </button>
          <p className={s.fine}>Goes straight to the founders. No newsletter, no sales team. See our <Link href="/privacy">privacy note</Link>.</p>
        </div>

        <div className={s.result} role="status" aria-live="polite">
          {status === "unavailable" && (
            <p>We can&rsquo;t send this from the site right now. <a href={mailto()}>Open it in your email app</a> or write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
          )}
          {status === "error" && (
            <p>Something went wrong and your message was not sent. Try again, or <a href={mailto()}>send it from your email app</a>.</p>
          )}
        </div>
      </form>
    </div>
  );
}

function Corners() {
  return (
    <>
      <span className={`${s.corner} ${s.c1}`} aria-hidden="true" />
      <span className={`${s.corner} ${s.c2}`} aria-hidden="true" />
      <span className={`${s.corner} ${s.c3}`} aria-hidden="true" />
      <span className={`${s.corner} ${s.c4}`} aria-hidden="true" />
    </>
  );
}
