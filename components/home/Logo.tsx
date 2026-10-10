// The brand logo supplied as an image (public/logo.png, transparent, cream on dark).
export default function Logo({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src="/logo.png" alt="" width={297} height={41} decoding="async" />;
}
