// Mark + wordmark drawn as SVG: the wordmark uses bar-less Λ and spine-less Ξ glyphs
// that no web font ships, so it is hand-built on a 13px cap height.
const glyphs = [
  "M0 13 6.5 0 13 13", // Λ
  "M0 0 6 13 12 0", // V
  "M6.5 .6a6 6 0 1 0 .01 0ZM8.6 9.6l4.4 3.9", // Q
  "M0 .6h11M1.2 6.5h8.6M0 12.4h11", // Ξ
  "M.6 13V0l10.8 13V0", // N
  "M0 .6h12M6 .6V13", // T
  "M.6 13V.6h6.4a3.4 3.4 0 0 1 0 6.8H.6M6.2 7.4 11 13", // R
  "M0 13 6.5 0 13 13", // Λ
];
const ADVANCE = 19.2;

export default function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 206 30" fill="none" aria-hidden="true">
      <g fill="currentColor">
        <path d="M13.4 1h9.8L39.6 29h-9.4L19.9 10.6 17.2 15.3 15.4 12.2Z" />
        <path d="M11.6 4.1 13.4 7.2 1.9 29H0Z" />
        <path d="M14.6 9.5 16.4 12.6 6.6 29H3.8Z" />
        <path d="M21.3 23.6h3.3v3.3h-3.3Z" />
      </g>
      <g stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" transform="translate(58 8.5)">
        {glyphs.map((d, i) => (
          <path key={i} d={d} transform={`translate(${i * ADVANCE} 0)`} />
        ))}
      </g>
    </svg>
  );
}
