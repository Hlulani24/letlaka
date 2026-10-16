import React, { useRef, useState } from "react";
import { X, ArrowUp, ArrowDown, Trash2, Upload, Images, Loader2, Plus } from "lucide-react";
import { PRODUCT_CATEGORIES } from "../../data/products.js";
import { IMAGE_LIBRARY } from "../../data/library.js";
import { saveProduct, nextSort } from "../../lib/store.js";
import { uploadProductImage } from "../../lib/images.js";
import { money } from "../Price.jsx";
import ColourPicker, { PALETTE, colourName } from "./ColourPicker.jsx";
import { ALL_SIZES, sizesFor } from "../../data/sizes.js";

const BLANK = {
  id: "",
  name: "",
  cat: PRODUCT_CATEGORIES[0],
  blurb: "",
  status: "core",
  featured: false,
  visible: true,
  price: "",
  special: false,
  salePrice: "",
  sizes: [],
  images: [],
};

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";

const SELECT = "field [&>option]:text-black";

export default function ProductEditor({ product, all, onClose, notify }) {
  const isNew = !product;
  const [f, setF] = useState(() =>
    product
      ? {
          ...product,
          price: product.price ?? "",
          special: product.salePrice != null,
          salePrice: product.salePrice ?? "",
          sizes: product.sizes || [],
          images: product.images.map((i) => ({ ...i })),
        }
      : { ...BLANK }
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showLib, setShowLib] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const setImg = (i, patch) => setF((x) => ({ ...x, images: x.images.map((im, n) => (n === i ? { ...im, ...patch } : im)) }));
  const removeImg = (i) => setF((x) => ({ ...x, images: x.images.filter((_, n) => n !== i) }));
  const moveImg = (i, d) =>
    setF((x) => {
      const imgs = x.images.slice();
      const j = i + d;
      if (j < 0 || j >= imgs.length) return x;
      [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
      return { ...x, images: imgs };
    });
  const addImgs = (list) => setF((x) => ({ ...x, images: [...x.images, ...list] }));

  async function onFiles(e) {
    const files = [...e.target.files];
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      const added = [];
      for (const file of files) {
        const src = await uploadProductImage(file);
        added.push({ src, label: "" });
      }
      addImgs(added);
    } catch (err) {
      setError(err.message || "Upload failed.");
    }
    setUploading(false);
  }

  async function onSave(e) {
    e.preventDefault();
    setError("");
    const name = f.name.trim();
    if (!name) return setError("Give the product a name.");
    if (!f.images.length) return setError("Add at least one photo.");
    const price = f.price === "" ? null : Number(f.price);
    if (price != null && (Number.isNaN(price) || price < 0)) return setError("Price must be a positive number.");
    let salePrice = null;
    if (f.special) {
      salePrice = Number(f.salePrice);
      if (price == null) return setError("Set a normal price before adding a special.");
      if (!f.salePrice || Number.isNaN(salePrice) || salePrice >= price)
        return setError("The special price must be lower than the normal price.");
    }

    let id = f.id;
    if (isNew) {
      const taken = new Set(all.map((p) => p.id));
      const base = slug(name);
      id = base;
      for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
    }

    const clean = {
      id,
      name,
      cat: f.cat,
      blurb: f.blurb.trim(),
      status: f.status,
      featured: f.featured,
      visible: f.visible,
      price,
      salePrice,
      sizes: f.sizes,
      images: f.images.map((im) => {
        const out = { src: im.src, label: (im.label || "").trim() || name };
        if (im.hex) out.hex = im.hex.toUpperCase();
        return out;
      }),
      sort: isNew ? nextSort(all) : f.sort ?? 0,
    };

    setBusy(true);
    const r = await saveProduct(clean);
    setBusy(false);
    if (r.error) return setError(r.error);
    notify(isNew ? "Product added." : "Changes saved.");
    onClose();
  }

  const label = "mb-2 block text-xs font-bold uppercase tracking-widest text-bone/50";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <form
        onSubmit={onSave}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-2xl flex-col bg-coal"
        aria-label={isNew ? "Add product" : `Edit ${product.name}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="font-display text-xl font-extrabold">{isNew ? "Add product" : "Edit product"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className={label}>Name *</span>
              <input value={f.name} onChange={set("name")} className="field" placeholder="e.g. Signature Hoodie Set" />
            </label>
            <label className="block">
              <span className={label}>Category</span>
              <select value={f.cat} onChange={set("cat")} className={SELECT}>
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={label}>Photos are of…</span>
              <select value={f.status} onChange={set("status")} className={SELECT}>
                <option value="core">Real product photos</option>
                <option value="concept">Concept / mock-up (shows tag)</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className={label}>Description</span>
              <textarea rows={3} value={f.blurb} onChange={set("blurb")} className="field resize-y" placeholder="One or two sentences about the piece." />
            </label>
          </div>

          {/* Pricing */}
          <fieldset className="rounded-2xl border border-white/10 p-5">
            <legend className="px-2 text-xs font-bold uppercase tracking-widest text-sun">Pricing</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className={label}>Price (R)</span>
                <input type="number" min="0" step="1" inputMode="numeric" value={f.price} onChange={set("price")} className="field" placeholder="Leave empty to hide" />
              </label>
              <label className={`block ${f.special ? "" : "opacity-40"}`}>
                <span className={label}>Special price (R)</span>
                <input type="number" min="0" step="1" inputMode="numeric" disabled={!f.special} value={f.salePrice} onChange={set("salePrice")} className="field" />
              </label>
            </div>
            <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm font-semibold">
              <input type="checkbox" checked={f.special} onChange={set("special")} className="h-5 w-5 accent-[#FFD23F]" />
              Mark as a special (shows a strikethrough price and “Special” badge)
            </label>
            {f.price !== "" && (
              <p className="mt-4 text-sm text-bone/60">
                Shown as{" "}
                {f.special && f.salePrice ? (
                  <>
                    <strong className="text-flame">{money(f.salePrice)}</strong> <s className="text-bone/40">{money(f.price)}</s>
                  </>
                ) : (
                  <strong className="text-bone">{money(f.price)}</strong>
                )}
              </p>
            )}
          </fieldset>

          {/* Visibility */}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 p-4 text-sm font-semibold">
              <input type="checkbox" checked={f.visible} onChange={set("visible")} className="h-5 w-5 accent-[#FFD23F]" />
              <span>
                Visible on the website
                <span className="block text-xs font-normal text-bone/50">Untick to hide it (e.g. out of stock)</span>
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 p-4 text-sm font-semibold">
              <input type="checkbox" checked={f.featured} onChange={set("featured")} className="h-5 w-5 accent-[#FFD23F]" />
              <span>
                Featured on the home page
                <span className="block text-xs font-normal text-bone/50">Appears in the “Right now” row</span>
              </span>
            </label>
          </div>

          {/* Sizes */}
          <div>
            <span className={label}>Sizes offered</span>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((sz) => {
                const on = f.sizes.includes(sz);
                return (
                  <button
                    type="button"
                    key={sz}
                    aria-pressed={on}
                    onClick={() => setF((x) => ({ ...x, sizes: on ? x.sizes.filter((v) => v !== sz) : [...x.sizes, sz] }))}
                    className={`rounded-full border px-4 py-2 text-sm font-bold transition ${on ? "border-sun bg-sun text-ink" : "border-white/20 text-bone/70 hover:border-sun"}`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-bone/45">
              {f.sizes.length
                ? "Customers pick from these sizes."
                : `Nothing ticked — customers will see: ${sizesFor({ cat: f.cat, sizes: [] }).join(", ")}.`}
            </p>
          </div>

          {/* Photos */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className={`${label} !mb-0`}>Photos / colourways *</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-ghost !px-4 !py-2 text-xs disabled:opacity-60">
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload
                </button>
                <button type="button" onClick={() => setShowLib((s) => !s)} className="btn-ghost !px-4 !py-2 text-xs">
                  <Images size={14} /> Library
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onFiles} />
              </div>
            </div>
            <p className="mt-2 text-xs text-bone/45">
              The first photo is the main one. Each photo is one colour the customer can choose — name it and tap its colour.
            </p>

            {showLib && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-3">
                <p className="mb-3 text-xs font-semibold text-bone/60">Tap a photo to add it</p>
                <div className="grid max-h-64 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6">
                  {IMAGE_LIBRARY.map((im) => (
                    <button
                      type="button"
                      key={im.src}
                      onClick={() => addImgs([{ src: im.src, label: im.label }])}
                      title={im.label}
                      className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10 hover:border-sun"
                    >
                      <img src={im.src} alt={im.label} loading="lazy" className="h-full w-full object-cover" />
                      <span className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                        <Plus size={18} className="text-sun" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <ul className="mt-4 space-y-3">
              {f.images.map((im, i) => (
                <li key={`${im.src.slice(-24)}-${i}`} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <img src={im.src} alt="" className="h-20 w-16 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1 space-y-3">
                    <input
                      value={im.label || ""}
                      onChange={(e) => setImg(i, { label: e.target.value })}
                      className="field !py-2"
                      placeholder="Colour name e.g. Royal blue"
                      aria-label="Colour name"
                    />
                    <ColourPicker
                      value={im.hex}
                      onPick={(hex, name) =>
                        setImg(i, {
                          hex,
                          ...(name && (!im.label || PALETTE.some(([n]) => n === im.label)) ? { label: name } : {}),
                        })
                      }
                    />
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => moveImg(i, -1)} disabled={i === 0} aria-label="Move up" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10 disabled:opacity-25">
                        <ArrowUp size={14} />
                      </button>
                      <button type="button" onClick={() => moveImg(i, 1)} disabled={i === f.images.length - 1} aria-label="Move down" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10 disabled:opacity-25">
                        <ArrowDown size={14} />
                      </button>
                    </div>
                    <button type="button" onClick={() => removeImg(i)} aria-label="Remove photo" className="grid h-8 w-full place-items-center rounded-lg text-ruby hover:bg-ruby/15">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
              {!f.images.length && (
                <li className="rounded-2xl border border-dashed border-white/20 p-6 text-center text-sm text-bone/50">
                  No photos yet — upload one or pick from the library.
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-4">
          {error && (
            <p role="alert" className="mb-3 text-sm font-semibold text-ruby">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" disabled={busy || uploading} className="btn-sun flex-1 disabled:opacity-60">
              {busy ? <Loader2 size={17} className="animate-spin" /> : isNew ? "Add product" : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
