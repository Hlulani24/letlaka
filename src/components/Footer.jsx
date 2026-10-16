import React from "react";
import { Phone, Instagram, Facebook, MessageCircle, Link2 } from "lucide-react";
import { href } from "../lib/router.js";
import { BRAND, EXTRA_SOCIALS, PHONES, SOCIALS, waLink } from "../config.js";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-12 md:px-8">
        <p
          aria-hidden="true"
          className="outline-text mb-12 select-none overflow-hidden whitespace-nowrap text-center font-display font-extrabold leading-none tracking-tight"
        >
          LETLAKA
        </p>
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/images/badge-logo.jpg"
                alt={`${BRAND.name} — established ${BRAND.established}`}
                className="h-14 w-14 rounded-full object-cover"
              />
              <span className="font-display text-2xl font-extrabold tracking-[0.18em]">LETLAKA</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-bone/60">
              Hoodies, tracksuits, tees, knitwear, headwear and custom club kit. Established{" "}
              {BRAND.established}.
            </p>
          </div>

          <div>
            <h4 className="eyebrow text-sun">Explore</h4>
            <ul className="mt-5 space-y-3 text-sm text-bone/70">
              {[
                ["collections", "Collections"],
                ["lookbook", "Lookbook"],
                ["custom", "Custom orders"],
                ["about", "Our story"],
                ["contact", "Contact"],
              ].map(([to, label]) => (
                <li key={to}>
                  <a href={href(to)} className="transition-colors hover:text-sun">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-sun">Shop by</h4>
            <ul className="mt-5 space-y-3 text-sm text-bone/70">
              {["Hoodies & Sets", "Crewnecks", "Tees", "Polos & Kit", "Knitwear", "Headwear"].map((c) => (
                <li key={c}>
                  <a
                    href={href(`collections?cat=${encodeURIComponent(c)}`)}
                    className="transition-colors hover:text-sun"
                  >
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-sun">Talk to us</h4>
            <ul className="mt-5 space-y-3 text-sm text-bone/70">
              {PHONES.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className="inline-flex items-center gap-2 hover:text-sun">
                    <Phone size={14} /> {p.display}
                  </a>
                </li>
              ))}
              <li>
                <a href={waLink("Hi Letlaka, I'd like to ask about…")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-sun">
                  <MessageCircle size={14} /> WhatsApp us
                </a>
              </li>
              <li>
                <a href={SOCIALS.instagram.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-sun">
                  <Instagram size={14} /> {SOCIALS.instagram.label}
                </a>
              </li>
              <li>
                <a href={SOCIALS.facebook.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-sun">
                  <Facebook size={14} /> {SOCIALS.facebook.label}
                </a>
              </li>
              {EXTRA_SOCIALS.filter((x) => x.url).map((x) => (
                <li key={x.label}>
                  <a href={x.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-sun">
                    <Link2 size={14} /> {x.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-bone/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved || By MalulekeHlulani.</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Enquiries & custom orders only — no online payments.</span>
            <a href={href("admin")} className="font-semibold text-bone/50 transition hover:text-sun">
              Staff login
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
