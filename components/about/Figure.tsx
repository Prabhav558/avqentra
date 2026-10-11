import s from "./about.module.css";

/** Blueprint plate: gradient panel, grid mask, corner ticks and a numbered caption (DESIGN.md §5). */
export default function Figure({ n, caption, children }: { n: string; caption: string; children: React.ReactNode }) {
  return (
    <figure className={s.fig}>
      <span className={`${s.corner} ${s.c1}`} aria-hidden="true" />
      <span className={`${s.corner} ${s.c2}`} aria-hidden="true" />
      <span className={`${s.corner} ${s.c3}`} aria-hidden="true" />
      <span className={`${s.corner} ${s.c4}`} aria-hidden="true" />
      <div className={s.figBody}>{children}</div>
      <figcaption className={s.figCap}>
        <span>Fig. {n}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
