// Single place to edit brand details. Everything on the site reads from here.

export const BRAND = {
  name: "Letlaka Clothing",
  short: "Letlaka",
  established: 2018,
  tagline: "Wear the wing.",
};

// From the contact card the client supplied.
export const PHONES = [
  { display: "+27 67 774 5340", tel: "+27677745340" },
  { display: "+27 78 727 1731", tel: "+27787271731" },
];

// WhatsApp uses the first number. Change if the other one is the WhatsApp line.
export const WHATSAPP_NUMBER = "27677745340";

export const SOCIALS = {
  facebook: { label: "Letlaka Clothing", url: "https://www.facebook.com/search/top?q=Letlaka%20Clothing" },
  // TODO confirm the exact handle with the client (card reads "@LETLAKA CLOTHING").
  instagram: { label: "@letlakaclothing", url: "https://www.instagram.com/letlakaclothing/" },
};

// Optional extra social links. Paste the full profile URL to show one in the footer; leave "" to hide it.
// (Links only — nothing needs a phone number or login. WhatsApp uses WHATSAPP_NUMBER above.)
export const EXTRA_SOCIALS = [
  { label: "TikTok", url: "" }, // e.g. https://www.tiktok.com/@letlakaclothing
  { label: "YouTube", url: "" }, // e.g. https://www.youtube.com/@letlakaclothing
  { label: "X / Twitter", url: "" }, // e.g. https://x.com/letlakaclothing
];

// Set false to hide the small "Concept design" tags on mock-up products.
export const SHOW_CONCEPT_TAGS = true;

// Show prices on the public site. Prices are managed in the admin panel.
export const SHOW_PRICES = true;
export const PRICE_NOTE =
  "Prices are per item and indicative. Bulk, team and custom orders are quoted individually.";

export function waLink(text = "") {
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${WHATSAPP_NUMBER}${q}`;
}
