"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

// Preview build: only /events exists, so the other items do not navigate.
const NAV_LINKS = ["Home", "About Us"];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E2D9] bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
        <nav className="relative flex h-[72px] items-center justify-between">
          {/* Logo */}
          <Link href="/events" className="shrink-0">
            <Image
              src="/assets/logo/jazzhq.svg"
              alt="JazzHQ"
              width={132}
              height={32}
              priority
              className="h-8 w-auto"
            />
          </Link>

          {/* Center Navigation */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button key={link} type="button" className="text-sm font-medium text-[#131315] transition-opacity hover:opacity-70">
                {link}
              </button>
            ))}
          </div>

          {/* Right Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button type="button" className="rounded-xl bg-[#5048E5] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4039D4]">
              List Your Product
            </button>

            <button type="button" className="rounded-xl bg-[#E84545] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D43838]">
              Become a Partner
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E2D9] lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="text-xl leading-none">
              {menuOpen ? "×" : "☰"}
            </span>
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="flex flex-col gap-3 border-t border-[#E5E2D9] py-4 lg:hidden">
            {NAV_LINKS.map((link) => (
              <button key={link} type="button" className="text-sm font-medium text-[#131315]"
                onClick={() => setMenuOpen(false)}>
                {link}
              </button>
            ))}

            <button type="button" className="rounded-xl bg-[#5048E5] px-4 py-3 text-center text-sm font-semibold text-white"
              onClick={() => setMenuOpen(false)}>
              List Your Product
            </button>

            <button type="button" className="rounded-xl bg-[#E84545] px-4 py-3 text-center text-sm font-semibold text-white"
              onClick={() => setMenuOpen(false)}>
              Become a Partner
            </button>
          </div>
        )}
      </div>
    </header>
  );
}