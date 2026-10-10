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
  // These pages render their own SiteHeader.
  if (path === "/" || path === "/founders") return null;
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
