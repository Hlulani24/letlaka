import React, { useCallback, useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { LOOKBOOK } from "../data/products.js";
import { href } from "../lib/router.js";

export default function Lookbook() {
  const [idx, setIdx] = useState(null);

  const close = useCallback(() => setIdx(null), []);
  const step = useCallback(
    (d) => setIdx((i) => (i === null ? i : (i + d + LOOKBOOK.length) % LOOKBOOK.length)),
    []
  );

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [idx, close, step]);

  return (
    <main className="pt-[72px]">
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-8 md:pt-24">
        <p className="reveal eyebrow text-sun">Lookbook</p>
        <h1 className="reveal mt-4 font-display text-5xl font-extrabold leading-[0.95] md:text-8xl" data-d="1">
          Seen in colour.
        </h1>
        <p className="reveal mt-6 max-w-xl text-base text-bone/65 md:text-lg" data-d="2">
          Sets, knits, kit and caps — a look at how Letlaka wears.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="columns-2 gap-3 md:columns-3 md:gap-5 lg:columns-4">
          {LOOKBOOK.map((l, i) => (
            <button
              key={l.src}
              type="button"
              onClick={() => setIdx(i)}
              data-d={i % 3}
              className="reveal group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-black md:mb-5"
              aria-label={`Open ${l.caption}`}
            >
              <img
                src={l.src}
                alt={l.caption}
                loading="lazy"
                className="w-full transition duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-left text-xs font-bold opacity-0 transition group-hover:opacity-100">
                {l.caption}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a href={href("custom")} className="btn-sun">
            Get your own made <ArrowRight size={17} />
          </a>
        </div>
      </section>

      {idx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Lookbook image"
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-sun hover:text-ink"
          >
            <X size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous"
            className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 transition hover:bg-sun hover:text-ink md:left-6"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next"
            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 transition hover:bg-sun hover:text-ink md:right-6"
          >
            <ChevronRight size={22} />
          </button>
          <figure className="max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={LOOKBOOK[idx].src}
              alt={LOOKBOOK[idx].caption}
              className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain"
            />
            <figcaption className="mt-4 text-center text-sm font-semibold text-bone/70">
              {LOOKBOOK[idx].caption}{" "}
              <span className="text-bone/35">
                · {idx + 1}/{LOOKBOOK.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}
