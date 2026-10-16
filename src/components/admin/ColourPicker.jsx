import React from "react";
import { Check } from "lucide-react";

// Named colours so nobody has to know what "#FFA000" means.
export const PALETTE = [
  ["Black", "#111111"],
  ["White", "#FFFFFF"],
  ["Grey", "#9A9A9A"],
  ["Navy", "#1B2A59"],
  ["Royal blue", "#1F4FE0"],
  ["Sky blue", "#5BB8F5"],
  ["Green", "#12803A"],
  ["Lime", "#B6F23A"],
  ["Mint", "#7DF0B0"],
  ["Yellow", "#FFC928"],
  ["Orange", "#FF6A00"],
  ["Red", "#D7263D"],
  ["Maroon", "#7A1530"],
  ["Pink", "#F2619C"],
  ["Purple", "#7B3FB0"],
  ["Brown", "#7A4B2A"],
  ["Cream", "#F4EFE6"],
];

export const colourName = (hex) => PALETTE.find(([, h]) => h.toLowerCase() === (hex || "").toLowerCase())?.[0];

export default function ColourPicker({ value, onPick }) {
  const current = (value || "").toLowerCase();
  const isCustom = current && !colourName(current);
  return (
    <div>
      <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-bone/45">
        Main colour {value ? `— ${colourName(value) || "custom"}` : "(optional)"}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {PALETTE.map(([name, hex]) => {
          const on = current === hex.toLowerCase();
          return (
            <button
              type="button"
              key={hex}
              title={name}
              aria-label={name}
              aria-pressed={on}
              onClick={() => onPick(on ? "" : hex, name)}
              className={`relative grid h-8 w-8 place-items-center rounded-full ring-1 ring-white/30 transition hover:scale-110 ${on ? "ring-2 ring-sun" : ""}`}
              style={{ background: hex }}
            >
              {on && <Check size={14} className={["#ffffff", "#f4efe6", "#ffc928", "#b6f23a", "#7df0b0"].includes(hex.toLowerCase()) ? "text-ink" : "text-white"} />}
            </button>
          );
        })}
        <label
          title="Pick any other colour"
          className={`relative grid h-8 cursor-pointer place-items-center overflow-hidden rounded-full border border-dashed px-3 text-[0.65rem] font-bold text-bone/70 hover:border-sun hover:text-sun ${isCustom ? "border-sun text-sun" : "border-white/30"}`}
        >
          {isCustom ? (
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full ring-1 ring-white/50" style={{ background: value }} /> Custom
            </span>
          ) : (
            "Other…"
          )}
          <input
            type="color"
            value={/^#[0-9a-f]{6}$/i.test(value || "") ? value : "#ffffff"}
            onChange={(e) => onPick(e.target.value.toUpperCase(), "")}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Pick a custom colour"
          />
        </label>
        {value && (
          <button type="button" onClick={() => onPick("", "")} className="text-[0.65rem] font-semibold text-bone/50 underline underline-offset-2 hover:text-sun">
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
