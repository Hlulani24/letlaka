import React from "react";

export default function SectionHeading({ eyebrow, title, intro, light = false, className = "" }) {
  return (
    <div className={`reveal max-w-2xl ${className}`}>
      <p className={`eyebrow ${light ? "text-flame" : "text-sun"}`}>{eyebrow}</p>
      <h2
        className={`mt-4 font-display text-4xl font-extrabold leading-[1.02] md:text-6xl ${
          light ? "text-ink" : "text-bone"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`mt-5 text-base leading-relaxed md:text-lg ${light ? "text-ink/65" : "text-bone/65"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}
