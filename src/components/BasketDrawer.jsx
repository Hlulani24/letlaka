import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Loader2, CheckCircle2, MessageCircle } from "lucide-react";
import { basket, useBasket, itemsText } from "../lib/basket.js";
import { submitLead } from "../lib/leads.js";
import { money } from "./Price.jsx";
import { href } from "../lib/router.js";
import { SHOW_PRICES, PRICE_NOTE, waLink } from "../config.js";

export default function BasketDrawer() {
  const b = useBasket();
  const [step, setStep] = useState("items"); // items | details | done
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", deadline: "", notes: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    if (!b.open) return;
    const onKey = (e) => e.key === "Escape" && basket.close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [b.open]);

  useEffect(() => {
    if (b.open && step !== "done") setStep("items");
    if (!b.open && step === "done") setStep("items");
  }, [b.open]); // eslint-disable-line

  if (!b.open) return null;

  const summaryText = (f = form) =>
    [
      "Hi Letlaka, I'd like a quote for these items:",
      "",
      itemsText(b.items),
      "",
      SHOW_PRICES && b.total > 0 ? `Estimated total: ${money(b.total)}${b.hasUnpriced ? " + items to be priced" : ""}` : "",
      `Name: ${f.name}`,
      `Phone: ${f.phone}`,
      f.email && `Email: ${f.email}`,
      f.deadline && `Needed by: ${f.deadline}`,
      f.notes && `Notes: ${f.notes}`,
    ]
      .filter((x) => x !== "" && x !== false && x !== undefined)
      .join("\n");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    const text = itemsText(b.items);
    const row = {
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      deadline: form.deadline || null,
      notes: form.notes || null,
      items: b.items.map(({ id, name, colour, size, qty, price }) => ({ id, name, colour, size, qty, price })),
      total: b.total || null,
    };
    const key = import.meta.env.VITE_EMAILJS_BASKET_TEMPLATE_ID
      ? "VITE_EMAILJS_BASKET_TEMPLATE_ID"
      : "VITE_EMAILJS_ORDER_TEMPLATE_ID";
    const res = await submitLead("basket_orders", row, key, {
      name: form.name,
      org: "",
      phone: form.phone,
      email: form.email,
      item: text,
      qty: String(b.count),
      colours: "",
      needs: "",
      deadline: form.deadline,
      notes: form.notes,
      items: text,
      total: b.total ? money(b.total) : "to be quoted",
    });
    setDone({ ...res, wa: waLink(summaryText()) });
    basket.clear();
    setStep("done");
    setBusy(false);
  }

  return createPortal(
    <div className="fixed inset-0 z-[55] flex justify-end bg-black/70 backdrop-blur-sm" onClick={() => basket.close()}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your basket"
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full flex-col bg-coal shadow-2xl sm:max-w-md"
      >
        <header className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            {step === "details" && (
              <button onClick={() => setStep("items")} aria-label="Back to basket" className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10">
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="font-display text-xl font-extrabold">
              {step === "items" ? `Your basket${b.count ? ` (${b.count})` : ""}` : step === "details" ? "Your details" : "Request sent"}
            </h2>
          </div>
          <button onClick={() => basket.close()} aria-label="Close basket" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10">
            <X size={18} />
          </button>
        </header>

        {step === "items" && (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              {!b.items.length ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <ShoppingBag size={34} className="mx-auto text-bone/30" />
                    <p className="mt-4 font-display text-xl font-bold">Nothing here yet.</p>
                    <p className="mx-auto mt-2 max-w-xs text-sm text-bone/55">
                      Pick a piece, choose colour and size, and add it. We’ll turn your basket into a quote — no payment online.
                    </p>
                    <a href={href("collections")} onClick={() => basket.close()} className="btn-sun mt-6">
                      Browse collections
                    </a>
                  </div>
                </div>
              ) : (
                <ul className="space-y-4">
                  {b.items.map((x) => (
                    <li key={x.key} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <img src={x.image} alt="" className="h-24 w-20 shrink-0 rounded-xl object-cover" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-display text-base font-bold leading-tight">{x.name}</p>
                          <button onClick={() => basket.remove(x.key)} aria-label={`Remove ${x.name}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-bone/50 hover:bg-ruby/15 hover:text-ruby">
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p className="mt-1 flex items-center gap-2 text-xs text-bone/60">
                          {x.hex && <span className="h-3 w-3 rounded-full ring-1 ring-white/40" style={{ background: x.hex }} />}
                          {x.colour} · Size {x.size}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center rounded-full border border-white/20">
                            <button onClick={() => basket.setQty(x.key, x.qty - 1)} aria-label="Fewer" className="grid h-8 w-8 place-items-center hover:text-sun">
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-bold">{x.qty}</span>
                            <button onClick={() => basket.setQty(x.key, x.qty + 1)} aria-label="More" className="grid h-8 w-8 place-items-center hover:text-sun">
                              <Plus size={14} />
                            </button>
                          </div>
                          {SHOW_PRICES && x.price != null ? (
                            <span className="font-display text-base font-extrabold">{money(x.price * x.qty)}</span>
                          ) : (
                            <span className="text-xs font-semibold text-sun">Price on request</span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {!!b.items.length && (
              <footer className="border-t border-white/10 p-5">
                {SHOW_PRICES && b.total > 0 && (
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-bone/60">Estimated total</span>
                    <span className="font-display text-2xl font-extrabold">{money(b.total)}</span>
                  </div>
                )}
                <p className="mt-1 text-xs text-bone/40">{PRICE_NOTE}</p>
                <button onClick={() => setStep("details")} className="btn-sun mt-4 w-full">
                  Request this quote
                </button>
                <button onClick={() => basket.close()} className="mt-2 w-full py-2 text-xs font-semibold text-bone/50 hover:text-sun">
                  Keep browsing
                </button>
              </footer>
            )}
          </>
        )}

        {step === "details" && (
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
              <p className="text-sm text-bone/60">
                {b.count} {b.count === 1 ? "item" : "items"}
                {SHOW_PRICES && b.total > 0 ? ` · about ${money(b.total)}` : ""}. Tell us who to reply to — we’ll confirm
                availability, final price and delivery.
              </p>
              <input required value={form.name} onChange={set("name")} placeholder="Your name *" autoComplete="name" className="field" />
              <input required value={form.phone} onChange={set("phone")} placeholder="Phone / WhatsApp number *" type="tel" autoComplete="tel" className="field" />
              <input value={form.email} onChange={set("email")} placeholder="Email (optional)" type="email" autoComplete="email" className="field" />
              <input value={form.deadline} onChange={set("deadline")} placeholder="Needed by (optional) e.g. 30 Nov" className="field" />
              <textarea rows={3} value={form.notes} onChange={set("notes")} placeholder="Anything else? Logo, names, delivery area…" className="field resize-y" />
            </div>
            <footer className="border-t border-white/10 p-5">
              <button disabled={busy} className="btn-sun w-full disabled:opacity-60">
                {busy ? <Loader2 size={17} className="animate-spin" /> : "Send my request"}
              </button>
            </footer>
          </form>
        )}

        {step === "done" && done && (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 text-center">
            <CheckCircle2 size={44} className="text-sun" />
            <h3 className="mt-5 font-display text-2xl font-extrabold">
              {done.saved || done.emailed ? "We’ve got your request." : done.demo ? "Demo request recorded." : "Almost done — send it on WhatsApp."}
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-bone/60">
              {done.saved || done.emailed
                ? "We’ll contact you shortly with availability and a final price. You can also send it straight to us on WhatsApp."
                : done.demo
                  ? "This is a demo, so nothing was sent to the shop — but it now appears in the admin inbox. Use WhatsApp to try the real hand-off."
                  : "We couldn’t save it online right now. Tap below to send the same list on WhatsApp so it isn’t lost."}
            </p>
            <a href={done.wa} target="_blank" rel="noreferrer" className="btn-sun mt-7">
              <MessageCircle size={17} /> Send on WhatsApp
            </a>
            <button onClick={() => basket.close()} className="mt-3 text-xs font-semibold text-bone/50 hover:text-sun">
              Close
            </button>
          </div>
        )}
      </aside>
    </div>,
    document.body
  );
}
