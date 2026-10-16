import emailjs from "@emailjs/browser";
import { supabase, IS_SUPABASE } from "./supabase.js";
import { saveLeadLocally } from "./store.js";

const env = import.meta.env;

/**
 * Saves a form submission to Supabase (if configured) and sends an EmailJS
 * notification (if configured). Never throws — the caller always offers a
 * WhatsApp fallback so a lead is never lost.
 *
 * In demo mode (no database) the submission is also kept in this browser so the
 * admin inbox can be tried out; that does NOT count as "saved" for the visitor.
 */
export async function submitLead(table, row, emailTemplateEnvKey, emailParams) {
  let saved = false;
  let emailed = false;

  if (IS_SUPABASE) {
    try {
      const { error } = await supabase.from(table).insert(row);
      saved = !error;
      if (error) console.warn("Supabase insert failed:", error.message);
    } catch (e) {
      console.warn("Supabase error:", e);
    }
  } else {
    saveLeadLocally(table, row);
  }

  const serviceId = env.VITE_EMAILJS_SERVICE_ID;
  const publicKey = env.VITE_EMAILJS_PUBLIC_KEY;
  const templateId = env[emailTemplateEnvKey];
  if (serviceId && publicKey && templateId) {
    try {
      await emailjs.send(serviceId, templateId, emailParams, { publicKey });
      emailed = true;
    } catch (e) {
      console.warn("EmailJS error:", e);
    }
  }

  return { saved, emailed, demo: !IS_SUPABASE };
}
