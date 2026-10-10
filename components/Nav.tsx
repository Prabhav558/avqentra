"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/founders", label: "Founders" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const path = usePathname();
  if (path.startsWith("/products")) {
    return (
      <header className="pnav">
        <div className="pnav-in">
          <Link className="logo" href="/" aria-label="Avqentra home">
            <svg viewBox="0 0 34 30" width="30" height="26" aria-hidden="true"><path fill="currentColor" d="M17 0 34 30H23.5L17 18.2 10.5 30H0Z"/><path fill="var(--bg)" d="M17 9.5 21.2 17H12.8Z"/></svg>
            <span>AVQENTRA</span>
          </Link>
          <ul>
            {links.slice(1).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={path.startsWith(l.href) ? "active" : undefined}>{l.label}</Link>
              </li>
            ))}
          </ul>
          <Link className="pbtn ghost" href="/contact">GET IN TOUCH <span aria-hidden="true">↗</span></Link>
        </div>
      </header>
    );
  }
  return (
    <header>
      <div className="wrap">
        <nav>
          <Link className="logo" href="/">
            Avqentra<span>.</span>
          </Link>
          <ul>
            {links.map((l) => {
              const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link href={l.href} className={active ? "active" : undefined}>
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
