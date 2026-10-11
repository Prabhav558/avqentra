"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./home/Logo";
import { display, mono } from "@/lib/fonts";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/founders", label: "Founders" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  // close the mobile menu on navigation and on Escape
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);
  // These pages render their own SiteHeader.
  if (path === "/" || path === "/founders" || path === "/about" || path === "/contact" || path === "/privacy") return null;
  if (path.startsWith("/products")) {
    const items = links.filter((l) => l.href !== "/" && l.href !== "/about");
    return (
      <header className={`pnav ${display.variable} ${mono.variable}${open ? " open" : ""}`}>
        <div className="pnav-in">
          <Link className="logo" href="/" aria-label="Avqentra home">
            <Logo className="plogo" />
          </Link>
          <ul>
            {items.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={path.startsWith(l.href) ? "active" : undefined}>{l.label}</Link>
              </li>
            ))}
          </ul>
          <Link className="pbtn ghost" href="/contact">GET IN TOUCH <span aria-hidden="true">↗</span></Link>
          <button type="button" className="pnav-toggle" aria-expanded={open} aria-controls="pnav-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
            <i aria-hidden="true" />
          </button>
        </div>
        <nav id="pnav-menu" className="pnav-menu" aria-label="Main" hidden={!open}>
          {items.map((l) => (
            <Link key={l.href} href={l.href} className={path.startsWith(l.href) ? "active" : undefined}>{l.label}<span aria-hidden="true">→</span></Link>
          ))}
        </nav>
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
