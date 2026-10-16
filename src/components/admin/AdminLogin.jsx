import React, { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { IS_SUPABASE } from "../../lib/supabase.js";
import { DEMO_PASSCODE } from "../../hooks/useAuth.js";
import { href } from "../../lib/router.js";

export default function AdminLogin({ auth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await auth.signIn(email, password);
    if (r.error) setError(r.error);
    setBusy(false);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-5">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-3xl border border-white/10 bg-coal p-8">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-sun text-ink">
          <Lock size={22} />
        </span>
        <h1 className="mt-6 font-display text-3xl font-extrabold">Staff login</h1>
        <p className="mt-2 text-sm text-bone/60">Letlaka admin — manage products, prices and enquiries.</p>

        {!IS_SUPABASE && !(() => { try { return localStorage.getItem("letlaka.demo.passcode"); } catch { return null; } })() && (
          <p className="mt-5 rounded-xl border border-sun/30 bg-sun/10 p-3 text-xs leading-relaxed text-sun">
            Demo mode: no database is connected, so changes are saved in this browser only. Passcode:{" "}
            <strong className="font-bold">{DEMO_PASSCODE}</strong>
          </p>
        )}

        <div className="mt-6 space-y-4">
          {IS_SUPABASE && (
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="field"
            />
          )}
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={IS_SUPABASE ? "Password" : "Passcode"}
            className="field"
          />
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm font-semibold text-ruby">
            {error}
          </p>
        )}

        {info && <p role="status" className="mt-4 text-sm font-semibold text-mint">{info}</p>}

        <button disabled={busy} className="btn-sun mt-6 w-full disabled:opacity-60">
          {busy ? <Loader2 size={17} className="animate-spin" /> : "Sign in"}
        </button>
        {IS_SUPABASE && (
          <button
            type="button"
            onClick={async () => {
              setError("");
              setInfo("");
              if (!email) return setError("Type your email above first, then tap “Forgot password?”.");
              const r = await auth.sendResetEmail(email);
              r.error ? setError(r.error) : setInfo("Check your inbox for a reset link.");
            }}
            className="mt-4 block w-full text-center text-xs font-semibold text-bone/60 hover:text-sun"
          >
            Forgot password?
          </button>
        )}
        <a href={href()} className="mt-5 block text-center text-xs font-semibold text-bone/50 hover:text-sun">
          ← Back to the website
        </a>
      </form>
    </main>
  );
}
