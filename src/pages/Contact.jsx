import React, { useState } from "react";
import { Phone, Instagram, Facebook, MessageCircle, CheckCircle2, Loader2 } from "lucide-react";
import { submitLead } from "../lib/leads.js";
import { PHONES, SOCIALS, waLink } from "../config.js";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const summary = `Hi Letlaka, it's ${form.name}. ${form.message}\n\nMy number: ${form.phone}`;

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const res = await submitLead("enquiries", form, "VITE_EMAILJS_CONTACT_TEMPLATE_ID", form);
    setResult(res);
    setStatus("done");
  }

  return (
    <main className="pt-[72px]">
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-16 md:px-8 md:pt-24">
        <p className="reveal eyebrow text-sun">Contact</p>
        <h1 className="reveal mt-4 font-display text-5xl font-extrabold leading-[0.95] md:text-8xl" data-d="1">
          Say hello.
        </h1>
        <p className="reveal mt-6 max-w-xl text-base text-bone/65 md:text-lg" data-d="2">
          Questions, quotes or just want to see more? Reach us any way that suits you.
        </p>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {PHONES.map((p, i) => (
              <a
                key={p.tel}
                href={`tel:${p.tel}`}
                data-d={i}
                className="reveal group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-sun"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-sun text-ink">
                  <Phone size={22} />
                </span>
                <span>
                  <span className="eyebrow block text-[0.6rem] text-bone/45">Call</span>
                  <span className="mt-1 block font-display text-xl font-bold md:text-2xl">{p.display}</span>
                </span>
              </a>
            ))}
            <a
              href={waLink("Hi Letlaka, I'd like to ask about…")}
              target="_blank"
              rel="noreferrer"
              className="reveal flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#25D366]"
              data-d="1"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#25D366] text-ink">
                <MessageCircle size={22} />
              </span>
              <span>
                <span className="eyebrow block text-[0.6rem] text-bone/45">WhatsApp</span>
                <span className="mt-1 block font-display text-xl font-bold md:text-2xl">Chat with us</span>
              </span>
            </a>
            <a
              href={SOCIALS.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="reveal flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-flame"
              data-d="2"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-flame text-ink">
                <Instagram size={22} />
              </span>
              <span>
                <span className="eyebrow block text-[0.6rem] text-bone/45">Instagram</span>
                <span className="mt-1 block font-display text-xl font-bold md:text-2xl">{SOCIALS.instagram.label}</span>
              </span>
            </a>
            <a
              href={SOCIALS.facebook.url}
              target="_blank"
              rel="noreferrer"
              className="reveal flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#4C8BF5]"
              data-d="3"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#4C8BF5] text-ink">
                <Facebook size={22} />
              </span>
              <span>
                <span className="eyebrow block text-[0.6rem] text-bone/45">Facebook</span>
                <span className="mt-1 block font-display text-xl font-bold md:text-2xl">{SOCIALS.facebook.label}</span>
              </span>
            </a>
          </div>

          <div className="reveal rounded-3xl bg-bone p-6 text-ink md:p-10" data-d="1">
            {status === "done" ? (
              <div className="py-10 text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink text-sun">
                  <CheckCircle2 size={30} />
                </span>
                <h2 className="mt-6 font-display text-3xl font-extrabold">
                  {result?.saved || result?.emailed ? "Message sent." : "Almost there."}
                </h2>
                <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink/65">
                  {result?.saved || result?.emailed
                    ? "Thanks — we’ll get back to you soon. Want a faster reply? Send it on WhatsApp too."
                    : "Send your message on WhatsApp — it’s pre-filled and ready to go."}
                </p>
                <a href={waLink(summary)} target="_blank" rel="noreferrer" className="btn-ink mt-8">
                  <MessageCircle size={17} /> Send on WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <h2 className="font-display text-2xl font-extrabold md:text-3xl">Send a message</h2>
                <div className="mt-8 grid gap-5">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-ink/50">Name *</span>
                    <input required value={form.name} onChange={set("name")} className="field-light" autoComplete="name" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-ink/50">Phone / WhatsApp *</span>
                    <input required type="tel" value={form.phone} onChange={set("phone")} className="field-light" autoComplete="tel" placeholder="+27…" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-ink/50">Message *</span>
                    <textarea required rows={5} value={form.message} onChange={set("message")} className="field-light resize-y" />
                  </label>
                </div>
                <button type="submit" disabled={status === "sending"} className="btn-ink mt-8 w-full disabled:opacity-60">
                  {status === "sending" ? (
                    <>
                      <Loader2 size={17} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    "Send message"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
