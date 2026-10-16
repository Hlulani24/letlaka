import React, { useState } from "react";
import { ArrowRight, ArrowUpRight, PenTool, Palette, CheckCircle2, Package, Users, Shirt, Ruler } from "lucide-react";
import Marquee from "../components/Marquee.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductModal from "../components/ProductModal.jsx";
import { isSpecial } from "../components/Price.jsx";
import { LOOKBOOK } from "../data/products.js";
import { useProducts } from "../lib/store.js";
import { THEMES, applyTheme, getThemeId } from "../lib/theme.js";
import { href } from "../lib/router.js";
import { BRAND, SHOW_PRICES } from "../config.js";

const TILES = [
  ["Hoodies & Sets", "/images/hoodie-sets-trio.jpg"],
  ["Crewnecks", "/images/crew-set-black-neon.jpg"],
  ["Tees", "/images/face-tee-black.jpg"],
  ["Polos & Kit", "/images/football-jersey.jpg"],
  ["Knitwear", "/images/knit-vneck-black.jpg"],
  ["Headwear", "/images/caps-five-panel.jpg"],
];

const SWATCHES = ["#FF6A00", "#FFFFFF", "#111111", "#9A9A9A", "#FFC928", "#D7263D", "#F2619C", "#1F4FE0", "#12803A"];

const STEPS = [
  { icon: PenTool, t: "Tell us what you need", d: "Garment, quantity, colours and your logo or crest — send it through the form or WhatsApp." },
  { icon: Palette, t: "We design the look", d: "You get a mock-up of your colourway, print placement and sleeve or leg detailing." },
  { icon: CheckCircle2, t: "You approve", d: "Tweak anything until it is exactly right. Nothing is produced before you say so." },
  { icon: Package, t: "Made and delivered", d: "Your order is produced, finished and handed over — ready to wear." },
];

export default function Home() {
  const [open, setOpen] = useState(null);
  const [themeId, setThemeId] = useState(getThemeId);
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const pick = (id) => {
    applyTheme(id);
    setThemeId(id);
  };
  const { products } = useProducts();
  const featured = products.filter((p) => p.featured);
  const specials = products.filter(isSpecial);

  return (
    <main>
      {/* ───────── HERO */}
      <section className="relative isolate overflow-hidden pt-[72px]">
        <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[620px] w-[620px] rounded-full bg-sun/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-52 -left-40 -z-10 h-[520px] w-[520px] rounded-full bg-flame/15 blur-[120px]" />

        <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-10 px-5 pb-16 pt-10 md:px-8 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="reveal eyebrow flex items-center gap-3 text-sun">
              <span className="h-px w-10 bg-sun" /> Est. {BRAND.established} · Letlaka Clothing
            </p>
            <h1 className="reveal mt-6 font-display text-[clamp(3.6rem,11vw,9rem)] font-extrabold leading-[0.88] tracking-tight" data-d="1">
              Wear
              <br />
              the <span className="text-sun">wing.</span>
            </h1>
            <p className="reveal mt-8 max-w-md text-base leading-relaxed text-bone/70 md:text-lg" data-d="2">
              Hoodies, tracksuits, tees, knitwear, headwear and club kit — designed in bold colour and
              made to order for you, your team or your school.
            </p>
            <div className="reveal mt-10 flex flex-wrap gap-3" data-d="3">
              <a href={href("collections")} className="btn-sun">
                Explore collections <ArrowRight size={17} />
              </a>
              <a href={href("custom")} className="btn-ghost">
                Start a custom order
              </a>
            </div>

            <div className="reveal mt-10 flex items-center gap-4" data-d="3">
              <p className="eyebrow text-[0.62rem] text-bone/45">
                Pick a colourway · <span className="text-sun">{theme.name}</span>
              </p>
              <div className="flex gap-2" role="radiogroup" aria-label="Colourway">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={t.id === themeId}
                    aria-label={t.name}
                    onClick={() => pick(t.id)}
                    className={`h-7 w-7 rounded-full transition ${
                      t.id === themeId ? "scale-110 ring-2 ring-bone ring-offset-2 ring-offset-ink" : "opacity-80 hover:scale-110 hover:opacity-100"
                    }`}
                    style={{ background: t.hex }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Collage */}
          <div className="relative mx-auto h-[460px] w-full max-w-[560px] md:h-[620px]">
            <figure
              className="floaty absolute left-[4%] top-[6%] w-[52%] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
              style={{ "--r": "-4deg" }}
            >
              <img key={theme.id} src={theme.img} alt={theme.alt} className="fade-scale aspect-[4/5] w-full object-cover" />
            </figure>
            <figure
              className="floaty absolute right-0 top-0 w-[40%] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
              style={{ "--r": "5deg", animationDelay: "-2s" }}
            >
              <img src="/images/knit-vneck-black.jpg" alt="Letter knit V-neck sweater" className="aspect-[4/5] w-full object-cover object-center" />
            </figure>
            <figure
              className="floaty absolute bottom-[4%] right-[8%] w-[46%] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
              style={{ "--r": "-2deg", animationDelay: "-4s" }}
            >
              <img src="/images/caps-five-panel.jpg" alt="Reflective five-panel caps" className="aspect-square w-full object-cover" />
            </figure>
            <figure
              className="floaty absolute bottom-0 left-0 w-[34%] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
              style={{ "--r": "6deg", animationDelay: "-1s" }}
            >
              <img src="/images/crew-blue-orange.jpg" alt="Royal blue crewneck" className="aspect-[4/5] w-full object-cover" />
            </figure>
            <div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-sun text-center font-display text-[0.62rem] font-extrabold uppercase leading-tight tracking-widest text-ink shadow-xl">
              Est.
              <br />
              <span className="text-2xl leading-none">2018</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── MARQUEE */}
      <div className="border-y border-ink bg-sun py-4 text-ink">
        <Marquee items={["Hoodies", "Tracksuits", "Tees", "Knitwear", "Headwear", "Club kit", "Est. 2018", "Letlaka"]} />
      </div>

      <div className="border-b border-white/10 py-6">
        <Marquee outline items={["Wear the wing", "Made to order", "Letlaka", "Est. 2018"]} />
      </div>

      {/* ───────── CATEGORIES */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="The collections" title="Pick your piece." />
          <a href={href("collections")} className="reveal btn-ghost">
            View everything <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {TILES.map(([name, src], i) => (
            <a
              key={name}
              href={href(`collections?cat=${encodeURIComponent(name)}`)}
              data-d={(i % 3) + 1}
              className="reveal group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-coal"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-6">
                <h3 className="font-display text-xl font-extrabold leading-tight md:text-3xl">{name}</h3>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sun text-ink transition group-hover:rotate-45 md:h-11 md:w-11">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ───────── FEATURED */}
      <section className="border-t border-white/10 bg-coal py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow="Featured"
            title="Right now."
            intro="A few of the pieces people ask for first. Tap any one to see every angle and colourway."
          />
        </div>
        <div className="no-scrollbar mx-auto mt-14 flex max-w-7xl snap-x gap-5 overflow-x-auto px-5 pb-4 md:gap-7 md:px-8">
          {featured.map((p, i) => (
            <div key={p.id} className="w-[72%] shrink-0 snap-start sm:w-[44%] lg:w-[26%]">
              <ProductCard p={p} onOpen={setOpen} delay={(i % 3) + 1} />
            </div>
          ))}
        </div>
      </section>

      {/* ───────── SPECIALS (only when the admin has set a sale price) */}
      {SHOW_PRICES && specials.length > 0 && (
        <section className="border-t border-white/10 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow="Specials" title="Priced to move." />
              <a href={href("collections?cat=Specials")} className="reveal btn-ghost">
                All specials <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="no-scrollbar mx-auto mt-12 flex max-w-7xl snap-x gap-5 overflow-x-auto px-5 pb-4 md:gap-7 md:px-8">
            {specials.map((p, i) => (
              <div key={p.id} className="w-[72%] shrink-0 snap-start sm:w-[44%] lg:w-[26%]">
                <ProductCard p={p} onOpen={setOpen} delay={(i % 3) + 1} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ───────── COLOUR RANGE */}
      <section className="bg-bone py-24 text-ink md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
          <div className="reveal relative">
            <img
              src="/images/hoodies-seven.jpg"
              alt="Seven Letlaka hoodies in different colours"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl"
            />
            <div className="absolute -bottom-5 -right-2 hidden rounded-2xl bg-ink px-6 py-4 text-bone shadow-xl md:block">
              <p className="eyebrow text-sun">Seven shown</p>
              <p className="mt-1 text-sm text-bone/70">…and any colour you can imagine.</p>
            </div>
          </div>
          <div>
            <SectionHeading
              light
              eyebrow="Colour is the point"
              title="Any colour. Your colours."
              intro="Every Letlaka piece is made to order, so the colourway is yours to decide — garment, print, sleeve stripe and badge. Match your school, your club, your crew."
            />
            <div className="reveal mt-9 flex flex-wrap gap-3" data-d="1">
              {SWATCHES.map((c) => (
                <span key={c} className="h-11 w-11 rounded-full ring-1 ring-ink/15" style={{ background: c }} />
              ))}
            </div>
            <ul className="reveal mt-10 grid gap-4 sm:grid-cols-2" data-d="2">
              {[
                [Shirt, "Wing logo, wordmark or your own crest"],
                [Palette, "Custom print & stripe colours"],
                [Ruler, "Size runs to suit your group"],
                [Users, "Teams, schools, clubs & crews"],
              ].map(([Icon, t]) => (
                <li key={t} className="flex items-start gap-3 text-sm font-semibold">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-sun">
                    <Icon size={16} />
                  </span>
                  <span className="pt-1.5">{t}</span>
                </li>
              ))}
            </ul>
            <a href={href("custom")} className="btn-ink reveal mt-10" data-d="3">
              Design yours <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* ───────── TEAM / CLUB BAND */}
      <section className="relative isolate overflow-hidden bg-ruby py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="reveal eyebrow text-sun">Teams · Schools · Clubs</p>
            <h2 className="reveal mt-4 font-display text-4xl font-extrabold leading-[1.02] md:text-6xl" data-d="1">
              Kit your whole squad.
            </h2>
            <p className="reveal mt-6 max-w-lg text-base leading-relaxed text-white/80 md:text-lg" data-d="2">
              Match jerseys, tracksuits, polos, caps and knitwear — with crests, sponsor marks, names and
              numbers. One consistent look, from the first-team to the supporters.
            </p>
            <div className="reveal mt-9 flex flex-wrap gap-3" data-d="3">
              <a href={href("custom")} className="btn-sun">
                Request a team quote <ArrowRight size={17} />
              </a>
              <a href={href("collections?cat=Polos%20%26%20Kit")} className="btn-ghost !border-white/50">
                See kit
              </a>
            </div>
          </div>
          <div className="reveal relative mx-auto w-full max-w-md">
            <img
              src="/images/football-jersey.jpg"
              alt="Black and lime Letlaka match kit jersey"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-white/20"
            />
          </div>
        </div>
      </section>

      {/* ───────── PROCESS */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionHeading eyebrow="How it works" title="From idea to wearable." />
        <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, t, d }, i) => (
            <li
              key={t}
              data-d={i % 4}
              className="reveal rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-sun/50"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-sun text-ink">
                  <Icon size={20} />
                </span>
                <span className="font-display text-5xl font-extrabold text-white/10">0{i + 1}</span>
              </div>
              <h3 className="mt-8 font-display text-xl font-bold">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-bone/60">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────── LOOKBOOK PREVIEW */}
      <section className="border-t border-white/10 bg-coal py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Lookbook" title="Seen in colour." />
            <a href={href("lookbook")} className="reveal btn-ghost">
              Full lookbook <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {[LOOKBOOK[4], LOOKBOOK[8], LOOKBOOK[2], LOOKBOOK[5], LOOKBOOK[9], LOOKBOOK[11], LOOKBOOK[7], LOOKBOOK[3]].map(
              (l, i) => (
                <a
                  key={l.src}
                  href={href("lookbook")}
                  data-d={i % 4}
                  className="reveal group relative block aspect-square overflow-hidden rounded-2xl bg-black"
                >
                  <img
                    src={l.src}
                    alt={l.caption}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </a>
              )
            )}
          </div>
        </div>
      </section>

      {/* ───────── CTA */}
      <section className="bg-sun py-24 text-ink md:py-32">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
          <h2 className="reveal font-display text-5xl font-extrabold leading-[0.95] md:text-8xl">
            Let’s make
            <br />
            something loud.
          </h2>
          <p className="reveal mx-auto mt-7 max-w-lg text-base font-medium text-ink/70 md:text-lg" data-d="1">
            Tell us what you have in mind — we’ll come back with ideas, colours and a quote.
          </p>
          <div className="reveal mt-10 flex flex-wrap justify-center gap-3" data-d="2">
            <a href={href("custom")} className="btn-ink">
              Start a custom order <ArrowRight size={17} />
            </a>
            <a href={href("contact")} className="btn border border-ink/30 hover:bg-ink hover:text-sun">
              Contact us
            </a>
          </div>
        </div>
      </section>

      {open && <ProductModal p={open} onClose={() => setOpen(null)} />}
    </main>
  );
}
