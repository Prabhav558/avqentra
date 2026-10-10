import type { Metadata } from "next";
import Link from "next/link";
import { getProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "QuestionForge: technical interview questions",
  description: "Generate, validate and export technical interview questions. Launching soon.",
};

export default function QuestionForgePage() {
  const p = getProduct("questionforge");
  
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
          Launching soon · Open source
        </div>
        
        <h1 style={{ fontSize: "clamp(48px, 8vw, 80px)", letterSpacing: "-0.04em", margin: "0 0 24px", lineHeight: "1" }}>
          Forge better questions,<br />
          <span style={{ background: "linear-gradient(180deg, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            faster.
          </span>
        </h1>
        
        <p style={{ fontSize: "20px", color: "#a1a1aa", maxWidth: "600px", margin: "0 0 40px", lineHeight: "1.5" }}>
          Designed for enterprise HR and university placement teams to generate, rigorously validate, and export technical interview questions across DSA, OOP, System Design, and SQL.
        </p>

        <div style={{ display: "flex", gap: "16px", marginBottom: "80px" }}>
          <Link href="https://github.com/yashsrivastava1408/QuestionForge" className="vercel-btn">
            View on GitHub
          </Link>
          <Link href="/contact?type=early-access&product=questionforge" className="vercel-btn-secondary">
            Get early access
          </Link>
        </div>
      </div>

      <div className="wrap">
        <h2 style={{ fontSize: "32px", letterSpacing: "-0.02em", marginBottom: "32px" }}>Platform Capabilities</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          <div className="vercel-card">
            <h3 style={{ fontSize: "20px", margin: "0 0 12px" }}>Technical Domains</h3>
            <p style={{ color: "#a1a1aa", margin: 0, fontSize: "16px", lineHeight: "1.5" }}>
              Cover everything from Data Structures and Algorithms to System Design, Object-Oriented Programming, and advanced SQL queries.
            </p>
          </div>
          <div className="vercel-card">
            <h3 style={{ fontSize: "20px", margin: "0 0 12px" }}>Rigorous Validation</h3>
            <p style={{ color: "#a1a1aa", margin: 0, fontSize: "16px", lineHeight: "1.5" }}>
              Every generated question is checked for correctness, edge cases, and clarity, ensuring a high signal-to-noise ratio in interviews.
            </p>
          </div>
          <div className="vercel-card">
            <h3 style={{ fontSize: "20px", margin: "0 0 12px" }}>Seamless Exports</h3>
            <p style={{ color: "#a1a1aa", margin: 0, fontSize: "16px", lineHeight: "1.5" }}>
              Export question sets in formats ready for your Applicant Tracking System or internal wiki with a single click.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
