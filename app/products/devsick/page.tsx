import type { Metadata } from "next";
import Link from "next/link";
import { getProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "Devsick - AI-powered incident reasoning",
  description: "Detect, explain, and guide resolution of application failures.",
};

export default function DevsickPage() {
  const p = getProduct("devsick");
  
  return (
    <div style={{ backgroundColor: "#000", color: "#ededed", minHeight: "100vh", paddingBottom: "64px" }}>
      <style>{`
        body { background: #000 !important; color: #ededed !important; }
        .vercel-btn {
          background-color: #ededed;
          color: #000;
          padding: 10px 24px;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .vercel-btn:hover {
          background-color: #fff;
        }
        .vercel-btn-secondary {
          background-color: transparent;
          color: #ededed;
          padding: 10px 24px;
          border-radius: 6px;
          font-weight: 500;
          border: 1px solid #333;
          transition: all 0.2s ease;
        }
        .vercel-btn-secondary:hover {
          background-color: #111;
          border-color: #444;
        }
        .vercel-card {
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 24px;
          transition: border-color 0.2s ease;
        }
        .vercel-card:hover {
          border-color: #555;
        }
      `}</style>

      <div className="wrap" style={{ paddingTop: "80px" }}>
        <div style={{ display: "inline-block", border: "1px solid #333", padding: "4px 12px", borderRadius: "99px", fontSize: "14px", marginBottom: "24px", color: "#a1a1aa" }}>
          Enterprise-grade Reliability
        </div>
        
        <h1 style={{ fontSize: "clamp(48px, 8vw, 80px)", letterSpacing: "-0.04em", margin: "0 0 24px", lineHeight: "1" }}>
          Incident reasoning,<br />
          <span style={{ background: "linear-gradient(180deg, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            powered by AI.
          </span>
        </h1>
        
        <p style={{ fontSize: "20px", color: "#a1a1aa", maxWidth: "600px", margin: "0 0 40px", lineHeight: "1.5" }}>
          Devsick sits on top of your monitoring tools to detect, explain, and guide resolution of application failures. It correlates logs and identifies root causes using LLM-based reasoning.
        </p>

        <div style={{ display: "flex", gap: "16px", marginBottom: "80px" }}>
          <Link href="https://github.com/yashsrivastava1408/DevSick" className="vercel-btn">
            View on GitHub
          </Link>
          <Link href="/contact" className="vercel-btn-secondary">
            Request Demo
          </Link>
        </div>
      </div>

      <div className="wrap">
        <h2 style={{ fontSize: "32px", letterSpacing: "-0.02em", marginBottom: "32px" }}>Features</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          <div className="vercel-card">
            <h3 style={{ fontSize: "20px", margin: "0 0 12px" }}>LLM Root Cause Analysis</h3>
            <p style={{ color: "#a1a1aa", margin: 0, fontSize: "16px", lineHeight: "1.5" }}>
              Automatically ingests logs and traces to pinpoint exactly what went wrong and why, saving hours of manual debugging.
            </p>
          </div>
          <div className="vercel-card">
            <h3 style={{ fontSize: "20px", margin: "0 0 12px" }}>Human-in-the-loop</h3>
            <p style={{ color: "#a1a1aa", margin: 0, fontSize: "16px", lineHeight: "1.5" }}>
              Provides actionable remediation workflows. You make the final call while AI drafts the fix and executes the playbook.
            </p>
          </div>
          <div className="vercel-card">
            <h3 style={{ fontSize: "20px", margin: "0 0 12px" }}>Monitoring Integration</h3>
            <p style={{ color: "#a1a1aa", margin: 0, fontSize: "16px", lineHeight: "1.5" }}>
              Connects directly to Datadog, New Relic, and other standard observability platforms without requiring complex setup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
