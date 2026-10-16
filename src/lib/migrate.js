import { uploadProductImage, IS_CLOUDINARY } from "./images.js";
import { saveProduct } from "./store.js";

// A photo is "local" if it ships inside the website (/images/…) or is a data URL.
export const isLocalSrc = (s = "") => s.startsWith("/") || s.startsWith("data:");

export const countLocalPhotos = (products) =>
  new Set(products.flatMap((p) => p.images.map((i) => i.src).filter(isLocalSrc))).size;

/**
 * Uploads every local photo to Cloudinary and rewrites the products to use the Cloudinary links.
 * Safe to re-run: it only touches photos that are still local. Each photo is uploaded once even
 * if several products share it.
 */
export async function moveAllPhotosToCloudinary(products, onProgress = () => {}) {
  if (!IS_CLOUDINARY) return { error: "Cloudinary isn't configured (check the VITE_CLOUDINARY_* keys)." };
  const todo = [...new Set(products.flatMap((p) => p.images.map((i) => i.src).filter(isLocalSrc)))];
  const done = new Map();
  let n = 0;
  for (const src of todo) {
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`Couldn't read ${src}`);
      const blob = await res.blob();
      const file = new File([blob], src.split("/").pop() || "photo.jpg", { type: blob.type || "image/jpeg" });
      done.set(src, await uploadProductImage(file));
    } catch (e) {
      return { error: `Stopped at ${src}: ${e.message}. Photos moved so far are kept — run it again to continue.` };
    }
    onProgress(++n, todo.length);
  }
  for (const p of products) {
    if (!p.images.some((i) => done.has(i.src))) continue;
    const r = await saveProduct({ ...p, images: p.images.map((i) => (done.has(i.src) ? { ...i, src: done.get(i.src) } : i)) });
    if (r.error) return { error: r.error };
  }
  return { moved: todo.length };
}
