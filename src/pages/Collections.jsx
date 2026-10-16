import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "../components/ProductCard.jsx";
import ProductModal from "../components/ProductModal.jsx";
import { isSpecial } from "../components/Price.jsx";
import { CATEGORIES } from "../data/products.js";
import { useProducts } from "../lib/store.js";
import { href } from "../lib/router.js";
import { PRICE_NOTE, SHOW_PRICES } from "../config.js";

const effective = (p) => (isSpecial(p) ? p.salePrice : p.price ?? Infinity);

export default function Collections({ params }) {
  const { products, loading } = useProducts();
  const hasSpecials = products.some(isSpecial);
  const tabs = hasSpecials ? [...CATEGORIES, "Specials"] : CATEGORIES;
  const cat = tabs.includes(params.cat) ? params.cat : "All";

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");
  const [open, setOpen] = useState(null);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const out = products.filter(
      (p) =>
        (cat === "All" || (cat === "Specials" ? isSpecial(p) : p.cat === cat)) &&
        (!term || `${p.name} ${p.cat} ${p.blurb}`.toLowerCase().includes(term))
    );
    if (sort === "low") out.sort((a, b) => effective(a) - effective(b));
    if (sort === "high") out.sort((a, b) => (effective(b) === Infinity ? -1 : effective(b)) - (effective(a) === Infinity ? -1 : effective(a)));
    if (sort === "featured") out.sort((a, b) => Number(b.featured) - Number(a.featured) || (a.sort ?? 0) - (b.sort ?? 0));
    return out;
  }, [products, cat, q, sort]);

  return (
    <main className="pt-[72px]">
      <section className="border-b border-white/10 bg-coal">
        <div className="mx-auto max-w-7xl px-5 pb-14 pt-16 md:px-8 md:pb-20 md:pt-24">
          <p className="reveal eyebrow text-sun">Collections</p>
          <h1 className="reveal mt-4 font-display text-5xl font-extrabold leading-[0.95] md:text-8xl" data-d="1">
            The full range.
          </h1>
          <p className="reveal mt-6 max-w-xl text-base text-bone/65 md:text-lg" data-d="2">
            Every piece is made to order. Tap one to see all views, then enquire on WhatsApp or start a custom
            order — no checkout, just a conversation.
          </p>
          {SHOW_PRICES && (
            <p className="reveal mt-3 max-w-xl text-xs text-bone/40" data-d="3">
              {PRICE_NOTE}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
            {tabs.map((c) => {
              const active = c === cat;
              const special = c === "Specials";
              return (
                <a
                  key={c}
                  href={href(c === "All" ? "collections" : `collections?cat=${encodeURIComponent(c)}`)}
                  className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                    active
                      ? special
                        ? "border-flame bg-flame text-ink"
                        : "border-sun bg-sun text-ink"
                      : special
                        ? "border-flame/60 text-flame hover:bg-flame hover:text-ink"
                        : "border-white/20 text-bone/80 hover:border-sun hover:text-sun"
                  }`}
                >
                  {c}
                </a>
              );
            })}
          </div>

          <div className="flex gap-3">
            <label className="relative block flex-1 lg:w-64 lg:flex-none">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bone/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the range…"
                className="field !rounded-full !pl-11"
                aria-label="Search products"
              />
            </label>
            {SHOW_PRICES && (
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
                className="field !w-auto !rounded-full pr-8 [&>option]:text-black"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            )}
          </div>
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-bone/40">
          {list.length} {list.length === 1 ? "piece" : "pieces"}
        </p>

        {loading ? (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : list.length ? (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {list.map((p, i) => (
              <ProductCard key={p.id} p={p} onOpen={setOpen} delay={i % 4} />
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-2xl border border-dashed border-white/20 p-12 text-center">
            <p className="font-display text-2xl font-bold">Nothing matches that search.</p>
            <p className="mt-2 text-sm text-bone/60">
              Can’t find it? Everything is made to order —{" "}
              <a href={href("custom")} className="text-sun underline underline-offset-4">
                tell us what you want
              </a>
              .
            </p>
          </div>
        )}
      </section>

      {open && <ProductModal p={open} onClose={() => setOpen(null)} />}
    </main>
  );
}
