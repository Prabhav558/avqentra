import { founders } from "@/lib/founders";
import { products } from "@/lib/products";
import h from "@/components/home/home.module.css";
import s from "./founders.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Hero() {
  const stats = [
    { value: pad(founders.length), label: "Founders" },
    { value: pad(products.length), label: "Products in development" },
    { value: "01", label: "Shared standard" },
  ];

  return (
    <section className={s.hero} aria-labelledby="founders-h">
      <div className={h.backdrop} aria-hidden="true" />
      <div className={h.frame} aria-hidden="true">
        <span className={`${h.ruleV} ${h.left}`} />
        <span className={`${h.ruleV} ${h.right}`} />
        <span className={`${h.ruleH} ${h.navRule} ${s.navRule}`} />
      </div>

      <div className={s.heroInner}>
        <div>
          <p className={h.kicker}>— The founders</p>
          <h1 className={s.title} id="founders-h">
            <span style={{ "--i": 0 } as React.CSSProperties}>Three founders.</span>
            <span style={{ "--i": 1 } as React.CSSProperties} className={h.gold}>One standard.</span>
          </h1>
          <p className={s.lede}>
            Avqentra is run by the people who build it, for our own products and for every client project. Strategy,
            engineering and finance each have a clear owner, so decisions are made fast and nothing ships without
            someone accountable for it.
          </p>
        </div>

        <ol className={s.roster} aria-label="Founders">
          {founders.map((f, i) => (
            <li key={f.slug}>
              <a href={`#${f.slug}`}>
                <span className={s.rNum}>{pad(i + 1)}</span>
                <span className={s.rName}>{f.name}</span>
                <span className={s.rRole}>{f.role}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <dl className={s.stats}>
        {stats.map((st) => (
          <div key={st.label}>
            <dt>{st.value}</dt>
            <dd>{st.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
