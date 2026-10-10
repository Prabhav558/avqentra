import type { Metadata } from "next";
import { founders } from "@/lib/founders";

export const metadata: Metadata = {
  title: "Founders",
  description: "Meet the founders of Avqentra.",
};

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("");

export default function Founders() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Founders</h1>
        <p>The team behind Avqentra.</p>
      </div>
      <section style={{ paddingTop: 24 }}>
        <div className="grid">
          {founders.map((f) => (
            <div className="card" key={f.name}>
              <div className="avatar" aria-hidden="true">{initials(f.name)}</div>
              <span className="tag">{f.role}</span>
              <h3>{f.name}</h3>
              <p>{f.title}</p>
              <a className="more" href={`https://${f.site}`} target="_blank" rel="noopener noreferrer">
                {f.site} &rarr;
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
