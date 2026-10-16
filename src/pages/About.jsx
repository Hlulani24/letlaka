import React from "react";
import { ArrowRight, Mountain, Eye, Feather, Hourglass, Shield, Sparkles } from "lucide-react";
import SectionHeading from "../components/SectionHeading.jsx";
import { href } from "../lib/router.js";
import { BRAND } from "../config.js";

// Story supplied by Letlaka Clothing.
const PILLARS = [
  [Shield, "Strength & endurance", "Vultures are built for harsh environments. Letlaka encourages people to stay strong, stand firm and never give up on their dreams."],
  [Eye, "Vision & focus", "With exceptional eyesight, a vulture spots opportunity from far away — a reminder to keep a clear vision and stay on your goals."],
  [Feather, "Freedom & elevation", "Soaring high stands for freedom and independence: break boundaries, believe in yourself and rise above limitations."],
  [Hourglass, "Patience & strategy", "A vulture uses the wind to its advantage. Success comes from making the right moves at the right time, not from rushing."],
  [Mountain, "Adaptability & survival", "Adjust, learn, overcome setbacks and keep growing — whatever the circumstances."],
  [Sparkles, "Confidence & individuality", "A distinctive presence in the sky. Letlaka is for people who wear their confidence and stand out without losing touch with their roots."],
];

export default function About() {
  return (
    <main className="pt-[72px]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -right-32 top-0 -z-10 h-[460px] w-[460px] rounded-full bg-sun/15 blur-[110px]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 pt-16 md:px-8 md:pt-24 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="reveal eyebrow text-sun">The story of Letlaka Clothing</p>
            <h1 className="reveal mt-4 font-display text-5xl font-extrabold leading-[0.95] md:text-8xl" data-d="1">
              Inspired by the mountains.
              <br />
              <span className="text-sun">Built to rise.</span>
            </h1>
            <p className="reveal mt-8 max-w-xl text-base leading-relaxed text-bone/70 md:text-lg" data-d="2">
              Letlaka Clothing is more than a clothing brand. It is a symbol of strength, resilience, freedom, ambition
              and the courage to rise above every challenge. Established in {BRAND.established}.
            </p>
          </div>
          <div className="reveal relative mx-auto w-full max-w-xs" data-d="2">
            <img
              src="/images/badge-logo.jpg"
              alt="Letlaka Clothing established 2018 badge"
              className="aspect-square w-full rounded-full object-cover shadow-2xl ring-1 ring-white/15"
            />
          </div>
        </div>
      </section>

      {/* Roots */}
      <section className="border-y border-white/10 bg-coal py-24 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow="Rooted in Matlakeng, Zastron" title="Where the name comes from." />
            <div className="reveal mt-8 space-y-5 text-base leading-relaxed text-bone/70" data-d="1">
              <p>
                Letlaka was inspired by the magnificent mountains of Matlakeng in Zastron, Free State, South Africa. They
                stand for a powerful connection to our roots — and a reminder that greatness is built on a strong
                foundation, and that true strength stands firm even in the toughest conditions.
              </p>
              <p>
                The name <strong className="text-bone">Letlaka</strong> means <strong className="text-sun">vulture</strong>.
                A bird of sharp vision, patience, intelligence, endurance and adaptability, it uses the wind to reach
                great heights — rising above obstacles and seeing opportunity where others see limits.
              </p>
              <p>
                Just as mountains remain firm through changing seasons, Letlaka is built on perseverance, loyalty to its
                origins and the determination to keep climbing.
              </p>
            </div>
          </div>
          <div className="reveal relative mx-auto w-full max-w-md" data-d="2">
            <img
              src="/images/vulture-tee-black.jpg"
              alt="Letlaka vulture graphic tee — the real silence is power"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>
      </section>

      {/* The vulture */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionHeading
          eyebrow="The power of the vulture"
          title="A symbol. A mindset."
          intro="The vulture is not just a symbol; it represents the mindset Letlaka stands for."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map(([Icon, t, d], i) => (
            <div key={t} data-d={i % 3} className="reveal rounded-2xl bg-bone p-8 text-ink">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-sun">
                  <Icon size={19} />
                </span>
                <span className="font-display text-sm font-extrabold text-flame">0{i + 1}</span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-extrabold">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* More than fashion */}
      <section className="border-y border-white/10 bg-coal py-24 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <img
            src="/images/tracksuits-street.jpg"
            alt="Letlaka tracksuit sets worn by five people"
            loading="lazy"
            className="reveal aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-white/10"
          />
          <div>
            <SectionHeading eyebrow="More than fashion" title="A mindset, not just a label." />
            <div className="reveal mt-8 space-y-5 text-base leading-relaxed text-bone/70" data-d="1">
              <p>
                Since {BRAND.established}, Letlaka has stood for a lifestyle, a mentality and a belief that your background
                does not determine your destination. Every design carries ambition. Every piece represents confidence.
                Every detail reflects the desire to grow, evolve and make a statement.
              </p>
              <p>
                It is for the dreamers, the builders, the creators and the hustlers — everyone who understands that
                success takes patience, courage and persistence. You can come from a small place and carry a vision big
                enough to reach the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision / mission */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="reveal rounded-3xl border border-white/10 p-8 md:p-10">
            <p className="eyebrow text-sun">Our vision</p>
            <p className="mt-5 font-display text-2xl font-bold leading-snug md:text-3xl">
              To grow Letlaka Clothing into a recognised brand that represents strength, originality, confidence and African
              identity — inspiring people to embrace who they are and pursue their ambitions without fear.
            </p>
          </div>
          <div className="reveal rounded-3xl border border-white/10 p-8 md:p-10" data-d="1">
            <p className="eyebrow text-sun">Our mission</p>
            <p className="mt-5 font-display text-2xl font-bold leading-snug md:text-3xl">
              To create clothing that combines distinctive style with a powerful message, so people can express their
              individuality while representing resilience, focus, freedom and determination.
            </p>
          </div>
        </div>

        <div className="reveal mt-5 rounded-3xl bg-sun p-8 text-ink md:p-12" data-d="2">
          <p className="eyebrow text-ink/60">The Letlaka philosophy</p>
          <div className="mt-5 grid gap-4 font-display text-xl font-extrabold leading-snug md:grid-cols-3 md:text-2xl">
            <p>We are inspired by the mountains that stand tall and the vulture that soars high.</p>
            <p>We believe in seeing further, standing stronger, moving smarter and rising higher.</p>
            <p>We respect our roots, embrace our journey and stay focused on our future.</p>
          </div>
        </div>
      </section>

      {/* Sign-off */}
      <section className="bg-ink pb-24 text-center md:pb-32">
        <p className="outline-text mx-auto max-w-full overflow-hidden px-5 font-display font-extrabold leading-none" style={{ fontSize: "clamp(2rem,8vw,6rem)" }}>
          ROOTED IN THE MOUNTAINS.
        </p>
        <p className="mt-2 font-display text-2xl font-extrabold md:text-4xl">Born to soar. Built to rise.</p>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-bone/45">
          Est. {BRAND.established} · Matlakeng, Zastron, Free State, South Africa
        </p>
      </section>

      <section className="bg-sun py-20 text-ink md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 md:flex-row md:items-center md:px-8">
          <h2 className="reveal font-display text-4xl font-extrabold leading-[1] md:text-6xl">Ready to wear the wing?</h2>
          <div className="reveal flex flex-wrap gap-3" data-d="1">
            <a href={href("collections")} className="btn-ink">
              Browse collections <ArrowRight size={17} />
            </a>
            <a href={href("custom")} className="btn border border-ink/30 hover:bg-ink hover:text-sun">
              Custom order
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
