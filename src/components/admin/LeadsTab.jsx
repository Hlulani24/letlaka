import React from "react";
import { MessageCircle, Phone, Trash2, Download, Inbox } from "lucide-react";
import { useLeads, updateLeadStatus, deleteLead } from "../../lib/store.js";

const STATUSES = ["new", "contacted", "quoted", "done"];
const STATUS_STYLE = {
  new: "bg-sun text-ink",
  contacted: "bg-[#4C8BF5] text-ink",
  quoted: "bg-flame text-ink",
  done: "bg-mint text-ink",
};

const FIELDS = {
  basket_orders: [
    ["email", "Email"],
    ["deadline", "Needed by"],
    ["notes", "Notes"],
  ],
  custom_orders: [
    ["organisation", "Team / school / company"],
    ["garment", "Garment"],
    ["quantity", "Quantity"],
    ["colours", "Colours"],
    ["needs", "Needs"],
    ["deadline", "Needed by"],
    ["email", "Email"],
    ["notes", "Notes"],
  ],
  enquiries: [["message", "Message"]],
};

const waNumber = (phone = "") => {
  const d = phone.replace(/\D/g, "");
  return d.startsWith("0") ? `27${d.slice(1)}` : d;
};

function exportCsv(table, leads) {
  const cols = ["created_at", "status", "name", "phone", ...(table === "basket_orders" ? ["items", "total"] : []), ...FIELDS[table].map(([k]) => k)];
  if (table === "basket_orders")
    leads = leads.map((l) => ({
      ...l,
      items: (l.items || []).map((x) => `${x.qty} x ${x.name} (${x.colour}, ${x.size})`).join("; "),
    }));
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...leads.map((l) => cols.map((c) => esc(l[c])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `letlaka-${table}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LeadsTab({ table, notify }) {
  const { leads, loading, error } = useLeads(table);

  async function setStatus(l, status) {
    const r = await updateLeadStatus(table, l.id, status);
    if (r.error) notify(r.error, "error");
  }
  async function remove(l) {
    if (!window.confirm(`Delete the request from ${l.name}?`)) return;
    const r = await deleteLead(table, l.id);
    r.error ? notify(r.error, "error") : notify("Deleted.");
  }

  if (loading) return <p className="mt-10 text-center text-sm text-bone/50">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-bone/60">
          {leads.length} {leads.length === 1 ? "request" : "requests"} · {leads.filter((l) => l.status === "new").length} new
        </p>
        {!!leads.length && (
          <button onClick={() => exportCsv(table, leads)} className="btn-ghost !px-4 !py-2 text-xs">
            <Download size={14} /> Export CSV
          </button>
        )}
      </div>

      {error && <p className="mt-4 rounded-xl bg-ruby/15 p-3 text-sm font-semibold text-ruby">Couldn’t load: {error}</p>}

      {!leads.length && !error ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/20 p-12 text-center">
          <Inbox size={30} className="mx-auto text-bone/40" />
          <p className="mt-4 font-display text-xl font-bold">Nothing here yet.</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-bone/55">
            {table === "basket_orders"
              ? "Add products to the basket on the website and send the request — it will show up here."
              : `Submit the ${table === "custom_orders" ? "Custom Orders" : "Contact"} form on the website and it will show up here.`}
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {leads.map((l) => (
            <li key={l.id} className="rounded-2xl border border-white/10 bg-white/[0.03]">
              <details className="group" open={l.status === "new"}>
                <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-4 marker:content-none">
                  <span className={`rounded-full px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-widest ${STATUS_STYLE[l.status] || "bg-white/20"}`}>
                    {l.status}
                  </span>
                  <span className="font-display text-lg font-bold">{l.name}</span>
                  {table === "basket_orders" && (
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold">
                      {(l.items || []).reduce((n, x) => n + x.qty, 0)} items
                    </span>
                  )}
                  <span className="text-sm text-bone/50">{l.phone}</span>
                  <span className="ml-auto text-xs text-bone/40">{new Date(l.created_at).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" })}</span>
                </summary>

                <div className="border-t border-white/10 p-4">
                  {table === "basket_orders" && (
                    <div className="mb-5 overflow-hidden rounded-xl border border-white/10">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-[0.65rem] uppercase tracking-widest text-bone/45">
                          <tr>
                            <th className="px-3 py-2">Item</th>
                            <th className="px-3 py-2">Colour</th>
                            <th className="px-3 py-2">Size</th>
                            <th className="px-3 py-2 text-right">Qty</th>
                            <th className="px-3 py-2 text-right">Each</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(l.items || []).map((x, n) => (
                            <tr key={n} className="border-t border-white/10">
                              <td className="px-3 py-2 font-semibold">{x.name}</td>
                              <td className="px-3 py-2 text-bone/70">{x.colour}</td>
                              <td className="px-3 py-2 text-bone/70">{x.size}</td>
                              <td className="px-3 py-2 text-right">{x.qty}</td>
                              <td className="px-3 py-2 text-right text-bone/70">{x.price != null ? `R${x.price}` : "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {l.total != null && (
                        <p className="border-t border-white/10 bg-white/5 px-3 py-2 text-right text-sm font-bold">
                          Estimated total: R{Number(l.total).toLocaleString("en-ZA")}
                        </p>
                      )}
                    </div>
                  )}
                  <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {FIELDS[table]
                      .filter(([k]) => l[k])
                      .map(([k, label]) => (
                        <div key={k} className={k === "notes" || k === "message" ? "sm:col-span-2" : ""}>
                          <dt className="text-[0.65rem] font-bold uppercase tracking-widest text-bone/40">{label}</dt>
                          <dd className="mt-1 whitespace-pre-wrap text-sm">{l[k]}</dd>
                        </div>
                      ))}
                  </dl>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <a
                      href={`https://wa.me/${waNumber(l.phone)}?text=${encodeURIComponent(`Hi ${l.name}, it's Letlaka Clothing — thanks for your ${table === "enquiries" ? "message" : "quote request"}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-sun !px-4 !py-2 text-xs"
                    >
                      <MessageCircle size={14} /> Reply on WhatsApp
                    </a>
                    <a href={`tel:${l.phone}`} className="btn-ghost !px-4 !py-2 text-xs">
                      <Phone size={14} /> Call
                    </a>
                    <select
                      value={l.status}
                      onChange={(e) => setStatus(l, e.target.value)}
                      aria-label="Status"
                      className="field !w-auto !rounded-full !py-2 text-xs font-bold [&>option]:text-black"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => remove(l)} aria-label="Delete request" className="ml-auto grid h-9 w-9 place-items-center rounded-full text-ruby hover:bg-ruby/15">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
