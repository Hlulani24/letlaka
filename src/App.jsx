import React from "react";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppFloat from "./components/WhatsAppFloat.jsx";
import Home from "./pages/Home.jsx";
import Collections from "./pages/Collections.jsx";
import Lookbook from "./pages/Lookbook.jsx";
import CustomOrder from "./pages/CustomOrder.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Admin from "./pages/Admin.jsx";
import BasketDrawer from "./components/BasketDrawer.jsx";
import BasketToast from "./components/BasketToast.jsx";
import { useRoute } from "./lib/router.js";
import { useReveal } from "./hooks/useReveal.js";
import { IS_DEMO } from "./lib/supabase.js";

export default function App() {
  const { path, params } = useRoute();
  // Re-scan for .reveal elements on every route/filter change.
  useReveal([path, params.cat]);

  // The admin panel is its own world: no public navigation or footer.
  if (path === "admin") return <Admin />;

  let page;
  switch (path) {
    case "collections":
      page = <Collections params={params} />;
      break;
    case "lookbook":
      page = <Lookbook />;
      break;
    case "custom":
      page = <CustomOrder params={params} />;
      break;
    case "about":
      page = <About />;
      break;
    case "contact":
      page = <Contact />;
      break;
    default:
      page = <Home />;
  }

  return (
    <div className="min-h-screen bg-ink text-bone">
      <NavBar path={path} />
      <div key={path} className="page-in">
        {page}
      </div>
      <Footer />
      <WhatsAppFloat />
      <BasketDrawer />
      <BasketToast />
      {IS_DEMO && (
        <a
          href="#/admin"
          className="fixed bottom-5 left-5 z-30 hidden items-center gap-2 rounded-full border border-white/15 bg-ink/90 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-widest text-bone/70 backdrop-blur transition hover:border-sun hover:text-sun md:inline-flex"
        >
          <span className="h-2 w-2 rounded-full bg-sun" /> Demo mode · open admin
        </a>
      )}
    </div>
  );
}
