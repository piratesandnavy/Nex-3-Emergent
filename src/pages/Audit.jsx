import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Clapperboard,
  Image as ImageIcon,
  PenTool,
  Sparkles,
} from "lucide-react";
import {
  SiClaude,
  SiElevenlabs,
  SiGithubcopilot,
  SiGooglegemini,
  SiNotion,
  SiPerplexity,
} from "react-icons/si";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import Nex3Logo from "@/components/site/Nex3Logo";
import {
  AuditTestimonials,
  DeliverablesSection,
  FaqSection,
  FinalCta,
  HowItWorks,
  ProblemSection,
  SocialProof,
  SolutionSection,
} from "@/components/audit/AuditSections";

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

const track = (event, properties = {}) => {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event, ...properties });
  window.gtag?.("event", event.toLowerCase().replaceAll(" ", "_"), properties);
  if (typeof window.fbq === "function") window.fbq("trackCustom", event, properties);
};

const scrollToId = (id) => {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function Audit() {
  const [selected, setSelected] = useState([]);
  const [audited, setAudited] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [currentTools, setCurrentTools] = useState("");
  const [monthlySpend, setMonthlySpend] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formStarted, setFormStarted] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");
    const created = [];

    const ensureMeta = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
        created.push(element);
      }
      element.setAttribute("content", content);
    };

    document.title = "Free AI Budget Audit | NEX3 Inc.";
    description?.setAttribute(
      "content",
      "Find wasted AI subscriptions, simplify your workflow, and book a free personalized AI Budget Audit with NEX3."
    );
    ensureMeta("og:title", "Free AI Budget Audit | NEX3 Inc.");
    ensureMeta(
      "og:description",
      "Find wasted AI subscriptions and get a personalized plan to simplify your AI stack."
    );
    ensureMeta("og:url", "https://nex3.xyz/audit/");
    ensureMeta("og:type", "website");
    track("Page View", { page: "audit" });

    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.setAttribute("content", previousDescription);
      created.forEach((element) => element.remove());
    };
  }, []);

  const picked = useMemo(() => TOOLS.filter((tool) => selected.includes(tool.id)), [selected]);
  const currentCost = useMemo(() => picked.reduce((sum, tool) => sum + tool.price, 0), [picked]);
  const localizedCost = useMemo(() => Math.max(9, Math.round(currentCost * 0.35)), [currentCost]);
  const savedPct = useMemo(
    () => (currentCost ? Math.round((1 - localizedCost / currentCost) * 100) : 0),
    [currentCost, localizedCost]
  );
  const savedAmount = currentCost - localizedCost;

  const toggle = (id) => {
    if (audited) return;
    setSelected((previous) => {
      if (previous.includes(id)) return previous.filter((item) => item !== id);
      if (previous.length >= MAX) return previous;
      return [...previous, id];
    });
  };

  const runAudit = () => {
    if (selected.length !== MAX) return;
    setAudited(true);
    track("CTA Click", { cta: "run_audit" });
    setTimeout(() => scrollToId("[data-testid=audit-results]"), 120);
  };

  const handleCta = (source) => {
    track("CTA Click", { cta: source });
    scrollToId("#audit-form");
  };

  const handleFormFocus = () => {
    if (formStarted) return;
    setFormStarted(true);
    track("Form Started", { form: "free_ai_audit" });
  };

  const submitAudit = async (event) => {
    event.preventDefault();
    const spend = Number(monthlySpend);
    const tools = currentTools
      .split(",")
      .map((tool) => tool.trim())
      .filter(Boolean);

    if (!name.trim() || !email.includes("@") || !company.trim() || !tools.length || !spend) {
      toast.error("Complete every field to book your free audit.");
      return;
    }

    setSending(true);
    try {
      await axios.post(`${API}/audit`, {
        email: email.trim(),
        tools,
        current_cost: spend,
        localized_cost: Math.max(9, Math.round(spend * 0.35)),
        saved_pct: 65,
      });
      setSent(true);
      track("Form Submitted", { form: "free_ai_audit" });
      toast.success("Your free AI Budget Audit is booked.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main data-testid="audit-page" className="relative min-h-screen overflow-hidden bg-[var(--ink)] pb-24">
      <header className="relative z-20">
        <div className="mx-auto flex max-w-[1300px] items-center justify-between px-5 py-6 sm:px-10">
          <Link to="/" data-testid="audit-home" className="flex items-center gap-3" aria-label="NEX3 INC. home">
            <Nex3Logo animate={false} className="h-4 w-auto" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--muted)]">INC.</span>
          </Link>
          <button
            onClick={() => handleCta("header")}
            className="rounded-full border border-[var(--paper)] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:border-[var(--acid)] hover:bg-[var(--acid)] hover:text-[var(--ink)] sm:px-6 sm:text-[11px]"
          >
            Book Free Audit
          </button>
        </div>
      </header>

      <section className="relative px-5 pb-20 pt-12 text-center sm:px-10 sm:pb-28 sm:pt-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[780px] -translate-x-1/2 rounded-full bg-[var(--acid)]/10 blur-[140px]" />
        <div className="relative mx-auto max-w-[1100px]">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="font-display text-2xl font-semibold tracking-tight sm:text-4xl"
          >
            Get a FREE <span className="text-[var(--acid)]">AI Budget</span> Audit.
          </motion.p>
          <h1
            data-testid="audit-headline"
            className="font-display mx-auto mt-6 text-5xl font-extrabold leading-[0.93] tracking-[-0.045em] sm:text-7xl lg:text-[7rem]"
          >
            Pick 3 AI Tools You Pay For.
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-[var(--muted)] sm:text-xl">
            Most businesses pay for multiple AI subscriptions they don’t fully use.
            We’ll review your AI stack and show you where you can save money while getting better results.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <button
              onClick={() => handleCta("hero_primary")}
              className="w-full rounded-full bg-[var(--acid)] px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink)] transition-transform hover:scale-[1.02] sm:w-auto"
            >
              Get My Free Audit
            </button>
            <button
              onClick={() => {
                track("CTA Click", { cta: "see_how_it_works" });
                scrollToId("#how-it-works");
              }}
              className="w-full rounded-full border hairline px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--paper)] transition-colors hover:border-[var(--paper)] sm:w-auto"
            >
              See How It Works
            </button>
          </motion.div>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
            Limited audit slots available each week
          </p>
        </div>
      </section>

      <SocialProof />

      <section id="audit-builder" className="mx-auto max-w-[1300px] px-5 py-24 sm:px-10 sm:py-32">
        <div className="text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--acid)]">
            Instant Cost Check
          </span>
          <h2 className="font-display mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Pick 3 AI tools you pay for
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {TOOLS.map((tool) => {
            const selectedTool = selected.includes(tool.id);
            const disabled = !selectedTool && selected.length >= MAX;
            const Icon = tool.Icon;
            return (
              <button
                key={tool.id}
                data-testid={`tool-${tool.id}`}
                onClick={() => toggle(tool.id)}
                disabled={audited || disabled}
                className={`relative flex flex-col items-center gap-4 rounded-2xl border p-6 transition-all duration-300 ${
                  selectedTool
                    ? "border-[var(--acid)] bg-[var(--ink-3)]"
                    : "hairline bg-[var(--ink-2)] hover:border-[var(--muted)]"
                } ${disabled ? "opacity-35" : ""} disabled:cursor-not-allowed`}
              >
                {selectedTool && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--acid)]">
                    <Check className="h-3 w-3 text-[var(--ink)]" strokeWidth={3} />
                  </span>
                )}
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{ backgroundColor: tool.bg, color: tool.fg }}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" focusable="false" />
                </span>
                <span className="text-sm">{tool.name}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-9 text-center font-mono text-xs text-[var(--muted)]">
          <span className="text-[var(--acid)]">{selected.length}</span> / {MAX} selected
        </p>
        <div className="mt-7 text-center">
          <button
            data-testid="run-audit"
            onClick={runAudit}
            disabled={selected.length !== MAX || audited}
            className="rounded-full bg-[var(--paper)] px-9 py-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-30"
          >
            Run the Audit
          </button>
        </div>

        <AnimatePresence>
          {audited && (
            <motion.div
              data-testid="audit-results"
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-20 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-stretch"
            >
              <div className="rounded-3xl border hairline bg-[var(--ink-2)] p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">Your bill</p>
                <div className="mt-6 space-y-4">
                  {picked.map((tool) => (
                    <div key={tool.id} className="flex justify-between border-b hairline pb-3 text-sm">
                      <span>{tool.name}</span><span className="font-mono">${tool.price}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex items-end justify-between">
                  <span className="text-sm text-[var(--muted)]">per month</span>
                  <span data-testid="bill-total" className="font-display text-5xl font-extrabold">${currentCost}</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="rounded-3xl bg-[var(--acid)] px-7 py-6 text-center text-[var(--ink)]">
                  <div className="font-display text-5xl font-extrabold">{savedPct}%</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em]">saved</div>
                  <div className="mt-2 text-xs">${savedAmount}/mo</div>
                </div>
              </div>
              <div className="rounded-3xl border border-[var(--acid)] bg-[var(--ink-2)] p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--acid)]">Optimized stack</p>
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between border-b hairline pb-3"><span>Core AI workspace</span><span>$0</span></div>
                  <div className="flex justify-between border-b hairline pb-3"><span>Compute & hosting</span><span>${Math.round(localizedCost * 0.6)}</span></div>
                  <div className="flex justify-between border-b hairline pb-3"><span>Maintenance</span><span>${localizedCost - Math.round(localizedCost * 0.6)}</span></div>
                </div>
                <div className="mt-8 flex items-end justify-between">
                  <span className="text-sm text-[var(--muted)]">per month</span>
                  <span className="font-display text-5xl font-extrabold text-[var(--acid)]">${localizedCost}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <ProblemSection />
      <SolutionSection />
      <DeliverablesSection />

      <section id="audit-form" className="scroll-mt-6 px-5 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-[900px] rounded-[2.5rem] border hairline bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))] p-6 shadow-2xl backdrop-blur sm:p-12 lg:p-16">
          <div className="text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--acid)]">Free Personalized Review</span>
            <h2 className="font-display mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">Book Your Free AI Audit</h2>
            <p className="mx-auto mt-5 max-w-xl text-[var(--muted)]">Tell us what you use today. We’ll identify the fastest opportunities to simplify and save.</p>
          </div>

          {sent ? (
            <motion.div
              data-testid="audit-sent"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 rounded-3xl border border-[var(--acid)] bg-[var(--acid)]/10 p-10 text-center"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--acid)] text-[var(--ink)]"><Check /></span>
              <h3 className="font-display mt-6 text-3xl">Your audit is booked.</h3>
              <p className="mt-3 text-[var(--muted)]">We’ll review your stack and follow up with next steps.</p>
            </motion.div>
          ) : (
            <form
              data-testid="audit-form"
              onSubmit={submitAudit}
              onFocus={handleFormFocus}
              noValidate
              className="mt-12 grid gap-5 sm:grid-cols-2"
            >
              <label className="grid gap-2 text-sm text-[var(--muted)]">
                Name
                <input value={name} onChange={(event) => setName(event.target.value)} className="rounded-2xl border hairline bg-black/25 px-5 py-4 text-[var(--paper)] outline-none focus:border-[var(--acid)]" />
              </label>
              <label className="grid gap-2 text-sm text-[var(--muted)]">
                Business Email
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-2xl border hairline bg-black/25 px-5 py-4 text-[var(--paper)] outline-none focus:border-[var(--acid)]" />
              </label>
              <label className="grid gap-2 text-sm text-[var(--muted)]">
                Company
                <input value={company} onChange={(event) => setCompany(event.target.value)} className="rounded-2xl border hairline bg-black/25 px-5 py-4 text-[var(--paper)] outline-none focus:border-[var(--acid)]" />
              </label>
              <label className="grid gap-2 text-sm text-[var(--muted)]">
                Monthly AI Spend
                <input type="number" min="1" inputMode="decimal" value={monthlySpend} onChange={(event) => setMonthlySpend(event.target.value)} placeholder="$250" className="rounded-2xl border hairline bg-black/25 px-5 py-4 text-[var(--paper)] outline-none focus:border-[var(--acid)]" />
              </label>
              <label className="grid gap-2 text-sm text-[var(--muted)] sm:col-span-2">
                Current AI Tools Used
                <textarea value={currentTools} onChange={(event) => setCurrentTools(event.target.value)} placeholder="ChatGPT, Claude, Midjourney…" rows={4} className="resize-none rounded-2xl border hairline bg-black/25 px-5 py-4 text-[var(--paper)] outline-none focus:border-[var(--acid)]" />
              </label>
              <button
                data-testid="audit-submit"
                type="submit"
                disabled={sending}
                className="rounded-full bg-[var(--acid)] px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink)] disabled:opacity-50 sm:col-span-2"
              >
                {sending ? "Booking…" : "Book My Free AI Audit"}
              </button>
            </form>
          )}
        </div>
      </section>

      <HowItWorks />
      <AuditTestimonials />
      <FaqSection />
      <FinalCta onCta={() => handleCta("final_cta")} />

      <footer className="border-t hairline px-5 py-10 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
        NEX3 Inc. · Free AI Budget Audit
      </footer>

      <button
        onClick={() => handleCta("mobile_sticky")}
        className="fixed bottom-4 left-4 right-4 z-50 rounded-full bg-[var(--acid)] px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink)] shadow-2xl sm:hidden"
      >
        Get My Free Audit
      </button>
    </main>
  );
}
