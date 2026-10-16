import React from "react";
import { MessageCircle } from "lucide-react";
import { waLink } from "../config.js";

export default function WhatsAppFloat() {
  return (
    <a
      href={waLink("Hi Letlaka, I'd like to ask about your clothing.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-ink shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition hover:scale-105"
    >
      <MessageCircle size={26} />
    </a>
  );
}
