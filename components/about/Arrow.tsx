import h from "@/components/home/home.module.css";

export default function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={`${h.arrow} ${className}`} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 10 10 2M3.5 2H10v6.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
