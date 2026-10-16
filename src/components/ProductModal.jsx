import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, MessageCircle, ShoppingBag, Minus, Plus, Check } from "lucide-react";
import { href } from "../lib/router.js";
import Price, { isSpecial, money } from "./Price.jsx";
import { sizesFor } from "../data/sizes.js";
import { basket } from "../lib/basket.js";
import { PRICE_NOTE, SHOW_CONCEPT_TAGS, SHOW_PRICES, waLink } from "../config.js";

export default function ProductModal({ p, onClose }) {
  const [i, setI] = useState(0);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [warn, setWarn] = useState(false);
  const cur = p.images[i] || p.images[0];
  const sizes = useMemo(() => sizesFor(p), [p]);

  useEffect(() => {
    setI(0);
    setQty(1);
    setWarn(false);
    setSize(sizesFor(p).length === 1 ? sizesFor(p)[0] : "");
  }, [p.id]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const shown = isSpecial(p) ? p.salePrice : p.price;
  const priced = SHOW_PRICES && shown != null;
  const colour = cur?.label || "Standard";

  const msg =
    `Hi Letlaka, I'm interested in the ${p.name} (${colour})` +
    (size ? `, size ${size}` : "") +
    (qty > 1 ? `, qty ${qty}` : "") +
    (priced ? ` listed at ${money(shown)}` : "") +
    ". Is it available?";

  function addToBasket() {
    if (!size) {
      setWarn(true);
      return;
    }
    basket.add({
      id: p.id,
      name: p.name,
      image: cur?.src,
      colour,
      hex: cur?.hex || null,
      size,
      qty,
      price: priced ? Number(shown) : null,
    });
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={p.name}
    >
      <div
        className="relative flex h-full max-h-[760px] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-coal shadow-2xl md:grid md:h-[min(86dvh,760px)] md:grid-cols-[1.05fr_1fr]"
        style={{ maxHeight: "min(100%, 760px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-ink/80 text-bone backdrop-blur transition hover:bg-sun hover:text-ink"
        >
          <X size={18} />
        </button>

        {/* Photo — always fills its own box, so it can never collapse */}
        <div className="relative h-[34%] min-h-[160px] shrink-0 bg-black md:h-full">
          <img
            key={cur?.src}
            src={cur?.src}
            alt={`${p.name} — ${colour}`}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>

        {/* Details scroll; the action bar below never scrolls away */}
        <div className="flex min-h-0 flex-1 flex-col md:h-full">
          <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-8">
            <p className="eyebrow text-sun">{p.cat}</p>
            <h2 className="mt-2 pr-10 font-display text-2xl font-extrabold leading-tight md:text-4xl">{p.name}</h2>
            {SHOW_CONCEPT_TAGS && p.status === "concept" && (
              <p className="mt-3 inline-block w-fit rounded-full border border-sun/40 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-sun">
                Concept design · made to order
              </p>
            )}
            {priced && (
              <div className="mt-4 flex items-center gap-3">
                <Price p={p} large />
                {isSpecial(p) && (
                  <span className="rounded-full bg-flame px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-widest text-ink">
                    Special
                  </span>
                )}
              </div>
            )}
            <p className="mt-4 text-sm leading-relaxed text-bone/70">{p.blurb}</p>

            {/* Colour */}
            <div className="mt-6">
              <p className="eyebrow text-[0.62rem] text-bone/45">
                Colour — <span className="text-bone">{colour}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {p.images.map((im, idx) => (
                  <button
                    key={`${im.src}-${idx}`}
                    onClick={() => setI(idx)}
                    aria-label={im.label || `View ${idx + 1}`}
                    aria-pressed={idx === i}
                    className={`relative h-16 w-14 overflow-hidden rounded-lg border-2 transition ${
                      idx === i ? "border-sun" : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={im.src} alt="" className="h-full w-full object-cover" />
                    {im.hex && (
                      <span
                        className="absolute bottom-1 left-1 h-3 w-3 rounded-full ring-1 ring-white/60"
                        style={{ background: im.hex }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-6">
              <p className={`eyebrow text-[0.62rem] ${warn && !size ? "text-ruby" : "text-bone/45"}`}>
                Size {warn && !size ? "— please choose one" : size ? `— ${size}` : ""}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSize(s);
                      setWarn(false);
                    }}
                    aria-pressed={size === s}
                    className={`min-w-[3rem] rounded-full border px-4 py-2 text-sm font-bold transition ${
                      size === s
                        ? "border-sun bg-sun text-ink"
                        : warn
                          ? "border-ruby/60 text-bone/80 hover:border-sun"
                          : "border-white/20 text-bone/80 hover:border-sun hover:text-sun"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
              <p className="eyebrow text-[0.62rem] text-bone/45">Quantity</p>
              <div className="flex items-center rounded-full border border-white/20">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Fewer" className="grid h-10 w-10 place-items-center rounded-full hover:text-sun">
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-bold" aria-live="polite">
                  {qty}
                </span>
                <button onClick={() => setQty((q) => Math.min(999, q + 1))} aria-label="More" className="grid h-10 w-10 place-items-center rounded-full hover:text-sun">
                  <Plus size={16} />
                </button>
              </div>
              {priced && qty > 1 && <span className="text-sm text-bone/60">= {money(shown * qty)}</span>}
            </div>

            <p className="mt-6 text-xs leading-relaxed text-bone/45">
              {priced ? `${PRICE_NOTE} ` : ""}Made to order in your colours. Want a logo or crest?{" "}
              <a href={href(`custom?item=${encodeURIComponent(p.name)}`)} onClick={onClose} className="text-sun underline underline-offset-4">
                Start a custom order
              </a>
              .
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2.5 border-t border-white/10 bg-coal p-4 sm:flex-row md:px-8">
            <button onClick={addToBasket} className="btn-sun flex-1">
              <ShoppingBag size={17} /> Add to basket
            </button>
            <a href={waLink(msg)} target="_blank" rel="noreferrer" className="btn-ghost flex-1">
              <MessageCircle size={17} /> Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
