"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { label: "Nos services", href: "/#services" },
  { label: "Réalisations", href: "/#realisations" },
];

export default function Header({ phone }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm">

      {/* Barre utilitaire — desktop uniquement */}
      <div className="hidden md:block border-b border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-6 px-5 py-1.5">
          <a
            href={`tel:${phone.replaceAll(" ", "")}`}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338a16.128 16.128 0 0 1 4.004-1.582c.518-.124.99.21 1.09.726l.527 2.803a1.125 1.125 0 0 1-.577 1.194l-1.397.698a13.515 13.515 0 0 0 5.978 5.978l.698-1.397a1.125 1.125 0 0 1 1.194-.577l2.803.527c.516.1.85.572.726 1.09a16.128 16.128 0 0 1-1.582 4.004C17.25 20.818 14.763 22 12 22 6.477 22 2 17.523 2 12c0-2.763 1.182-5.25 3.338-6.662z" />
            </svg>
            {phone}
          </a>
          <a
            href="#contact"
            className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-hover transition"
          >
            Devis gratuit
          </a>
        </div>
      </div>

      {/* Barre principale */}
      <div className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2">
          {/* Spacer mobile pour centrer le logo */}
          <div className="w-9 md:hidden" />
          <Link href="/" className="md:contents flex justify-center flex-1 md:flex-none">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium uppercase tracking-wide text-slate-600 hover:text-slate-900 transition"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className={`block h-0.5 w-5 bg-current transition-transform duration-200 ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition-transform duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-b border-slate-200 bg-blue-100 px-5 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition border-b border-slate-100 last:border-0"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

    </header>
  );
}
