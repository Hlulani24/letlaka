import { IS_SUPABASE } from "./supabase.js";

// Shrinks a photo to a web-friendly JPEG (max side 1100px) before storing it.
async function compress(file, max = 1100, quality = 0.82) {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not read that image."))), "image/jpeg", quality)
  );
}

const toDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error("Could not read that image."));
    r.readAsDataURL(blob);
  });

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
export const IS_CLOUDINARY = Boolean(CLOUD && PRESET);

/**
 * Cloudinary configured: uploads there (unsigned preset) and returns the https URL.
 * Otherwise, demo mode: returns a compressed data URL kept in this browser.
 * (Live Supabase without Cloudinary is refused: data URLs would bloat the database.)
 */
export async function uploadProductImage(file) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  const blob = await compress(file);

  if (!IS_CLOUDINARY) {
    if (IS_SUPABASE) throw new Error("Photo storage isn't set up yet (Cloudinary keys missing).");
    return toDataUrl(blob);
  }

  const body = new FormData();
  body.append("file", blob, "photo.jpg");
  body.append("upload_preset", PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.secure_url) throw new Error(json?.error?.message || "Photo upload failed. Try again.");
  // f_auto,q_auto = Cloudinary serves the smallest good format for each visitor.
  return json.secure_url.replace("/upload/", "/upload/f_auto,q_auto/");
}
