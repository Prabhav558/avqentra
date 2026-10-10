import { products } from "@/lib/products";
import h from "@/components/home/home.module.css";
import s from "./founders.module.css";

const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const count = words[products.length] ?? String(products.length);

// "A, B, C and D" with only the names emphasised.
const list = products.map((p, i) => (
  <span key={p.slug}>
    {i > 0 && (i === products.length - 1 ? " and " : ", ")}
    <b>{p.name}</b>
  </span>
));

const chapters = [
  {
    n: "01",
    t: "The gap",
    d: (
      <>
        Most software digitizes old processes instead of rethinking them. Good ideas stall in the distance between a
        demo and <b>a product people actually rely on</b>.
      </>
    ),
  },
  {
    n: "02",
    t: "The bet",
    d: (
      <>
        A small founding team, with each side of the company owned by one person, can close that distance faster than a
        large one, <b>as long as the bar never drops</b>.
      </>
    ),
  },
  {
    n: "03",
    t: "The work",
    d: (
      <>
        {count} products launching soon: {list}. Each started from a specific problem, not a technology
        looking for a use. Alongside them, <b>we build software for clients</b>.
      </>
    ),
  },
];

export default function Story() {
  return (
    <section id="story" className={h.sec} aria-labelledby="story-h">
      <div className={`${h.secHead} ${h.reveal}`}>
        <p className={h.kicker}>— Why we started</p>
        <h2 className={h.h2} id="story-h">Built to close a gap.</h2>
      </div>

      <div className={s.story}>
        <div className={`${s.quoteCol} ${h.reveal}`}>
          <blockquote className={s.quote}>
            A smaller distance between <span className={h.gold}>ideas and reality.</span>
          </blockquote>
          <span className={s.quoteBy}>— The founding principle</span>
        </div>

        <ol className={`${s.chapters} ${h.reveal}`}>
          {chapters.map((c) => (
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
    </section>
  );
}
