import { decisions, founders, type Stake } from "@/lib/founders";
import h from "@/components/home/home.module.css";
import s from "./founders.module.css";

const label: Record<Stake, string> = { own: "Owns", shape: "Shapes" };

function Cell({ stake }: { stake?: Stake }) {
  if (!stake)
    return (
      <>
        <i className={s.dash} aria-hidden="true" />
        <span className={s.srOnly}>Not involved</span>
      </>
    );
  return (
    <span className={`${s.cell} ${s[stake]}`}>
      <i className={s.glyph} aria-hidden="true" />
      <span className={s.cellText}>{label[stake]}</span>
    </span>
  );
}

export default function Ownership() {
  return (
    <section id="ownership" className={h.sec} aria-labelledby="ownership-h">
      <div className={`${h.secHead} ${h.reveal}`}>
        <p className={h.kicker}>— Ownership</p>
        <h2 className={h.h2} id="ownership-h">Who decides what.</h2>
        <p className={h.sub}>
          Every decision has exactly one owner. Others shape it, but one person is accountable for the call. If you
          need an answer, this is who to ask.
        </p>
      </div>

      <div className={`${s.matrixWrap} ${h.reveal}`}>
        <table className={s.matrix}>
          <caption className={s.srOnly}>Decision ownership across the founding team</caption>
          <thead>
            <tr>
              <th scope="col">
                <span className={s.colRole}>Decision area</span>
              </th>
              {founders.map((f) => (
                <th scope="col" key={f.slug}>
                  <span className={s.colName}>{f.name.split(" ")[0]}</span>
                  <span className={s.colRole}>{f.role}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {decisions.map((d) => (
              <tr key={d.area}>
                <th scope="row">{d.area}</th>
                {founders.map((f) => (
                  <td key={f.slug}>
                    <Cell stake={d.stakes[f.slug]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className={s.legend} aria-hidden="true">
          <span className={`${s.cell} ${s.own}`}><i className={s.glyph} />Owns — accountable for the call</span>
          <span className={`${s.cell} ${s.shape}`}><i className={s.glyph} />Shapes — consulted first</span>
        </div>
      </div>
    </section>
  );
}
