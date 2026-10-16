import React from "react";

// outline = giant hollow lettering (decorative section divider)
export default function Marquee({ items, className = "", outline = false }) {
  const row = [...items, ...items];
  const textStyle = outline
    ? { WebkitTextStroke: "1.5px rgb(244 239 230 / 0.45)", color: "transparent" }
    : undefined;
  return (
    <div className={`marquee overflow-hidden ${className}`} aria-hidden="true">
      <div className="marquee-track" style={outline ? { animationDuration: "55s" } : undefined}>
        {row.map((t, i) => (
          <span
            key={i}
            style={textStyle}
            className={`flex items-center whitespace-nowrap font-display font-extrabold uppercase ${
              outline ? "text-6xl tracking-tight md:text-9xl" : "text-lg tracking-[0.2em] md:text-2xl"
            }`}
          >
            {t}
            <span
              className={`inline-block rotate-45 ${
                outline ? "mx-8 h-3 w-3 bg-sun md:mx-14 md:h-4 md:w-4" : "mx-6 h-2 w-2 bg-current md:mx-10"
              }`}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
