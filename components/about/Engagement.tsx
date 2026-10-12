import h from "@/components/home/home.module.css";
import s from "./about.module.css";

// MOCK figures (team size, timelines, commitments): confirm before launch.
const terms = [
  { dt: "Team", dd: "Three to four people on every project, led by a founder. One point of contact, no handoffs." },
  { dt: "Timeline", dd: "Most projects run 6 to 12 weeks from kickoff to launch." },
  { dt: "Pricing", dd: "Fixed scope and price for defined work. A monthly retainer for ongoing work." },
  { dt: "Updates", dd: "A short written update every week and a working demo every two weeks." },
];

const stages = [
  { n: "01", t: "Scope", d: "A call and a written brief covering the problem, the users, the constraints, and a fixed scope and price. Usually within a week." },
  { n: "02", t: "Build", d: "Two-week cycles, each ending in a working demo you can use and review." },
  { n: "03", t: "Launch", d: "We deploy, monitor the first weeks, and hand over code, documentation and access." },
  { n: "04", t: "Support", d: "Optional monthly support for fixes and improvements after launch." },
];

const safeguards = [
  { dt: "Your data stays yours", dd: "We don’t use client data or code to train AI models." },
  { dt: "Limited access", dd: "Only the people on your project, through named accounts with two-factor sign-in." },
  { dt: "Encrypted in transit", dd: "All traffic runs over HTTPS. We can work inside your own cloud accounts." },
  { dt: "Under NDA", dd: "We sign your NDA before we see anything sensitive." },
];

export default function Engagement() {
  return (
    <section id="engagement" className={h.sec} aria-labelledby="engagement-h">
      <div className={`${h.secHead} ${h.reveal}`}>
        <p className={h.kicker}>— Working with us</p>
        <h2 className={h.h2} id="engagement-h">How an engagement works.</h2>
        <p className={h.sub}>A small senior team keeps projects simple to run and easy to follow.</p>
      </div>

      <div className={s.standards}>
        <div className={h.reveal}>
          <dl className={h.facts}>
            {terms.map((t) => (
              <div key={t.dt}>
                <dt>{t.dt}</dt>
                <dd>{t.dd}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ol className={`${s.chapters} ${h.reveal}`}>
          {stages.map((c) => (
            <li key={c.n}>
              <span className={s.chNum}>{c.n}</span>
              <div>
                <h3 className={h.h3s}>{c.t}</h3>
                <p>{c.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className={`${h.secHead} ${h.reveal}`} id="security" style={{ marginTop: 96 }}>
        <p className={h.kicker}>— Data and security</p>
        <h3 className={h.h2}>Your work stays protected.</h3>
        <dl className={h.facts}>
          {safeguards.map((t) => (
            <div key={t.dt}>
              <dt>{t.dt}</dt>
              <dd>{t.dd}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
