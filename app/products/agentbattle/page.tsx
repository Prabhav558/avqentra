import type { Metadata } from "next";
import Link from "next/link";
import { getProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "AgentBattle: AI agent evaluation",
  description: "A head-to-head arena for testing and comparing AI agents. Launching soon.",
};

export default function AgentBattlePage() {
  const p = getProduct("agentbattle");
  
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
          Launching soon · AI Agent Evaluation
        </div>
        
        <h1 style={{ fontSize: "clamp(48px, 8vw, 80px)", letterSpacing: "-0.04em", margin: "0 0 24px", lineHeight: "1" }}>
          Don't trust demos.<br />
          <span style={{ background: "linear-gradient(180deg, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Trust data.
          </span>
        </h1>
        
        <p style={{ fontSize: "20px", color: "#a1a1aa", maxWidth: "600px", margin: "0 0 40px", lineHeight: "1.5" }}>
          AgentBattle is a head-to-head arena for AI agents. Run agents on the same tasks under the same conditions and compare results objectively.
        </p>

        <div style={{ display: "flex", gap: "16px", marginBottom: "80px" }}>
          <Link href="https://github.com/yashsrivastava1408/AgentBattle" className="vercel-btn">
            View on GitHub
          </Link>
          <Link href="/contact?type=early-access&product=agentbattle" className="vercel-btn-secondary">
            Get early access
          </Link>
        </div>
      </div>

      <div className="wrap">
        <h2 style={{ fontSize: "32px", letterSpacing: "-0.02em", marginBottom: "32px" }}>Arena Capabilities</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          <div className="vercel-card">
            <h3 style={{ fontSize: "20px", margin: "0 0 12px" }}>Side-by-side Comparisons</h3>
            <p style={{ color: "#a1a1aa", margin: 0, fontSize: "16px", lineHeight: "1.5" }}>
              Evaluate multiple agents on identical tasks to cut through the marketing noise and find the right model for your use case.
            </p>
          </div>
          <div className="vercel-card">
            <h3 style={{ fontSize: "20px", margin: "0 0 12px" }}>Repeatable & Scored</h3>
            <p style={{ color: "#a1a1aa", margin: 0, fontSize: "16px", lineHeight: "1.5" }}>
              Every battle is conducted in a deterministic environment with a rigorous scoring system, providing clear results you can act on.
            </p>
          </div>
          <div className="vercel-card">
            <h3 style={{ fontSize: "20px", margin: "0 0 12px" }}>Extensible Tasks</h3>
            <p style={{ color: "#a1a1aa", margin: 0, fontSize: "16px", lineHeight: "1.5" }}>
              Bring your own tasks or use our built-in benchmarks ranging from coding challenges to web navigation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
