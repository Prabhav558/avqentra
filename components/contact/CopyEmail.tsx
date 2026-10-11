"use client";
import { useRef, useState } from "react";
import { contactEmail } from "@/lib/site";
import s from "./contact.module.css";

/** Small "copy" control next to the email address. Falls back to selecting the text if the clipboard is blocked. */
export default function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function copy() {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this email address:", contactEmail);
    }
  }

  return (
    <button type="button" className={s.copy} onClick={copy} aria-label={`Copy ${contactEmail}`}>
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
