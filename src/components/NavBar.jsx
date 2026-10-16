import React, { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight, ShoppingBag } from "lucide-react";
import { basket, useBasket } from "../lib/basket.js";
import { href } from "../lib/router.js";
import { BRAND } from "../config.js";

const LINKS = [
  ["collections", "Collections"],
  ["lookbook", "Lookbook"],
  ["custom", "Custom Orders"],
  ["about", "About"],
  ["contact", "Contact"],
  ["admin", "Staff Login"],
];

export default function NavBar({ path }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useBasket();
  const bag = (
    <button
      onClick={() => basket.open()}
      aria-label={`Open basket, ${count} items`}
      className="relative grid h-11 w-11 place-items-center rounded-full border border-white/20 transition hover:border-sun hover:text-sun"
    >
      <ShoppingBag size={19} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-sun px-1 text-[0.65rem] font-extrabold text-ink">
          {count}
        </span>
      )}
    </button>
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || open ? "bg-ink/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
        <a href={href()} className="flex items-center gap-3" aria-label={`${BRAND.name} home`}>
          <img
            src="/images/badge-logo.jpg"
            alt=""
            className="h-10 w-10 rounded-full object-cover ring-1 ring-white/20"
          />
          <span className="font-display text-xl font-extrabold tracking-[0.18em]">LETLAKA</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {LINKS.map(([to, label]) => (
            <a
              key={to}
              href={href(to)}
              className={`text-sm font-semibold transition-colors hover:text-sun ${
                path === to ? "text-sun" : "text-bone/80"
              }`}
            >
              {label}
            </a>
          ))}
          {bag}
          <a href={href("custom")} className="btn-sun !px-5 !py-2.5">
            Get a quote <ArrowUpRight size={16} />
          </a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
        {bag}
        <button
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        </div>
      </div>

    </header>
      {open && (
        <div className="fixed inset-x-0 top-[72px] bottom-0 z-30 overflow-y-auto bg-ink px-5 pb-10 pt-8 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {LINKS.map(([to, label]) => (
              <a
                key={to}
                href={href(to)}
                className={`border-b border-white/10 py-5 font-display text-3xl font-extrabold ${
                  path === to ? "text-sun" : "text-bone"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
          <a href={href("custom")} className="btn-sun mt-8 w-full">
            Get a quote <ArrowUpRight size={16} />
          </a>
        </div>
      )}
    </>
  );
}
