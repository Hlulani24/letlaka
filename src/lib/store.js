import { useCallback, useEffect, useState } from "react";
import { supabase, IS_SUPABASE } from "./supabase.js";
import { SEED_PRODUCTS } from "../data/products.js";

/*
 * One data layer, two backends:
 *  - Supabase configured  → real database (shared, permanent).
 *  - Nothing configured   → DEMO mode: saved in this browser's localStorage only,
 *    so the admin panel can be tried out end to end with zero setup.
 */

const LS_PRODUCTS = "letlaka.demo.products.v1";
const LS_LEADS = "letlaka.demo.leads.v1";
const EVT = "letlaka-store-change";

const readLS = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

// Returns an error (e.g. storage full) or null.
const writeLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(EVT));
    return null;
  } catch (e) {
    return e;
  }
};

const FULL_MSG = "Browser storage is full. Use a smaller photo or pick one from the library.";

/* ───────────── Products ───────────── */

const fromRow = (r) => ({
  id: r.id,
  name: r.name,
  cat: r.category,
  blurb: r.blurb || "",
  status: r.status || "core",
  featured: !!r.featured,
  visible: r.visible !== false,
  price: r.price == null ? null : Number(r.price),
  salePrice: r.sale_price == null ? null : Number(r.sale_price),
  images: Array.isArray(r.images) ? r.images : [],
  sizes: Array.isArray(r.sizes) ? r.sizes : [],
  sort: r.sort ?? 0,
});

const toRow = (p) => ({
  id: p.id,
  name: p.name,
  category: p.cat,
  blurb: p.blurb,
  status: p.status,
  featured: p.featured,
  visible: p.visible,
  price: p.price,
  sale_price: p.salePrice,
  images: p.images,
  sizes: p.sizes || [],
  sort: p.sort,
});

const bySort = (a, b) => (a.sort ?? 0) - (b.sort ?? 0);

function localProducts(admin) {
  const local = readLS(LS_PRODUCTS, null);
  const list = (local ?? SEED_PRODUCTS).slice().sort(bySort);
  return {
    products: admin ? list : list.filter((p) => p.visible),
    source: local ? "local" : "seed",
    error: null,
  };
}

export async function fetchProducts({ admin = false } = {}) {
  if (!IS_SUPABASE) return localProducts(admin);

  let q = supabase.from("products").select("*").order("sort", { ascending: true });
  if (!admin) q = q.eq("visible", true);
  const { data, error } = await q;

  const seedVisible = SEED_PRODUCTS.filter((p) => p.visible);
  if (error) {
    return { products: admin ? [] : seedVisible, source: "seed", error: error.message };
  }
  // Empty table: show the starter catalogue publicly so the site is never blank.
  if (!data.length && !admin) return { products: seedVisible, source: "seed", error: null };
  return { products: data.map(fromRow), source: "supabase", error: null };
}

export async function saveProduct(p) {
  if (IS_SUPABASE) {
    const { error } = await supabase.from("products").upsert(toRow(p));
    return error ? { error: error.message } : {};
  }
  const list = readLS(LS_PRODUCTS, SEED_PRODUCTS).slice();
  const i = list.findIndex((x) => x.id === p.id);
  if (i >= 0) list[i] = p;
  else list.push(p);
  return writeLS(LS_PRODUCTS, list) ? { error: FULL_MSG } : {};
}

export async function deleteProduct(id) {
  if (IS_SUPABASE) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    return error ? { error: error.message } : {};
  }
  const list = readLS(LS_PRODUCTS, SEED_PRODUCTS).filter((x) => x.id !== id);
  return writeLS(LS_PRODUCTS, list) ? { error: FULL_MSG } : {};
}

// Demo: forget all local edits and go back to the starting catalogue.
export function resetDemoProducts() {
  localStorage.removeItem(LS_PRODUCTS);
  window.dispatchEvent(new Event(EVT));
}

// Supabase: copy the starting catalogue into an empty products table.
export async function loadStarterCatalogue() {
  if (!IS_SUPABASE) return {};
  const { error } = await supabase.from("products").upsert(SEED_PRODUCTS.map(toRow));
  if (!error) window.dispatchEvent(new Event(EVT));
  return error ? { error: error.message } : {};
}

// Live mode: add starter products that aren't in the database yet, without touching existing ones.
export async function addMissingStarter() {
  if (!IS_SUPABASE) return {};
  const { data, error } = await supabase.from("products").select("id");
  if (error) return { error: error.message };
  const have = new Set((data || []).map((r) => r.id));
  const fresh = SEED_PRODUCTS.filter((p) => !have.has(p.id));
  if (!fresh.length) return { added: 0 };
  const { error: e2 } = await supabase.from("products").insert(fresh.map(toRow));
  if (!e2) window.dispatchEvent(new Event(EVT));
  return e2 ? { error: e2.message } : { added: fresh.length };
}

export function nextSort(list) {
  return list.length ? Math.max(...list.map((p) => p.sort ?? 0)) + 1 : 0;
}

export function useProducts({ admin = false } = {}) {
  const [state, setState] = useState(() =>
    IS_SUPABASE
      ? { products: [], source: "loading", error: null, loading: true }
      : { ...localProducts(admin), loading: false }
  );

  const load = useCallback(async () => {
    const r = await fetchProducts({ admin });
    setState({ ...r, loading: false });
  }, [admin]);

  useEffect(() => {
    load();
    const on = () => load();
    window.addEventListener(EVT, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(EVT, on);
      window.removeEventListener("storage", on);
    };
  }, [load]);

  return { ...state, reload: load };
}

/* ───────────── Leads (custom orders + enquiries) ───────────── */

export const LEAD_TABLES = ["basket_orders", "custom_orders", "enquiries"];

// Demo mode only: keep a copy so the admin inbox has something to show.
export function saveLeadLocally(table, row) {
  const all = readLS(LS_LEADS, { basket_orders: [], custom_orders: [], enquiries: [] });
  all[table] = [
    { id: crypto.randomUUID(), created_at: new Date().toISOString(), status: "new", ...row },
    ...(all[table] || []),
  ];
  writeLS(LS_LEADS, all);
}

export async function fetchLeads(table) {
  if (IS_SUPABASE) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });
    return { leads: data || [], error: error?.message || null };
  }
  const all = readLS(LS_LEADS, { basket_orders: [], custom_orders: [], enquiries: [] });
  return { leads: all[table] || [], error: null };
}

export async function updateLeadStatus(table, id, status) {
  if (IS_SUPABASE) {
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (!error) window.dispatchEvent(new Event(EVT));
    return error ? { error: error.message } : {};
  }
  const all = readLS(LS_LEADS, { basket_orders: [], custom_orders: [], enquiries: [] });
  all[table] = (all[table] || []).map((l) => (l.id === id ? { ...l, status } : l));
  writeLS(LS_LEADS, all);
  return {};
}

export async function deleteLead(table, id) {
  if (IS_SUPABASE) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (!error) window.dispatchEvent(new Event(EVT));
    return error ? { error: error.message } : {};
  }
  const all = readLS(LS_LEADS, { basket_orders: [], custom_orders: [], enquiries: [] });
  all[table] = (all[table] || []).filter((l) => l.id !== id);
  writeLS(LS_LEADS, all);
  return {};
}

export function useLeads(table) {
  const [state, setState] = useState({ leads: [], error: null, loading: true });
  const load = useCallback(async () => {
    const r = await fetchLeads(table);
    setState({ ...r, loading: false });
  }, [table]);

  useEffect(() => {
    load();
    const on = () => load();
    window.addEventListener(EVT, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(EVT, on);
      window.removeEventListener("storage", on);
    };
  }, [load]);

  return { ...state, reload: load };
}
