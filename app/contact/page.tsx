import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/home/SiteHeader";
import ContactForm from "@/components/contact/ContactForm";
import CopyEmail from "@/components/contact/CopyEmail";
import { display, mono } from "@/lib/fonts";
import { isTopic } from "@/lib/contact";
import { products } from "@/lib/products";
import { contactEmail } from "@/lib/site";
import h from "@/components/home/home.module.css";
import s from "@/components/contact/contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a client project with Avqentra, ask for early access to a product, or write to the founders.",
};

type Props = { searchParams: Promise<{ type?: string; product?: string }> };

export default async function Contact({ searchParams }: Props) {
  const { type, product } = await searchParams;
  const names = products.map((p) => p.name);
  const initialProduct = names.find((n, i) => n === product || products[i].slug === product);

  return (
    <div className={`home-theme ${display.variable} ${mono.variable} ${h.page}`}>
      <SiteHeader />
      <section className={s.hero} aria-labelledby="contact-h">
        <div className={h.backdrop} aria-hidden="true" />
        <div className={h.frame} aria-hidden="true">
          <span className={`${h.ruleV} ${h.left}`} />
          <span className={`${h.ruleV} ${h.right}`} />
          <span className={`${h.ruleH} ${h.navRule} ${s.navRule}`} />
        </div>

        <div className={s.inner}>
          <div className={s.intro}>
            <p className={h.kicker}>— Contact</p>
            <h1 className={s.title} id="contact-h">
              <span className={s.line} style={{ "--i": 0 } as React.CSSProperties}>Get in touch.</span>
              <span className={`${s.line} ${h.gold}`} style={{ "--i": 1 } as React.CSSProperties}>A founder will reply.</span>
            </h1>
            <p className={s.lede}>
              Client projects, early access, partnerships or questions. There is no sales layer: every message reaches
              one of the three founders.
            </p>

            <div className={s.direct}>
              <span className={s.label}>Or write to us directly</span>
              <div className={s.mailRow}>
                <a className={s.mail} href={`mailto:${contactEmail}`}>{contactEmail}</a>
                <CopyEmail />
              </div>
            </div>

            <dl className={`${h.facts} ${s.facts}`}>
              <div>
                <dt>Projects</dt>
                <dd>Tell us what you&rsquo;re building and when you need it.</dd>
              </div>
              <div>
                <dt>Products</dt>
                <dd>Ask for early access to any of the four.</dd>
              </div>
              <div>
                <dt>People</dt>
                <dd><Link href="/founders">Meet the founders</Link> who read every message.</dd>
              </div>
            </dl>
          </div>

          <ContactForm productNames={names} initialTopic={isTopic(type) ? type : "general"} initialProduct={initialProduct} />
        </div>
      </section>
    </div>
  );
}
