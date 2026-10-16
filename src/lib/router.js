import { useEffect, useState } from "react";

// Tiny hash router: #/collections?cat=Tees
export function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [path, qs = ""] = raw.split("?");
  return {
    path: path || "",
    params: Object.fromEntries(new URLSearchParams(qs)),
  };
}

export function useRoute() {
  const [route, setRoute] = useState(parseHash);
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export const href = (to = "") => `#/${to}`;
