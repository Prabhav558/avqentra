// The brand logo (traced to vector: public/logo.svg, cream on dark).
// data-intro-target: where the homepage logo intro (Intro.tsx) lands.
export default function Logo({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src="/logo.svg" alt="" width={292} height={36} decoding="async" data-intro-target />;
}
