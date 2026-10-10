"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import s from "./home.module.css";

const links = [
  { href: "/products", label: "Products" },
  { href: "/founders", label: "Founders" },
  { href: "/about", label: "About" },
];

function Arrow() {
  return (
    <svg className={s.arrow} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 10 10 2M3.5 2H10v6.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => {
    if (menu.current) menu.current.open = false;
  };

  return (
    <header className={s.header} data-scrolled={scrolled}>
      <Link href="/" className={s.brand} aria-label="Avqentra home">
        <Logo className={s.logo} />
      </Link>
      <nav className={s.nav} aria-label="Primary">
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <span className={s.navDivider} aria-hidden="true" />
      <Link href="/contact" className={`${s.btn} ${s.btnNav}`}>
        Let&rsquo;s talk <Arrow />
      </Link>
      <details className={s.menu} ref={menu}>
        <summary aria-label="Menu">
          <i />
          <i />
        </summary>
        <ul onClick={closeMenu}>
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
          <li>
            <Link href="/contact" className={s.menuCta}>
              Let&rsquo;s talk &#8599;
            </Link>
          </li>
        </ul>
      </details>
    </header>
  );
}
