import Link from "next/link";
import { getProduct } from "@/lib/products";
import h from "@/components/home/home.module.css";
import Arrow from "./Arrow";
import Figure from "./Figure";
import s from "./about.module.css";

const checks = [
  {
    id: "measure",
    verb: "Measure",
    slug: "agentbattle",
    line: "Put AI agents on the same tasks under the same conditions and score them, so you compare results instead of demos.",
  },
  {
    id: "explain",
    verb: "Explain",
    slug: "devsick",
    line: "Find why an application failed, with a root cause and a confidence score. A person makes the final call on the fix.",
  },
  {
    id: "verify",
    verb: "Verify",
    slug: "questionforge",
    line: "Check every question an LLM writes, by running the code or by independent review, before a human reviews it.",
  },
];

const ledger = [
  { claim: "“This agent is the best.”", check: "Measure", how: "Scored on identical tasks" },
  { claim: "“The database caused it.”", check: "Explain", how: "Root cause with a confidence score" },
  { claim: "“This question is correct.”", check: "Verify", how: "Run the code, then review it" },
];

export default function Thesis() {
  const ops = getProduct("ops-academy");
  return (
    <section id="thesis" className={h.sec} aria-labelledby="thesis-h">
      <div className={`${s.headSplit} ${h.reveal}`}>
        <div>
          <p className={h.kicker}>— What we are</p>
          <h2 className={h.h2} id="thesis-h">
            Tools that make AI <span className={h.gold}>checkable.</span>
          </h2>
          <p className={h.sub}>
            AI is easy to demo and hard to trust. Our products exist to close that gap, each in a different way.
          </p>
        </div>

        <Figure n="01" caption="Claims and the checks that answer them">
          <table className={s.ledger}>
            <caption className={s.srOnly}>Claims and the checks that answer them</caption>
            <thead>
              <tr>
                <th scope="col">The claim</th>
                <th scope="col">The check</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((r) => (
                <tr key={r.check}>
                  <td>{r.claim}</td>
                  <td>
                    <b>{r.check}</b>
                    {r.how}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Figure>
      </div>

      <ol className={`${s.verbs} ${h.reveal}`}>
        {checks.map((c, i) => {
          const p = getProduct(c.slug)!;
          return (
            <li key={c.id} id={c.id}>
              <span className={h.pNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={h.h3s}>{c.verb}</h3>
              <p className={h.body}>{c.line}</p>
              <Link href={`/products/${p.slug}`} className={s.verbLink}>
                {p.name} <Arrow />
              </Link>
            </li>
          );
        })}
      </ol>

      {ops && (
        <div className={`${s.people} ${h.reveal}`}>
          <div>
            <p className={h.kicker}>— And the people side</p>
            <h3 className={h.h3s}>{ops.name}</h3>
          </div>
          <div>
            <p className={h.body}>
              The same idea applied to people: live terminal labs and visible progress show that someone can do the
              work, not only that they read about it.
            </p>
            <Link href={`/products/${ops.slug}`} className={s.verbLink}>
              Explore {ops.name} <Arrow />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
