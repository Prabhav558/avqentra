import Link from "next/link";
import { founders } from "@/lib/founders";
import h from "@/components/home/home.module.css";
import Arrow from "./Arrow";
import s from "./about.module.css";

export default function Team() {
  return (
    <section id="team" className={h.sec} aria-labelledby="team-h">
      <div className={`${s.team} ${h.reveal}`}>
        <div>
          <p className={h.kicker}>— The founders</p>
          <h2 className={h.h2} id="team-h">Run by the people who build it.</h2>
          <p className={h.sub}>
            Three founders, each accountable for one side of the company. Every message you send reaches one of them.
          </p>
          <div className={s.teamCta}>
            <Link href="/founders" className={`${h.btn} ${h.btnGhost}`}>
              Meet the founders <Arrow />
            </Link>
          </div>
        </div>

        <ol className={s.rows} aria-label="Founders">
          {founders.map((f, i) => (
            <li key={f.slug}>
              <Link href={`/founders#${f.slug}`}>
                <span className={s.rNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.rName}>{f.name}</span>
                <span className={s.rRole}>{f.role}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
