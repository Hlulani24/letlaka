import { useEffect, useState } from "react";
import { supabase, IS_SUPABASE } from "../lib/supabase.js";

const DEMO_KEY = "letlaka.demo.admin";
const DEMO_PASS_KEY = "letlaka.demo.passcode";

const demoPasscode = () => {
  try {
    return localStorage.getItem(DEMO_PASS_KEY) || DEMO_PASSCODE;
  } catch {
    return DEMO_PASSCODE;
  }
};

// Demo mode only (no database connected): a simple passcode, nothing is shared online.
export const DEMO_PASSCODE = import.meta.env.VITE_ADMIN_DEMO_PASSCODE || "letlaka-demo";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!IS_SUPABASE) {
      setUser(sessionStorage.getItem(DEMO_KEY) ? { email: "demo" } : null);
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) =>
      setUser(session?.user ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    if (!IS_SUPABASE) {
      if (password === demoPasscode()) {
        sessionStorage.setItem(DEMO_KEY, "1");
        setUser({ email: "demo" });
        return {};
      }
      return { error: "That passcode isn't right." };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  const signOut = async () => {
    if (!IS_SUPABASE) {
      sessionStorage.removeItem(DEMO_KEY);
      setUser(null);
    } else {
      await supabase.auth.signOut();
    }
  };

  // Settings: change the password (live) or the demo passcode (demo, this browser only).
  const changePassword = async (current, next) => {
    if (next.length < 8) return { error: "Use at least 8 characters." };
    if (!IS_SUPABASE) {
      if (current !== demoPasscode()) return { error: "Your current passcode isn't right." };
      try {
        localStorage.setItem(DEMO_PASS_KEY, next);
      } catch {
        return { error: "Couldn't save in this browser." };
      }
      return {};
    }
    // Re-check the current password first so a borrowed, signed-in screen can't lock the owner out.
    const check = await supabase.auth.signInWithPassword({ email: user?.email, password: current });
    if (check.error) return { error: "Your current password isn't right." };
    const { error } = await supabase.auth.updateUser({ password: next });
    return error ? { error: error.message } : {};
  };

  const sendResetEmail = async (email) => {
    if (!IS_SUPABASE) return { error: "Password emails only work once Supabase is connected." };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/admin`,
    });
    return error ? { error: error.message } : {};
  };

  return { user, loading, signIn, signOut, changePassword, sendResetEmail };
}
