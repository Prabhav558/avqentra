import { founders, type Founder } from "@/lib/founders";
import h from "@/components/home/home.module.css";
import s from "./founders.module.css";

const pad = (n: number) => String(n).padStart(2, "0");
const initials = (name: string) => name.split(" ").map((w) => w[0]).join("");

function Arrow() {
  return (
    <svg className={h.arrow} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 10 10 2M3.5 2H10v6.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function Plate({ f, n }: { f: Founder; n: number }) {
  return (
    <div className={s.plate}>
      {f.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={f.photo} alt={f.name} loading="lazy" />
      ) : (
        <span className={s.mono} aria-hidden="true">{initials(f.name)}</span>
      )}
      <i className={s.corner} aria-hidden="true" />
      <i className={s.corner} aria-hidden="true" />
      <i className={s.corner} aria-hidden="true" />
      <i className={s.corner} aria-hidden="true" />
      <span className={s.plateCap} aria-hidden="true">
        <span>Fig. {pad(n)}</span>
        <span>{f.role}</span>
      </span>
    </div>
  );
}

export default function Profiles() {
  return (
    <section id="profiles" className={h.sec} aria-labelledby="profiles-h">
      <div className={`${h.secHead} ${h.reveal}`}>
        <p className={h.kicker}>— Profiles</p>
        <h2 className={h.h2} id="profiles-h">The people accountable.</h2>
        <p className={h.sub}>Every part of the company has a single owner. Here is who owns what.</p>
      </div>

      <ol className={s.profiles}>
        {founders.map((f, i) => (
          <li key={f.slug} id={f.slug} className={`${s.profile} ${h.reveal}`}>
            <Plate f={f} n={i + 1} />
            <div className={s.pBody}>
              <div className={s.pHead}>
                <span className={s.pNum}>{pad(i + 1)}</span>
                <span className={s.pTitle}>{f.title}</span>
              </div>
              <h3 className={s.pName}>{f.name}</h3>
              <p className={s.pFocus}>{f.focus}</p>
              {f.bio && <p className={s.pBio}>{f.bio}</p>}

              <span className={s.ownsLabel}>Owns</span>
              <ul className={s.owns}>
                {f.owns.map((o) => <li key={o}>{o}</li>)}
              </ul>

              <div className={s.pLinks}>
                <a className={`${h.btn} ${h.btnGhost}`} href={`https://${f.site}`} target="_blank" rel="noopener noreferrer">
                  {f.site} <Arrow />
                </a>
                {f.linkedin && (
                  <a className={`${h.btn} ${h.btnGhost}`} href={f.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn <Arrow />
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
