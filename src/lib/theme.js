// "Pick a colourway" — the accent colour of the whole site follows the choice.
const KEY = "letlaka.theme";

export const THEMES = [
  { id: "sun", name: "Sun", rgb: "255 210 63", hex: "#FFD23F", img: "/images/hoodie-sets-trio.jpg", alt: "Letlaka hoodie sets in orange, white and black" },
  { id: "flame", name: "Flame", rgb: "255 106 31", hex: "#FF6A1F", img: "/images/crew-black-orange-green.jpg", alt: "Black crewneck with orange and green print" },
  { id: "mint", name: "Mint", rgb: "125 240 176", hex: "#7DF0B0", img: "/images/crew-black-lime.jpg", alt: "Black crewneck with lime print" },
  { id: "ruby", name: "Ruby", rgb: "255 94 112", hex: "#FF5E70", img: "/images/hoodie-grey-red.jpg", alt: "Grey hoodie with red print" },
  { id: "royal", name: "Royal", rgb: "110 150 255", hex: "#6E96FF", img: "/images/crew-blue-orange.jpg", alt: "Royal blue crewneck with orange print" },
];

export function getThemeId() {
  try {
    const id = sessionStorage.getItem(KEY);
    return THEMES.some((t) => t.id === id) ? id : "sun";
  } catch {
    return "sun";
  }
}

export function applyTheme(id) {
  const t = THEMES.find((x) => x.id === id) || THEMES[0];
  document.documentElement.style.setProperty("--sun", t.rgb);
  try {
    sessionStorage.setItem(KEY, t.id);
  } catch {
    /* ignore */
  }
  return t;
}
