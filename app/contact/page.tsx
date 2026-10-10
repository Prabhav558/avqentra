import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Contact</h1>
        <p>Questions, feedback or partnership ideas? Send us a note.</p>
      </div>
      <section style={{ paddingTop: 24 }}>
        <form action="mailto:prabhavkeshwar@gmail.com" method="post" encType="text/plain">
          <label>Name<input name="name" required /></label>
          <label>Email<input type="email" name="email" required /></label>
          <label>Message<textarea name="message" required /></label>
          <button className="btn primary" type="submit">Send message</button>
        </form>
      </section>
    </div>
  );
}
