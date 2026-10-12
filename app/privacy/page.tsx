import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/home/SiteHeader";
import { display, mono } from "@/lib/fonts";
import { pageMeta } from "@/lib/seo";
import { contactEmail } from "@/lib/site";
import h from "@/components/home/home.module.css";
import s from "@/components/privacy/privacy.module.css";

export const metadata: Metadata = pageMeta({ title: "Privacy policy", description: "What Avqentra collects when you contact us, why we collect it, where it is kept, how long we keep it, and how to have it removed.", path: "/privacy" });

// MOCK details below (retention period, hosting region, response times): confirm before launch.
// Still needed from the company: legal entity name, registered address, grievance officer name.
const UPDATED = "13 October 2026";

const sections = [
  {
    t: "Who we are",
    d: (
      <p>
        Avqentra is a product and engineering studio. This page covers this website and the messages sent through it.
        Write to us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>
    ),
  },
  {
    t: "What we collect",
    d: (
      <>
        <p>
          Only what you type into the contact form: your name, your email address, the topic you pick, an optional
          company name, the product you ask about (for early access), and your message. We don&rsquo;t ask for anything
          else.
        </p>
      </>
    ),
  },
  {
    t: "Why we collect it",
    d: (
      <p>
        To read your message and reply to you. We don&rsquo;t add you to a newsletter, we don&rsquo;t use your details
        for advertising, and we don&rsquo;t sell or share them.
      </p>
    ),
  },
  {
    t: "Where it is kept",
    d: (
      <>
        <p>
          Messages are stored in a Supabase database hosted in the Mumbai (ap-south-1) region, and the founders may also receive a copy by email. Our
          hosting provider may keep standard server logs, such as IP addresses and the pages requested, for security
          and reliability.
        </p>
      </>
    ),
  },
  {
    t: "Cookies and tracking",
    d: (
      <p>
        This site sets no cookies and runs no analytics, advertising or third-party tracking scripts. Your browser keeps
        one small flag for the length of your visit so the home page intro plays only once. It identifies no one and is
        deleted when you close the tab.
      </p>
    ),
  },
  {
    t: "How long we keep it",
    d: <p>Up to 12 months after your last message, then we delete it. If we start working together, we keep project records for as long as the work and our legal obligations require.</p>,
  },
  {
    t: "Your choices",
    d: (
      <p>
        You can ask to see, correct or delete what we hold about you, and to withdraw consent for us to contact you. Email{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a> from the address you used and we will act on it within 30 days. Questions or complaints go to the same address, and we reply within seven days. You may also have rights under
        applicable data protection law, such as India&rsquo;s Digital Personal Data Protection Act, 2023.
      </p>
    ),
  },
  {
    t: "Changes",
    d: <p>If we change how we handle your details, we will update this page and its date.</p>,
  },
];

export default function Privacy() {
  return (
    <div className={`home-theme ${display.variable} ${mono.variable} ${h.page}`}>
      <SiteHeader />
      <section className={s.hero} aria-labelledby="privacy-h">
        <div className={h.backdrop} aria-hidden="true" />
        <div className={h.frame} aria-hidden="true">
          <span className={`${h.ruleV} ${h.left}`} />
          <span className={`${h.ruleV} ${h.right}`} />
          <span className={`${h.ruleH} ${h.navRule} ${s.navRule}`} />
        </div>
        <div className={s.inner}>
          <div className={s.intro}>
            <p className={h.kicker}>— Privacy</p>
            <h1 className={s.title} id="privacy-h">
              <span className={s.line}>Your details,</span>
              <span className={`${s.line} ${h.gold}`}>kept short.</span>
            </h1>
            <p className={s.lede}>
              What we collect when you contact us, why, and how to have it removed. Last updated {UPDATED}.
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
