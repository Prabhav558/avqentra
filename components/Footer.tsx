import Link from "next/link";

const explore = [
  { href: "/products", label: "Products" },
  { href: "/products/agentbattle", label: "AgentBattle" },
  { href: "/products/devsick", label: "DevSick" },
  { href: "/products/questionforge", label: "QuestionForge" },
  { href: "/products/ops-academy", label: "Ops Academy" },
];

const company = [
  { href: "/about", label: "About" },
  { href: "/founders", label: "Founders" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link href="/" className="site-footer-logo">
            Avqentra
          </Link>
          <p>A technology company building software for what&rsquo;s next.</p>
        </div>
        <div role="group" aria-label="Explore" className="site-footer-col">
          <h2>Explore</h2>
          <ul>
            {explore.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div role="group" aria-label="Company" className="site-footer-col">
          <h2>Company</h2>
          <ul>
            {company.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="site-footer-bar">
        <span>&copy; {new Date().getFullYear()} Avqentra. All rights reserved.</span>
      </div>
    </footer>
  );
}
