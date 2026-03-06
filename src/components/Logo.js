import Image from "next/image";

export default function Logo({ className = "h-24 w-auto" }) {
  return (
    <Image
      src="/images/logo.png"
      alt="M.A Rénov — Portail & Menuiserie"
      width={1705}
      height={1665}
      className={className}
      priority
      unoptimized
    />
  );
}
