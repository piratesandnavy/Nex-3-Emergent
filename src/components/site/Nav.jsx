import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Nex3Logo from "@/components/site/Nex3Logo";

const scrollTo = (id) => {
  const el = document.querySelector(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: 0 });
  else el.scrollIntoView({ behavior: "smooth" });
};

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const goAnchor = (hash) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollTo(hash), 450);
    } else {
      scrollTo(hash);
    }
  };

  const goTeam = () => {
    if (location.pathname !== "/team") navigate("/team");
    else if (window.__lenis) window.__lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.header
      data-testid="site-nav"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-10">
        <button
          data-testid="nav-logo"
          onClick={() => {
            if (location.pathname !== "/") navigate("/");
            else goAnchor("#top");
          }}
          className="flex items-center gap-3"
          aria-label="NEX3 home"
        >
          <Nex3Logo animate={false} className="h-4 w-auto" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--muted)]">
            INC.
          </span>
        </button>

        <nav className="hidden items-center gap-9 md:flex">
          <button
            data-testid="nav-link-approach"
            onClick={() => goAnchor("#approach")}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--paper)]"
          >
            Approach
          </button>
          <button
            data-testid="nav-link-team"
            onClick={goTeam}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--paper)]"
          >
            Team
          </button>
          <button
            data-testid="nav-link-contact"
            onClick={() => goAnchor("#contact")}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--paper)]"
          >
            Contact
          </button>
        </nav>

        <button
          data-testid="nav-book-call"
          onClick={() => goAnchor("#contact")}
          className="group relative overflow-hidden rounded-full border border-[var(--paper)] px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em]"
        >
          <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--ink)]">
            Book a Call
          </span>
          <span className="absolute inset-0 -z-0 translate-y-full bg-[var(--acid)] transition-transform duration-300 group-hover:translate-y-0" />
        </button>
      </div>
    </motion.header>
  );
}
