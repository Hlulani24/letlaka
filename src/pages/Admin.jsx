import React, { useCallback, useEffect, useState } from "react";
import { LogOut, ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";
import AdminLogin from "../components/admin/AdminLogin.jsx";
import ProductsTab from "../components/admin/ProductsTab.jsx";
import LeadsTab from "../components/admin/LeadsTab.jsx";
import SettingsTab from "../components/admin/SettingsTab.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useLeads } from "../lib/store.js";
import { IS_SUPABASE } from "../lib/supabase.js";
import { href } from "../lib/router.js";

const TABS = [
  ["products", "Products"],
  ["basket_orders", "Orders"],
  ["custom_orders", "Custom orders"],
  ["enquiries", "Enquiries"],
  ["settings", "Settings"],
];

export default function Admin() {
  const auth = useAuth();
  const [tab, setTab] = useState("products");
  const [toast, setToast] = useState(null);

  const baskets = useLeads("basket_orders");
  const orders = useLeads("custom_orders");
  const enquiries = useLeads("enquiries");
  const badge = {
    basket_orders: baskets.leads.filter((l) => l.status === "new").length,
    custom_orders: orders.leads.filter((l) => l.status === "new").length,
    enquiries: enquiries.leads.filter((l) => l.status === "new").length,
  };

  const notify = useCallback((message, kind = "ok") => setToast({ message, kind, id: Date.now() }), []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  if (auth.loading) return <main className="grid min-h-screen place-items-center bg-ink text-sm text-bone/50">Loading…</main>;
  if (!auth.user) return <AdminLogin auth={auth} />;

  return (
    <main className="min-h-screen bg-ink">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <img src="/images/badge-logo.jpg" alt="" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="font-display text-lg font-extrabold leading-none tracking-wide">Letlaka admin</p>
              <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-widest text-bone/40">
                {IS_SUPABASE ? "Live · database connected" : "Demo mode"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={href()} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2 text-xs">
              View site <ExternalLink size={13} />
            </a>
            <button onClick={auth.signOut} className="btn-ghost !px-4 !py-2 text-xs" aria-label="Sign out">
              <LogOut size={14} /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-5 no-scrollbar" aria-label="Admin sections">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              aria-current={tab === key}
              className={`relative shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition ${
                tab === key ? "border-sun text-sun" : "border-transparent text-bone/60 hover:text-bone"
              }`}
            >
              {label}
              {!!badge[key] && (
                <span className="ml-2 rounded-full bg-sun px-2 py-0.5 text-[0.65rem] font-extrabold text-ink">{badge[key]}</span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        {!IS_SUPABASE && (
          <p className="mb-6 rounded-2xl border border-sun/30 bg-sun/10 p-4 text-sm leading-relaxed text-sun">
            <strong>Demo mode.</strong> No database is connected, so everything you change here is saved in this browser
            only — try adding a product, setting a special price or hiding an item, then open the website to see it.
            Connect Supabase (see the README) to make changes permanent and shared.
          </p>
        )}
        {tab === "products" && <ProductsTab notify={notify} />}
        {tab === "basket_orders" && <LeadsTab table="basket_orders" notify={notify} />}
        {tab === "settings" && <SettingsTab auth={auth} notify={notify} />}
        {tab === "custom_orders" && <LeadsTab table="custom_orders" notify={notify} />}
        {tab === "enquiries" && <LeadsTab table="enquiries" notify={notify} />}
      </div>

      {toast && (
        <div
          key={toast.id}
          role="status"
          className={`fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-2xl ${
            toast.kind === "error" ? "bg-ruby text-white" : "bg-sun text-ink"
          }`}
        >
          {toast.kind === "error" ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          {toast.message}
        </div>
      )}
    </main>
  );
}
