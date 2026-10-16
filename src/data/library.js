// Photos bundled in /public/images that the admin can attach to any product.
const names = [
  "hoodie-sets-trio", "hoodie-sets-flatlay", "hoodie-sets-rainbow", "hoodies-seven",
  "hoodie-red-white", "hoodie-grey-red",
  "crew-set-grey-red", "crew-set-black-neon", "crew-black-orange-green", "crew-blue-orange",
  "crew-blue-green", "crew-red-mint", "crew-black-green-red", "crew-black-lime",
  "face-tee-black", "face-crew-black", "face-crew-white",
  "varsity-tee-black", "varsity-tee-white", "stripe-tee-white", "script-tee-18",
  "rose-tee-back", "rose-tee-front", "floral-tee-white",
  "aop-tee-white", "aop-tee-peach", "striped-tee-red",
  "stripe-polo-a", "stripe-polo-b", "sports-polo-navy", "sports-polos-pair", "football-jersey",
  "knit-vneck-black", "knit-vneck-pair", "knit-cardigan", "knit-polos-pair", "letter-polo-black",
  "caps-five-panel", "cap-varsity-black", "cap-varsity-white", "bucket-hat-white",
  "beanie-black", "beanie-white", "trucker-green", "trucker-pink", "trucker-black",
  "cardigan-pair-couch", "cardigan-model", "mannequin-stripe-polo", "hoodies-four-colours", "vulture-tee-black",
  "vulture-tee-white", "polo-sweatshirt-red", "polo-sweatshirt-black", "mannequin-navy-polo", "mannequin-red-polo",
  "knit-dress-model", "knit-dress-flat", "tracksuits-street", "letter-polo-large", "jersey-polo-red",
  "script-knit-polo-brown", "stripe-polo-pink", "parrot-tee-lifestyle", "baseball-18-tee-black",
];

export const IMAGE_LIBRARY = names.map((n) => ({
  src: `/images/${n}.jpg`,
  label: n.replace(/-/g, " "),
}));
