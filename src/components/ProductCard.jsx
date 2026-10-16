import React from "react";
import { ArrowUpRight } from "lucide-react";
import Price, { isSpecial } from "./Price.jsx";
import { SHOW_CONCEPT_TAGS, SHOW_PRICES } from "../config.js";

export default function ProductCard({ p, onOpen, delay = 0 }) {
  const first = p.images[0];
  const second = p.images[1];
  const hasPrice = SHOW_PRICES && p.price != null;
  return (
    <button
      type="button"
      onClick={() => onOpen(p)}
      data-d={delay}
      className="reveal group block w-full text-left"
      aria-label={`View ${p.name}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-coal">
        <img
          src={first.src}
          alt={`${p.name} — ${first.label}`}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${
            second ? "group-hover:opacity-0" : "group-hover:scale-105"
          }`}
        />
        {second && (
          <img
            src={second.src}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition duration-700 group-hover:scale-100 group-hover:opacity-100"
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {isSpecial(p) && (
            <span className="rounded-full bg-flame px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-widest text-ink">
              Special
            </span>
          )}
          {SHOW_CONCEPT_TAGS && p.status === "concept" && (
            <span className="rounded-full bg-ink/80 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-widest text-sun backdrop-blur">
              Concept design
            </span>
          )}
        </div>

        {p.images.length > 1 && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.62rem] font-bold text-ink">
            {p.images.length} views
          </span>
        )}
        <span className="absolute bottom-3 right-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-sun text-ink opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow text-[0.6rem] text-bone/45">{p.cat}</p>
          <h3 className="mt-1 font-display text-lg font-bold leading-tight">{p.name}</h3>
        </div>
        {hasPrice ? (
          <Price p={p} className="mt-1 shrink-0 flex-col !items-end !gap-0" />
        ) : (
          <span className="mt-1 shrink-0 text-xs font-semibold text-sun">Enquire</span>
        )}
      </div>
    </button>
  );
}
