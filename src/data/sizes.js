// Sizes the admin can offer on a product. If none are chosen, sensible defaults
// are used for the category (headwear = one size).
export const ALL_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "One size"];
const DEFAULT = ["S", "M", "L", "XL", "2XL"];

export function sizesFor(p) {
  if (p.sizes && p.sizes.length) return ALL_SIZES.filter((s) => p.sizes.includes(s));
  return p.cat === "Headwear" ? ["One size"] : DEFAULT;
}
