import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/home/SiteHeader";
import { display, mono } from "@/lib/fonts";
import { pageMeta } from "@/lib/seo";
import { contactEmail } from "@/lib/site";
import h from "@/components/home/home.module.css";
import s from "@/components/privacy/privacy.module.css";

export const metadata: Metadata = pageMeta({ title: "Terms of use", description: "The terms for using the Avqentra website, how our product descriptions should be read, and how client project agreements work.", path: "/terms" });

// MOCK: general-purpose terms. Have them reviewed by a lawyer, and confirm the governing law.
const UPDATED = "13 October 2026";

const sections = [
  {
    t: "Using this site",
    d: <p>You may browse this website and contact us through it. Please don&rsquo;t misuse it, probe it for weaknesses without our written permission, or send spam.</p>,
  },
  {
    t: "Our products",
    d: <p>Our products are in development. Descriptions, features and launch dates on this site are plans, not commitments, and may change. Early access is offered at our discretion.</p>,
  },
  {
    t: "Client projects",
    d: <p>Work for clients is covered by a separate written agreement that sets scope, price, timelines and ownership. If it conflicts with these terms, the agreement wins.</p>,
  },
  {
    t: "Our content",
    d: <p>The text, design and code of this site belong to Avqentra. You may link to it and quote short extracts with credit. Please ask before copying more.</p>,
  },
  {
    t: "No warranty",
    d: <p>We work to keep this site accurate and available, but it is provided as is. To the extent the law allows, we are not liable for losses from using it.</p>,
  },
  {
    t: "Governing law",
    d: <p>These terms are governed by the laws of India. Questions go to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>,
  },
];

export default function Terms() {
  return (
    <div className={`home-theme ${display.variable} ${mono.variable} ${h.page}`}>
      <SiteHeader />
      <section className={s.hero} aria-labelledby="terms-h">
        <div className={h.backdrop} aria-hidden="true" />
        <div className={h.frame} aria-hidden="true">
          <span className={`${h.ruleV} ${h.left}`} />
          <span className={`${h.ruleV} ${h.right}`} />
          <span className={`${h.ruleH} ${h.navRule} ${s.navRule}`} />
        </div>
        <div className={s.inner}>
          <div className={s.intro}>
            <p className={h.kicker}>— Terms</p>
            <h1 className={s.title} id="terms-h">
              <span className={s.line}>Plain terms,</span>
              <span className={`${s.line} ${h.gold}`}>kept short.</span>
            </h1>
            <p className={s.lede}>
              The terms for using this website and for working with us. Last updated {UPDATED}.
            </p>
            <p className={s.back}>
              <Link href="/contact">Back to contact</Link>
            </p>
          </div>

          <ol className={s.list}>
            {sections.map((x, i) => (
              <li key={x.t}>
                <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className={h.h3s}>{x.t}</h2>
                  {x.d}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
