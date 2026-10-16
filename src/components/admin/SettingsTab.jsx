import React, { useState } from "react";
import { Loader2, KeyRound, UserRound, Mail } from "lucide-react";
import { IS_SUPABASE } from "../../lib/supabase.js";

export default function SettingsTab({ auth, notify }) {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const word = IS_SUPABASE ? "password" : "passcode";

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (next !== again) return setError(`The two new ${word}s don't match.`);
    setBusy(true);
    const r = await auth.changePassword(cur, next);
    setBusy(false);
    if (r.error) return setError(r.error);
    setCur("");
    setNext("");
    setAgain("");
    notify(`Your ${word} has been changed.`);
  }

  return (
    <div className="max-w-xl space-y-8">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-sun text-ink">
            <UserRound size={24} />
          </span>
          <div>
            <p className="font-display text-xl font-extrabold">{IS_SUPABASE ? "Your account" : "Demo admin"}</p>
            <p className="mt-0.5 flex items-center gap-2 text-sm text-bone/60">
              <Mail size={14} /> {IS_SUPABASE ? auth.user?.email : "Signed in with the demo passcode"}
            </p>
          </div>
        </div>
        <button onClick={auth.signOut} className="btn-ghost mt-5 !py-2.5 text-xs">
          Sign out
        </button>
      </section>

      <form onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="flex items-center gap-3 font-display text-xl font-extrabold">
          <KeyRound size={20} className="text-sun" /> Change {word}
        </h2>
        {!IS_SUPABASE && (
          <p className="mt-3 text-xs leading-relaxed text-bone/55">
            Demo mode: the new passcode is remembered in this browser only. In the live site this changes your real login.
          </p>
        )}
        <div className="mt-5 space-y-4">
          <input type="password" required autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} placeholder={`Current ${word}`} className="field" />
          <input type="password" required minLength={8} autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} placeholder={`New ${word} (8+ characters)`} className="field" />
          <input type="password" required minLength={8} autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} placeholder={`Repeat new ${word}`} className="field" />
        </div>
        {error && (
          <p role="alert" className="mt-4 text-sm font-semibold text-ruby">
            {error}
          </p>
        )}
        <button disabled={busy} className="btn-sun mt-6 disabled:opacity-60">
          {busy ? <Loader2 size={17} className="animate-spin" /> : `Save new ${word}`}
        </button>
        {IS_SUPABASE && (
          <p className="mt-4 text-xs text-bone/45">
            Forgot it? Sign out and use “Forgot password?” on the login page to get an email link.
          </p>
        )}
      </form>
    </div>
  );
}
