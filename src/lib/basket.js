import { useSyncExternalStore } from "react";

// The customer's "enquiry basket": what they picked, in which colour and size.
// Kept in this browser so it survives a refresh. No payment — it becomes a quote request.
const KEY = "letlaka.basket.v1";

const read = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

let state = { items: read(), open: false, toast: null };
const subs = new Set();
const emit = () => subs.forEach((f) => f());
const set = (patch) => {
  state = { ...state, ...patch };
  if (patch.items) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state.items));
    } catch {
      /* ignore */
    }
  }
  emit();
};

const subscribe = (f) => {
  subs.add(f);
  return () => subs.delete(f);
};
const snapshot = () => state;

let toastTimer;

export const basket = {
  add(line) {
    const key = `${line.id}|${line.colour}|${line.size}`;
    const items = state.items.slice();
    const i = items.findIndex((x) => x.key === key);
    if (i >= 0) items[i] = { ...items[i], qty: Math.min(999, items[i].qty + line.qty), price: line.price };
    else items.push({ ...line, key });
    set({ items, toast: { text: `${line.name} added`, id: Date.now() } });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toast: null }), 4000);
  },
  setQty(key, qty) {
    const q = Math.max(1, Math.min(999, Number(qty) || 1));
    set({ items: state.items.map((x) => (x.key === key ? { ...x, qty: q } : x)) });
  },
  remove(key) {
    set({ items: state.items.filter((x) => x.key !== key) });
  },
  clear() {
    set({ items: [] });
  },
  open() {
    set({ open: true, toast: null });
  },
  close() {
    set({ open: false });
  },
  dismissToast() {
    set({ toast: null });
  },
};

export function useBasket() {
  const s = useSyncExternalStore(subscribe, snapshot);
  const count = s.items.reduce((n, x) => n + x.qty, 0);
  const priced = s.items.filter((x) => x.price != null);
  const total = priced.reduce((n, x) => n + x.price * x.qty, 0);
  return { ...s, count, total, hasUnpriced: priced.length < s.items.length };
}

export const itemsText = (items) =>
  items
    .map(
      (x) =>
        `• ${x.qty} × ${x.name} — ${x.colour || "standard"}, size ${x.size}` +
        (x.price != null ? ` (R${x.price} each)` : "")
    )
    .join("\n");
