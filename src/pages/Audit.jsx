import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles, Image as ImageIcon, PenTool, Clapperboard, Menu, X } from "lucide-react";
import {
  SiClaude,
  SiGooglegemini,
  SiGithubcopilot,
  SiPerplexity,
  SiNotion,
  SiElevenlabs,
} from "react-icons/si";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Nex3Logo from "@/components/site/Nex3Logo";

const API = `${process.env.REACT_APP_BACKEND_URL || "https://elite-founder-hub.emergent.host"}/api`;

const TOOLS = [
  { id: "chatgpt", name: "ChatGPT Plus", Icon: Sparkles, price: 20, bg: "#8FB39B", fg: "#12241B" },
  { id: "claude", name: "Claude Pro", Icon: SiClaude, price: 20, bg: "#C8724C", fg: "#241009" },
  { id: "gemini", name: "Gemini Advanced", Icon: SiGooglegemini, price: 20, bg: "#8AA0F0", fg: "#0B1533" },
  { id: "midjourney", name: "Midjourney", Icon: ImageIcon, price: 10, bg: "#EDEAE2", fg: "#1B1B1E" },
  { id: "copilot", name: "GitHub Copilot", Icon: SiGithubcopilot, price: 10, bg: "#9B95A8", fg: "#17151E" },
  { id: "perplexity", name: "Perplexity Pro", Icon: SiPerplexity, price: 20, bg: "#2E7D8A", fg: "#E7FBFF" },
  { id: "jasper", name: "Jasper", Icon: PenTool, price: 49, bg: "#8B5CF6", fg: "#160B2E" },
  { id: "notion", name: "Notion AI", Icon: SiNotion, price: 10, bg: "#D8D2C4", fg: "#1B1B1E" },
  { id: "elevenlabs", name: "ElevenLabs", Icon: SiElevenlabs, price: 22, bg: "#3A3A3A", fg: "#E7E7E7" },
  { id: "runway", name: "Runway", Icon: Clapperboard, price: 15, bg: "#4FE0B0", fg: "#08261C" },
];

const MAX = 3;

export default function Audit() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [audited, setAudited] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");

    document.title = "Free AI Budget Audit | NEX3 Inc.";
    description?.setAttribute(
      "content",
      "Compare the monthly cost of your AI subscriptions with a localized AI stack using NEX3's free AI budget audit."
    );

    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.setAttribute("content", previousDescription);
    };
  }, []);

  const toggle = (id) => {
    if (audited) return;
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX) return prev;
      return [...prev, id];
    });
  };

  const picked = useMemo(() => TOOLS.filter((t) => selected.includes(t.id)), [selected]);
  const currentCost = useMemo(() => picked.reduce((s, t) => s + t.price, 0), [picked]);
  const localizedCost = useMemo(() => Math.max(9, Math.round(currentCost * 0.35)), [currentCost]);
  const savedPct = useMemo(
    () => (currentCost ? Math.round((1 - localizedCost / currentCost) * 100) : 0),
    [currentCost, localizedCost]
  );
  const savedAmount = useMemo(() => currentCost - localizedCost, [currentCost, localizedCost]);
  const localizedItems = useMemo(() => {
    const compute = Math.round(localizedCost * 0.6);
    const maintenance = localizedCost - compute;
    return [
      { label: "Self-hosted models", value: "$0" },
      { label: "Compute & hosting", value: `$${compute}` },
      { label: "NEX3 maintenance", value: `$${maintenance}` },
    ];
  }, [localizedCost]);

  const runAudit = () => {
    if (selected.length !== MAX) return;
    setAudited(true);
    setTimeout(() => {
      const el = document.querySelector("[data-testid=audit-results]");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const bookCall = () => {
    setMenuOpen(false);
    navigate("/");
    setTimeout(() => {
      const el = document.querySelector("#contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 450);
  };

  const goApproach = () => {
    setMenuOpen(false);
    navigate("/");
    setTimeout(() => {
      const el = document.querySelector("#approach");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 450);
  };

  const submitEmail = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Enter a valid email.");
      return;
    }
    setSending(true);
    try {
      await axios.post(`${API}/audit`, {
        email,
        tools: picked.map((t) => t.name),
        current_cost: currentCost,
        localized_cost: localizedCost,
        saved_pct: savedPct,
      });
      setSent(true);
      toast.success("On its way — check your inbox for the audit + starter kit.");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main data-testid="audit-page" className="relative min-h-screen bg-[var(--ink)] pb-28">
      {/* Top bar */}
      <header>
        <div className="mx-auto flex max-w-[1300px] items-center justify-between px-5 py-6 sm:px-10">
          <Link to="/" data-testid="audit-home" className="flex items-center gap-3">
            <Nex3Logo animate={false} className="h-4 w-auto" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--muted)]">INC.</span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Audit page navigation">
            <button
              data-testid="audit-nav-approach"
              onClick={goApproach}
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--paper)]"
            >
              Approach
            </button>
            <Link
              to="/team"
              data-testid="audit-nav-team"
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--paper)]"
            >
              Team
            </Link>
            <Link
              to="/testimonials"
              data-testid="audit-nav-testimonials"
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--paper)]"
            >
              Testimonials
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              data-testid="audit-book-call"
              onClick={bookCall}
              className="group relative hidden overflow-hidden rounded-full border border-[var(--paper)] px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] sm:block"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--ink)]">
                Book a Call
              </span>
              <span className="absolute inset-0 translate-y-full bg-[var(--acid)] transition-transform duration-300 group-hover:translate-y-0" />
            </button>
            <button
              type="button"
              data-testid="audit-mobile-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="audit-mobile-navigation"
              className="flex h-10 w-10 items-center justify-center rounded-full border hairline text-[var(--paper)] md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="audit-mobile-navigation"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="border-y hairline bg-[var(--ink)] px-5 py-5 shadow-2xl md:hidden"
              aria-label="Audit page mobile navigation"
            >
              <div className="mx-auto flex max-w-[1300px] flex-col">
                <button
                  onClick={goApproach}
                  className="border-b hairline py-4 text-left font-mono text-xs uppercase tracking-[0.22em] text-[var(--paper)]"
                >
                  Approach
                </button>
                <Link
                  to="/team"
                  onClick={() => setMenuOpen(false)}
                  className="border-b hairline py-4 text-left font-mono text-xs uppercase tracking-[0.22em] text-[var(--paper)]"
                >
                  Team
                </Link>
                <Link
                  to="/testimonials"
                  onClick={() => setMenuOpen(false)}
                  className="border-b hairline py-4 text-left font-mono text-xs uppercase tracking-[0.22em] text-[var(--paper)]"
                >
                  Testimonials
                </Link>
                <button
                  onClick={bookCall}
                  className="mt-5 rounded-full bg-[var(--acid)] px-5 py-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink)] sm:hidden"
                >
                  Book a Call
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <header className="border-b hairline pb-16 pt-10 text-center">
        <motion.p
          data-testid="audit-subheadline"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-2xl font-semibold tracking-[-0.01em] sm:text-3xl lg:text-4xl"
        >
          Free <span className="text-[var(--acid)]">AI Budget</span> Audit
        </motion.p>
        <motion.h1
          data-testid="audit-headline"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-5 font-display text-5xl font-extrabold tracking-[-0.02em] sm:text-7xl lg:text-8xl"
        >
          Pick 3 AI You Pay For
        </motion.h1>
      </header>

      {/* Picker */}
      <section className="mx-auto max-w-[1300px] px-5 pt-20 sm:px-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {TOOLS.map((t) => {
            const isSel = selected.includes(t.id);
            const disabled = !isSel && selected.length >= MAX;
            const Icon = t.Icon;
            return (
              <button
                key={t.id}
                data-testid={`tool-${t.id}`}
                onClick={() => toggle(t.id)}
                disabled={audited || disabled}
                className={`relative flex flex-col items-center gap-4 rounded-2xl border p-6 transition-all duration-300 ${
                  isSel
                    ? "border-[var(--acid)] bg-[var(--ink-3)]"
                    : "hairline bg-[var(--ink-2)] hover:border-[var(--muted)]"
                } ${disabled ? "opacity-35" : ""} disabled:cursor-not-allowed`}
              >
                {isSel && (
                  <span
                    data-testid={`tool-check-${t.id}`}
                    className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--acid)]"
                  >
                    <Check className="h-3 w-3 text-[var(--ink)]" strokeWidth={3} />
                  </span>
                )}
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{ backgroundColor: t.bg, color: t.fg }}
                >
                  <Icon className="h-6 w-6" style={{ color: t.fg }} />
                </span>
                <span className="text-sm text-[var(--paper)]">{t.name}</span>
              </button>
            );
          })}
        </div>

        <p data-testid="selected-count" className="mt-10 text-center font-mono text-sm text-[var(--muted)]">
          <span className="text-[var(--acid)]">{selected.length}</span> / {MAX} selected
        </p>

        {/* Audit button — large & prominent, matching site buttons */}
        <div className="mt-10 flex flex-col items-center">
          <button
            data-testid="run-audit"
            onClick={runAudit}
            disabled={selected.length !== MAX || audited}
            className={`group relative w-full max-w-xs overflow-hidden rounded-full px-10 py-5 font-mono text-sm uppercase tracking-[0.3em] transition-all duration-300 ${
              selected.length === MAX && !audited
                ? "bg-[var(--paper)] text-[var(--ink)]"
                : "cursor-not-allowed border border-[var(--line)] text-[var(--muted)]"
            }`}
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--ink)]">
              Run the Audit
            </span>
            {selected.length === MAX && !audited && (
              <span className="absolute inset-0 translate-y-full bg-[var(--acid)] transition-transform duration-300 group-hover:translate-y-0" />
            )}
          </button>
          <p className="mt-4 font-mono text-xs tracking-wide text-[var(--muted)]">
            {audited
              ? "Audit complete"
              : selected.length === MAX
              ? "Ready to audit"
              : `Pick ${MAX} tools to run the audit`}
          </p>
        </div>
      </section>

      {/* Results — dark, on-theme */}
      <AnimatePresence>
        {audited && (
          <motion.section
            data-testid="audit-results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-[1100px] px-5 pt-24 sm:px-10"
          >
            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-[1fr_auto_1fr]">
              {/* Your bill */}
              <div className="flex flex-col rounded-2xl border hairline bg-[var(--ink-2)] p-8">
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
                  Your Bill
                </div>
                <div className="mt-6 space-y-4 border-t border-dashed border-[var(--line)] pt-6">
                  {picked.map((t) => {
                    const Icon = t.Icon;
                    return (
                      <div key={t.id} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-3 text-[var(--paper)]">
                          <span
                            className="flex h-7 w-7 items-center justify-center rounded-md"
                            style={{ backgroundColor: t.bg, color: t.fg }}
                          >
                            <Icon className="h-3.5 w-3.5" style={{ color: t.fg }} />
                          </span>
                          {t.name}
                        </span>
                        <span className="font-mono text-[var(--paper)]">${t.price}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-auto flex items-end justify-between border-t border-dashed border-[var(--line)] pt-8">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                    / month
                  </span>
                  <span data-testid="bill-total" className="font-display text-5xl font-extrabold text-[var(--paper)]">
                    ${currentCost}
                  </span>
                </div>
              </div>

              {/* Center — key savings figure */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.25 }}
                className="flex flex-row items-center justify-center gap-5 py-2 md:flex-col md:gap-6"
              >
                <ArrowRight className="h-10 w-10 text-[var(--acid)] md:h-12 md:w-12" strokeWidth={2.5} />
                <div
                  data-testid="saved-badge"
                  className="flex flex-col items-center rounded-3xl bg-[var(--acid)] px-7 py-6 text-center text-[var(--ink)] shadow-[0_0_50px_-8px_rgba(205,255,78,0.55)]"
                >
                  <span className="font-display text-5xl font-extrabold leading-none tracking-tight sm:text-6xl">
                    {savedPct}%
                  </span>
                  <span className="mt-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.3em]">
                    Saved
                  </span>
                  <span className="mt-3 rounded-full bg-black/10 px-3 py-1 font-mono text-xs font-semibold text-[var(--ink)]">
                    ${savedAmount} / mo
                  </span>
                </div>
              </motion.div>

              {/* Localized */}
              <div className="flex flex-col rounded-2xl border border-[var(--acid)] bg-[var(--ink-2)] p-8">
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--acid)]">
                  Localized AI
                </div>
                <div className="mt-6 space-y-4 border-t border-dashed border-[var(--line)] pt-6 text-sm">
                  {localizedItems.map((it) => (
                    <div key={it.label} className="flex items-center justify-between">
                      <span className="text-[var(--paper)]">{it.label}</span>
                      <span className="font-mono text-[var(--paper)]">{it.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto flex items-end justify-between border-t border-dashed border-[var(--line)] pt-8">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                    / month
                  </span>
                  <span data-testid="localized-total" className="font-display text-5xl font-extrabold text-[var(--acid)]">
                    ${localizedCost}
                  </span>
                </div>
              </div>
            </div>

            {/* Lead capture */}
            <div
              data-testid="audit-capture"
              className="mx-auto mt-16 max-w-3xl rounded-2xl border hairline bg-[var(--ink-2)] px-6 py-14 text-center sm:px-14"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--acid)]">
                Free Toolkit
              </span>
              <h3 className="font-display mt-5 text-3xl tracking-tight sm:text-4xl">
                Get your free AI tools
              </h3>
              <p className="mx-auto mt-4 max-w-md text-sm text-[var(--muted)] sm:text-base">
                We&rsquo;ll send the full audit breakdown and the localized-AI starter kit.
              </p>
              {sent ? (
                <p data-testid="audit-sent" className="mt-8 font-mono text-sm text-[var(--acid)]">
                  Sent. We&rsquo;ll be in touch shortly.
                </p>
              ) : (
                <form
                  onSubmit={submitEmail}
                  noValidate
                  data-testid="audit-form"
                  className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
                >
                  <input
                    data-testid="audit-email"
                    aria-label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="flex-1 rounded-full border hairline bg-[var(--ink)] px-6 py-4 text-sm text-[var(--paper)] placeholder:text-[var(--muted)] outline-none transition-colors duration-300 focus:border-[var(--acid)]"
                  />
                  <button
                    data-testid="audit-submit"
                    type="submit"
                    disabled={sending}
                    className="group relative overflow-hidden rounded-full bg-[var(--paper)] px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink)] disabled:opacity-60"
                  >
                    <span className="relative z-10">{sending ? "Sending…" : "Get Free Tools"}</span>
                    <span className="absolute inset-0 translate-y-full bg-[var(--acid)] transition-transform duration-300 group-hover:translate-y-0" />
                  </button>
                </form>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="mt-24 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
        NEX3 Inc. · AI Cost Audit
      </footer>
    </main>
  );
}
