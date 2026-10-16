// Catalogue built from the photos the client supplied.
// status: "core"    = real product photography
//         "concept" = mock-up / design render (shows a small "Concept design" tag)
// Prices below are DUMMY demo prices (ZAR) so the admin panel and specials can be
// demonstrated. Replace them from the admin panel before going live.
// The site takes enquiries and quotes, not payments.

const img = (n) => `/images/${n}.jpg`;

// Categories a product can belong to (the "All" / "Specials" filters are added by the site).
export const PRODUCT_CATEGORIES = [
  "Hoodies & Sets",
  "Crewnecks",
  "Tees",
  "Polos & Kit",
  "Knitwear",
  "Headwear",
];

export const CATEGORIES = ["All", ...PRODUCT_CATEGORIES];

const RAW = [
  // ───────── Hoodies & Sets
  {
    id: "signature-hoodie-set",
    name: "Signature Hoodie Set",
    cat: "Hoodies & Sets",
    status: "core",
    featured: true,
    blurb:
      "Our wing mark across the chest, matched joggers and sharp sleeve and leg detailing. Built in a full run of colourways.",
    images: [
      { src: img("hoodie-sets-trio"), label: "Orange · White · Black" },
      { src: img("hoodie-sets-flatlay"), label: "Flat-lay" },
      { src: img("hoodie-sets-rainbow"), label: "Full colour range" },
      { src: img("hoodies-seven"), label: "Seven hoodie colours" },
      { src: img("tracksuits-street"), label: "On the street" },
    ],
  },
  {
    id: "wing-hoodie",
    name: "Wing Hoodie",
    cat: "Hoodies & Sets",
    status: "core",
    blurb: "Heavyweight fleece hoodie with the Letlaka wing and a lettered sleeve stripe.",
    images: [
      { src: img("hoodie-red-white"), label: "Red · White print", hex: "#E5482F" },
      { src: img("hoodie-grey-red"), label: "Grey · Red print", hex: "#A3A3A3" },
      { src: img("hoodies-seven"), label: "Colour range" },
      { src: img("hoodies-four-colours"), label: "White · Orange · Black · Red" },
    ],
  },

  // ───────── Crewnecks
  {
    id: "crewneck-jogger-set",
    name: "Crewneck + Jogger Set",
    cat: "Crewnecks",
    status: "core",
    featured: true,
    blurb:
      "The original Letlaka set: crewneck and jogger with two-tone sleeve and leg stripes and the lettered Letlaka run.",
    images: [
      { src: img("crew-set-grey-red"), label: "Heather grey · Red", hex: "#BDBDBD" },
      { src: img("crew-set-black-neon"), label: "Black · Neon orange & mint", hex: "#111111" },
    ],
  },
  {
    id: "stripe-crewneck",
    name: "Sleeve-Stripe Crewneck",
    cat: "Crewnecks",
    status: "core",
    blurb:
      "Statement crewneck with the wing chest print, tonal badge hit and a two-tone sleeve stripe. Pick any print and stripe colours.",
    images: [
      { src: img("crew-black-orange-green"), label: "Black · Orange & green", hex: "#111111" },
      { src: img("crew-blue-orange"), label: "Royal blue · Orange", hex: "#1F4FE0" },
      { src: img("crew-blue-green"), label: "Royal blue · Green badge", hex: "#2A5BEA" },
      { src: img("crew-red-mint"), label: "Red · Mint & orange", hex: "#E5392B" },
      { src: img("crew-black-green-red"), label: "Black · Green & red", hex: "#1A1A1A" },
      { src: img("crew-black-lime"), label: "Black · Lime & orange", hex: "#0E0E0E" },
    ],
  },

  // ───────── Tees
  {
    id: "artist-back-print",
    name: "Artist Back-Print Tee & Crew",
    cat: "Tees",
    status: "concept",
    featured: true,
    blurb:
      "An abstract colour-block portrait with a broken-letter Letlaka arch across the back. Tee or crewneck, black or white.",
    images: [
      { src: img("face-tee-black"), label: "Tee · Black", hex: "#111111" },
      { src: img("face-crew-black"), label: "Crewneck · Black", hex: "#111111" },
      { src: img("face-crew-white"), label: "Crewneck · White", hex: "#FFFFFF" },
    ],
  },
  {
    id: "varsity-tee",
    name: "Varsity Tee",
    cat: "Tees",
    status: "concept",
    blurb: "Collegiate arch lettering with “Est. 2018” and shoulder stripes.",
    images: [
      { src: img("varsity-tee-black"), label: "Black", hex: "#111111" },
      { src: img("varsity-tee-white"), label: "White", hex: "#FFFFFF" },
    ],
  },
  {
    id: "pinstripe-tee",
    name: "Pinstripe Shoulder Tee",
    cat: "Tees",
    status: "concept",
    blurb: "Minimal wordmark with a vertical double stripe and shoulder tape.",
    images: [{ src: img("stripe-tee-white"), label: "White", hex: "#FFFFFF" }],
  },
  {
    id: "script-18-tee",
    name: "Script ’18 Tee",
    cat: "Tees",
    status: "concept",
    blurb: "Baseball-script Letlaka with a number 18 and shoulder tape.",
    images: [{ src: img("script-tee-18"), label: "Black", hex: "#111111" }],
  },
  {
    id: "rose-garden-tee",
    name: "Rose Garden Tee",
    cat: "Tees",
    status: "concept",
    blurb: "Two roses on a gradient moon — pocket hit on the front, full artwork on the back.",
    images: [
      { src: img("rose-tee-back"), label: "Back print", hex: "#111111" },
      { src: img("rose-tee-front"), label: "Front pocket hit", hex: "#111111" },
      { src: img("floral-tee-white"), label: "Floral crest · White", hex: "#FFFFFF" },
    ],
  },
  {
    id: "all-over-wing-tee",
    name: "All-Over Wing Tee",
    cat: "Tees",
    status: "concept",
    blurb: "The wing mark repeated edge to edge with a contrast ringer collar.",
    images: [
      { src: img("aop-tee-white"), label: "White · Black collar", hex: "#FFFFFF" },
      { src: img("aop-tee-peach"), label: "Peach · Orange collar", hex: "#F4A58B" },
    ],
  },
  {
    id: "striped-ringer-tee",
    name: "Striped Ringer Tee",
    cat: "Tees",
    status: "concept",
    blurb: "Classic horizontal stripes with a small chest wordmark.",
    images: [{ src: img("striped-tee-red"), label: "Red · White", hex: "#E5392B" }],
  },

  // ───────── Polos & Kit
  {
    id: "heritage-stripe-polo",
    name: "Heritage Stripe Polo",
    cat: "Polos & Kit",
    status: "concept",
    featured: true,
    blurb:
      "Bold vertical panels in red, teal, yellow and black with a chunky Letlaka arch and three-stripe sleeves.",
    images: [
      { src: img("stripe-polo-a"), label: "Front view" },
      { src: img("stripe-polo-b"), label: "Alternate shot" },
      { src: img("stripe-polo-pink"), label: "Dusty pink", hex: "#E3A6B0" },
      { src: img("mannequin-stripe-polo"), label: "Styled" },
    ],
  },
  {
    id: "club-sports-polo",
    name: "Club Sports Polo",
    cat: "Polos & Kit",
    status: "concept",
    blurb: "Sublimated club polo with flowing panels, sleeve number and a woven collar. Any colours, any number.",
    images: [
      { src: img("sports-polo-navy"), label: "Navy & white", hex: "#1B2A7A" },
      { src: img("sports-polos-pair"), label: "Red & Navy", hex: "#C8202F" },
      { src: img("jersey-polo-red"), label: "Red & white", hex: "#C8202F" },
      { src: img("mannequin-navy-polo"), label: "Navy — styled", hex: "#1B2A7A" },
      { src: img("mannequin-red-polo"), label: "Red — styled", hex: "#C8202F" },
    ],
  },
  {
    id: "match-kit-jersey",
    name: "Match Kit Jersey",
    cat: "Polos & Kit",
    status: "concept",
    blurb:
      "Full-sublimation football jersey with geometric pattern work, number, sponsor wordmark and club crest. Shown with a sample club crest.",
    images: [{ src: img("football-jersey"), label: "Black · Lime", hex: "#0B1F1A" }],
  },

  // ───────── Knitwear
  {
    id: "letter-knit-vneck",
    name: "Letter Knit V-Neck",
    cat: "Knitwear",
    status: "concept",
    featured: true,
    blurb:
      "Cable-knit cricket-style V-neck with oversized scattered Letlaka letters and a red-and-white collar.",
    images: [
      { src: img("knit-vneck-black"), label: "Black", hex: "#111111" },
      { src: img("knit-vneck-pair"), label: "White & Black", hex: "#FFFFFF" },
    ],
  },
  {
    id: "letter-knit-cardigan",
    name: "Letter Knit Cardigan",
    cat: "Knitwear",
    status: "concept",
    blurb: "Button-through cardigan in the same letter jacquard with striped trims and patch pockets.",
    images: [
      { src: img("knit-cardigan"), label: "Black", hex: "#111111" },
      { src: img("cardigan-pair-couch"), label: "White & Black" },
      { src: img("cardigan-model"), label: "Worn" },
    ],
  },
  {
    id: "letter-knit-polo",
    name: "Letter Knit Polo",
    cat: "Knitwear",
    status: "concept",
    blurb: "Short-sleeve knit polo with tipped collar and cuffs in the signature letter pattern.",
    images: [
      { src: img("knit-polos-pair"), label: "White & Black" },
      { src: img("letter-polo-black"), label: "Black — printed", hex: "#111111" },
      { src: img("letter-polo-large"), label: "Black — close-up", hex: "#111111" },
    ],
  },

  // ───────── Headwear
  {
    id: "reflective-five-panel",
    name: "Reflective Five-Panel",
    cat: "Headwear",
    status: "concept",
    featured: true,
    blurb: "Lightweight five-panel with the wing mark and reflective speed streaks on the brim side.",
    images: [{ src: img("caps-five-panel"), label: "Black · Navy · White · Red · Royal" }],
  },
  {
    id: "varsity-five-panel",
    name: "Varsity Five-Panel",
    cat: "Headwear",
    status: "concept",
    blurb: "Arched Letlaka wordmark with “Est. 2018” and flag detail.",
    images: [
      { src: img("cap-varsity-black"), label: "Black", hex: "#111111" },
      { src: img("cap-varsity-white"), label: "White", hex: "#FFFFFF" },
    ],
  },
  {
    id: "varsity-bucket-hat",
    name: "Varsity Bucket Hat",
    cat: "Headwear",
    status: "concept",
    blurb: "Soft bucket hat with embroidered wordmark and flag.",
    images: [{ src: img("bucket-hat-white"), label: "White", hex: "#FFFFFF" }],
  },
  {
    id: "flag-beanie",
    name: "South Africa Flag Beanie",
    cat: "Headwear",
    status: "concept",
    blurb: "Ribbed beanie with embroidered Letlaka wordmark and the South African flag.",
    images: [
      { src: img("beanie-black"), label: "Black", hex: "#111111" },
      { src: img("beanie-white"), label: "White", hex: "#FFFFFF" },
    ],
  },
  {
    id: "rose-trucker",
    name: "Rose Crest Trucker",
    cat: "Headwear",
    status: "concept",
    blurb: "Foam-front trucker with the floral Letlaka Clothing crest.",
    images: [
      { src: img("trucker-green"), label: "Green", hex: "#12803A" },
      { src: img("trucker-pink"), label: "Pink", hex: "#F0338C" },
      { src: img("trucker-black"), label: "Black", hex: "#111111" },
    ],
  },
  // ───────── Added from the second photo batch
  {
    id: "vulture-silence-tee",
    name: "Vulture Silence Tee",
    cat: "Tees",
    status: "concept",
    featured: true,
    blurb:
      "Oversized tee with the Letlaka wing on the chest, lightning sleeve prints and a red vulture back graphic — “The real silence is power.”",
    images: [
      { src: img("vulture-tee-black"), label: "Black", hex: "#111111" },
      { src: img("vulture-tee-white"), label: "White", hex: "#FFFFFF" },
    ],
  },
  {
    id: "polo-sweatshirt",
    name: "Pinstripe Polo Sweatshirt",
    cat: "Polos & Kit",
    status: "concept",
    blurb: "Long-sleeve polo sweatshirt with fine pinstripes, wing badge, number 18 and ribbed cuffs.",
    images: [
      { src: img("polo-sweatshirt-red"), label: "Red", hex: "#D7263D" },
      { src: img("polo-sweatshirt-black"), label: "Black", hex: "#111111" },
    ],
  },
  {
    id: "script-knit-polo",
    name: "Script Knit Polo",
    cat: "Knitwear",
    status: "concept",
    blurb: "Ribbed knit polo with an oversized script logo and contrast collar and cuffs.",
    images: [{ src: img("script-knit-polo-brown"), label: "Black & rust", hex: "#A8541A" }],
  },
  {
    id: "letter-knit-dress",
    name: "Letter Knit Dress",
    cat: "Knitwear",
    status: "concept",
    blurb: "Button-through ribbed knit dress in the signature letter jacquard with striped trims.",
    images: [
      { src: img("knit-dress-model"), label: "Styled", hex: "#111111" },
      { src: img("knit-dress-flat"), label: "Flat view", hex: "#111111" },
    ],
  },
  // Hidden until the client confirms the artwork (brand name looks misspelled on these mock-ups).
  {
    id: "macaw-arrow-tee",
    name: "Macaw Arrow Tee",
    cat: "Tees",
    status: "concept",
    hidden: true,
    blurb: "Oversized tee with a macaw-and-arrows graphic. Check the artwork before publishing.",
    images: [{ src: img("parrot-tee-lifestyle"), label: "Black & White" }],
  },
  {
    id: "baseball-18-tee",
    name: "Baseball Script 18 Tee",
    cat: "Tees",
    status: "concept",
    hidden: true,
    blurb: "Black oversized tee with a baseball script and number 18. Check the artwork before publishing.",
    images: [{ src: img("baseball-18-tee-black"), label: "Black", hex: "#111111" }],
  },
];

// Dummy prices: [price, salePrice?]. A salePrice below price shows as a "Special".
const PRICING = {
  "signature-hoodie-set": [850],
  "wing-hoodie": [450, 390],
  "crewneck-jogger-set": [750],
  "stripe-crewneck": [380],
  "artist-back-print": [280],
  "varsity-tee": [240, 199],
  "pinstripe-tee": [220],
  "script-18-tee": [240],
  "rose-garden-tee": [260],
  "all-over-wing-tee": [300],
  "striped-ringer-tee": [240],
  "heritage-stripe-polo": [320],
  "club-sports-polo": [340],
  "match-kit-jersey": [380],
  "letter-knit-vneck": [650],
  "letter-knit-cardigan": [780],
  "letter-knit-polo": [450],
  "reflective-five-panel": [180],
  "varsity-five-panel": [170],
  "varsity-bucket-hat": [190],
  "flag-beanie": [150, 120],
  "rose-trucker": [160],
  "vulture-silence-tee": [320],
  "polo-sweatshirt": [480],
  "script-knit-polo": [520],
  "letter-knit-dress": [620],
  "macaw-arrow-tee": [300],
  "baseball-18-tee": [260],
};

// Starting catalogue (used when no database is connected, and as the starter data for it).
export const SEED_PRODUCTS = RAW.map((p, i) => ({
  ...p,
  price: PRICING[p.id]?.[0] ?? null,
  salePrice: PRICING[p.id]?.[1] ?? null,
  visible: !p.hidden,
  sort: i,
}));

// Photos for the lookbook page (src, caption, tall = taller crop).
export const LOOKBOOK = [
  { src: img("hoodie-sets-trio"), caption: "Signature sets — orange, white, black" },
  { src: img("knit-vneck-black"), caption: "Letter knit V-neck", wide: true },
  { src: img("crew-set-black-neon"), caption: "Black & neon crewneck set" },
  { src: img("football-jersey"), caption: "Match kit — black & lime" },
  { src: img("hoodies-seven"), caption: "Seven hoodie colours" },
  { src: img("stripe-polo-a"), caption: "Heritage stripe polo" },
  { src: img("caps-five-panel"), caption: "Reflective five-panels" },
  { src: img("crew-blue-orange"), caption: "Royal blue crewneck" },
  { src: img("knit-cardigan"), caption: "Letter knit cardigan" },
  { src: img("hoodie-sets-rainbow"), caption: "The full colour range" },
  { src: img("sports-polos-pair"), caption: "Club sports polos" },
  { src: img("face-crew-black"), caption: "Artist back-print crewneck" },
  { src: img("bucket-hat-white"), caption: "Varsity bucket hat", wide: true },
  { src: img("rose-tee-back"), caption: "Rose garden tee" },
  { src: img("knit-polos-pair"), caption: "Letter knit polos", wide: true },
  { src: img("crew-set-grey-red"), caption: "Heather grey & red set" },
  { src: img("beanie-black"), caption: "Flag beanie" },
  { src: img("crew-red-mint"), caption: "Red & mint crewneck" },
  { src: img("tracksuits-street"), caption: "Signature sets on the street", wide: true },
  { src: img("cardigan-model"), caption: "Letter knit cardigan, worn" },
  { src: img("knit-dress-model"), caption: "Letter knit dress" },
  { src: img("vulture-tee-black"), caption: "Vulture Silence tee" },
];
