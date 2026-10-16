import React, { useMemo, useState } from "react";
import { Plus, Search, Star, Pencil, Trash2, RotateCcw, DatabaseZap, CloudUpload, Loader2 } from "lucide-react";
import ProductEditor from "./ProductEditor.jsx";
import Price, { isSpecial } from "../Price.jsx";
import { PRODUCT_CATEGORIES, SEED_PRODUCTS } from "../../data/products.js";
import { IS_CLOUDINARY } from "../../lib/images.js";
import { countLocalPhotos, moveAllPhotosToCloudinary } from "../../lib/migrate.js";
import { IS_SUPABASE } from "../../lib/supabase.js";
import { useProducts, saveProduct, deleteProduct, resetDemoProducts, loadStarterCatalogue, addMissingStarter } from "../../lib/store.js";

export default function ProductsTab({ notify }) {
  const { products, loading, error, source } = useProducts({ admin: true });
  const [editing, setEditing] = useState(null); // product | "new" | null
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [moving, setMoving] = useState(null); // null | {n, total}

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter(
      (p) => (cat === "All" || p.cat === cat) && (!term || `${p.name} ${p.cat}`.toLowerCase().includes(term))
    );
  }, [products, q, cat]);

  const stats = [
    ["Products", products.length],
    ["Live", products.filter((p) => p.visible).length],
    ["Hidden", products.filter((p) => !p.visible).length],
    ["Specials", products.filter(isSpecial).length],
  ];

  async function patch(p, changes, msg) {
    const r = await saveProduct({ ...p, ...changes });
    r.error ? notify(r.error, "error") : notify(msg);
  }

  async function onDelete(p) {
    if (!window.confirm(`Delete “${p.name}” permanently? This can't be undone.`)) return;
    const r = await deleteProduct(p.id);
    r.error ? notify(r.error, "error") : notify("Product deleted.");
  }

  async function onStarter() {
    const r = await loadStarterCatalogue();
    r.error ? notify(r.error, "error") : notify("Starter catalogue loaded.");
  }

  const localCount = countLocalPhotos(products);
  const missingStarter = IS_SUPABASE && products.length ? SEED_PRODUCTS.filter((s) => !products.some((p) => p.id === s.id)).length : 0;

  async function onMove() {
    setMoving({ n: 0, total: localCount });
    const r = await moveAllPhotosToCloudinary(products, (n, total) => setMoving({ n, total }));
    setMoving(null);
    r.error ? notify(r.error, "error") : notify(`Moved ${r.moved} photos to Cloudinary.`);
  }

  async function onAddMissing() {
    const r = await addMissingStarter();
    r.error ? notify(r.error, "error") : notify(`Added ${r.added} new starter products.`);
  }

  function onReset() {
    if (!window.confirm("Throw away all demo edits and restore the starting catalogue?")) return;
    resetDemoProducts();
    notify("Demo data reset.");
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-bone/45">{k}</p>
            <p className="mt-1 font-display text-3xl font-extrabold">{v}</p>
          </div>
        ))}
      </div>

      {!!localCount && (IS_SUPABASE || IS_CLOUDINARY) && (
        <div className="mt-6 rounded-2xl border border-sun/30 bg-sun/10 p-4 text-sm text-sun">
          <p className="leading-relaxed">
            <strong>{localCount} photos</strong> are stored inside the website files, not on Cloudinary.{" "}
            {IS_CLOUDINARY
              ? "Move them once so every photo lives on Cloudinary and the shop owner can swap any of them."
              : "Add the Cloudinary keys (see the README), redeploy, then come back and move them."}
          </p>
          {IS_CLOUDINARY && (
            <button onClick={onMove} disabled={!!moving} className="btn-sun mt-3 !px-5 !py-2.5 text-xs disabled:opacity-70">
              {moving ? <Loader2 size={15} className="animate-spin" /> : <CloudUpload size={15} />}
              {moving ? `Moving ${moving.n} / ${moving.total}…` : "Move all photos to Cloudinary"}
            </button>
          )}
        </div>
      )}
      {!!missingStarter && (
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-sm">
          <p className="text-bone/70">{missingStarter} new starter products are available that aren’t in your database yet.</p>
          <button onClick={onAddMissing} className="btn-ghost mt-3 !px-5 !py-2.5 text-xs">
            <DatabaseZap size={15} /> Add the new starter products
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative block flex-1">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bone/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="field !pl-11" aria-label="Search products" />
        </label>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="field md:w-52 [&>option]:text-black" aria-label="Filter by category">
          <option>All</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button onClick={() => setEditing("new")} className="btn-sun">
          <Plus size={17} /> Add product
        </button>
      </div>

      {error && <p className="mt-4 rounded-xl bg-ruby/15 p-3 text-sm font-semibold text-ruby">Couldn’t load products: {error}</p>}

      {loading ? (
        <p className="mt-10 text-center text-sm text-bone/50">Loading…</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {list.map((p) => (
            <li key={p.id} className={`flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 md:flex-nowrap md:gap-4 md:p-4 ${p.visible ? "" : "opacity-60"}`}>
              <img src={p.images[0]?.src} alt="" className="h-20 w-16 shrink-0 rounded-lg bg-black object-cover" />
              <div className="min-w-0 flex-1 basis-40">
                <p className="truncate font-display text-lg font-bold">{p.name}</p>
                <p className="mt-0.5 text-xs text-bone/50">
                  {p.cat} · {p.images.length} {p.images.length === 1 ? "photo" : "photos"}
                  {p.status === "concept" && " · concept"}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  {p.price != null ? <Price p={p} /> : <span className="text-xs text-bone/40">No price</span>}
                  {isSpecial(p) && <span className="rounded-full bg-flame px-2 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-widest text-ink">Special</span>}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  role="switch"
                  aria-checked={p.visible}
                  aria-label={p.visible ? "Hide from website" : "Show on website"}
                  title={p.visible ? "Live — click to hide" : "Hidden — click to show"}
                  onClick={() => patch(p, { visible: !p.visible }, p.visible ? "Hidden from the website." : "Now live on the website.")}
                  className={`relative h-7 w-12 rounded-full transition ${p.visible ? "bg-sun" : "bg-white/20"}`}
                >
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-ink transition-all ${p.visible ? "left-6" : "left-1"}`} />
                </button>
                <button
                  onClick={() => patch(p, { featured: !p.featured }, p.featured ? "Removed from featured." : "Featured on the home page.")}
                  aria-pressed={p.featured}
                  aria-label="Toggle featured"
                  title="Featured on home page"
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
                >
                  <Star size={18} className={p.featured ? "fill-sun text-sun" : "text-bone/40"} />
                </button>
                <button onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10">
                  <Pencil size={17} />
                </button>
                <button onClick={() => onDelete(p)} aria-label={`Delete ${p.name}`} className="grid h-10 w-10 place-items-center rounded-full text-ruby hover:bg-ruby/15">
                  <Trash2 size={17} />
                </button>
              </div>
            </li>
          ))}

          {!list.length && (
            <li className="rounded-2xl border border-dashed border-white/20 p-10 text-center">
              <p className="font-display text-xl font-bold">{products.length ? "No products match." : "No products yet."}</p>
              {IS_SUPABASE && !products.length && (
                <button onClick={onStarter} className="btn-sun mt-5">
                  <DatabaseZap size={17} /> Load the starter catalogue
                </button>
              )}
            </li>
          )}
        </ul>
      )}

      {!IS_SUPABASE && source === "local" && (
        <button onClick={onReset} className="btn-ghost mt-8 !px-4 !py-2 text-xs">
          <RotateCcw size={14} /> Reset demo data
        </button>
      )}

      {editing && (
        <ProductEditor
          product={editing === "new" ? null : editing}
          all={products}
          notify={notify}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
