import React from "react";
import { SHOW_PRICES } from "../config.js";

export const money = (n) => `R${Number(n).toLocaleString("en-ZA")}`;

export const isSpecial = (p) =>
  p.salePrice != null && p.price != null && Number(p.salePrice) < Number(p.price);

// Shows the price, or the sale price with the old price struck through.
export default function Price({ p, large = false, className = "" }) {
  if (!SHOW_PRICES || p.price == null) return null;
  const sale = isSpecial(p);
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={`font-display font-extrabold ${large ? "text-3xl" : "text-base"} ${sale ? "text-flame" : ""}`}>
        {money(sale ? p.salePrice : p.price)}
      </span>
      {sale && (
        <span className={`text-bone/40 line-through ${large ? "text-base" : "text-xs"}`}>{money(p.price)}</span>
      )}
    </span>
  );
}
