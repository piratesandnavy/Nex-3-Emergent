import { motion } from "framer-motion";
import {
  ArrowDown,
  Check,
  Layers3,
  Search,
  Sparkles,
  TrendingDown,
} from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const TOOL_NAMES = [
  "ChatGPT Plus",
  "Claude Pro",
  "Gemini Advanced",
  "Perplexity",
  "Midjourney",
  "Cursor",
  "Canva Pro",
  "Lovable",
  "Bolt",
  "Runway",
];

const SOLUTIONS = [
  {
    Icon: Search,
    title: "Discover",
    body: "We identify overlapping subscriptions and the tools your team pays for but rarely uses.",
  },
  {
    Icon: Layers3,
    title: "Optimize",
    body: "We recommend the smallest, strongest AI combination for the work you actually do.",
  },
  {
    Icon: TrendingDown,
    title: "Save",
    body: "Reduce software costs while improving productivity, consistency, and team adoption.",
  },
];

const DELIVERABLES = [
  "Personalized AI stack review",
  "Cost-saving recommendations",
  "Better workflow suggestions",
  "AI implementation roadmap",
  "30-minute strategy session",
];

const STEPS = [
  ["01", "Tell us what AI you use"],
  ["02", "We analyze your subscriptions"],
  ["03", "Receive your personalized audit"],
];

const FAQS = [
  {
    q: "How long does the audit take?",
    a: "The intake takes a few minutes. We review your stack and follow up with next steps for your personalized audit.",
  },
  {
    q: "Is it really free?",
    a: "Yes. The initial AI Budget Audit and 30-minute strategy session are free.",
  },
  {
    q: "Do I need technical knowledge?",
    a: "No. We translate the tools, costs, and workflow tradeoffs into clear business decisions.",
  },
  {
    q: "Will you try to sell me software?",
    a: "No. NEX3 is tool-agnostic. The goal is to remove waste and recommend what fits your business.",
  },
];

function SectionLabel({ children }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--acid)]">
      {children}
    </span>
  );
}

export function SocialProof() {
  return (
    <section className="border-y hairline bg-[var(--ink-2)]" aria-label="Social proof">
      <div className="mx-auto grid max-w-[1300px] gap-10 px-5 py-14 sm:px-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-sm text-[var(--muted)]">
            Trusted by founders, consultants, and growing businesses.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-9 gap-y-4 font-display text-sm tracking-wide text-[var(--muted)] sm:text-base">
            <span>LEDGERFRAME</span>
            <span>NORTHWIND AI</span>
            <span>CADENCE LABS</span>
            <span>RELAY SYSTEMS</span>
          </div>
        </div>
        <div className="max-w-md border-l border-[var(--line)] pl-6">
          <div className="tracking-[0.25em] text-[var(--acid)]" aria-label="Five stars">
            ★★★★★
          </div>
          <blockquote className="mt-3 font-display text-xl leading-snug">
            “Saved us over $400/month in AI software.”
          </blockquote>
        </div>
      </div>
    </section>
  );
}

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-[1300px] px-5 py-24 sm:px-10 sm:py-32">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal}>
        <SectionLabel>The Problem</SectionLabel>
        <h2 className="font-display mt-5 max-w-4xl text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
          You’re Probably Paying for Too Many AI Tools
        </h2>
      </motion.div>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] border hairline bg-[var(--ink-2)] p-6 sm:p-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {TOOL_NAMES.map((tool, index) => (
              <motion.div
                key={tool}
                initial={{ opacity: 0, y: 24, rotate: index % 2 ? 1.5 : -1.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.045 }}
                className="rounded-2xl border hairline bg-black/20 px-4 py-5 text-sm text-[var(--paper)] backdrop-blur"
              >
                <Sparkles className="mb-4 h-4 w-4 text-[var(--acid)]" />
                {tool}
              </motion.div>
            ))}
          </div>
          <div className="mt-8 flex items-end justify-between border-t hairline pt-6">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Total monthly cost
            </span>
            <span className="font-display text-5xl font-extrabold">$250+</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex min-h-[430px] flex-col items-center justify-center rounded-[2rem] border border-[var(--acid)] bg-[linear-gradient(145deg,rgba(205,255,78,0.14),rgba(20,20,20,0.75))] p-10 text-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--acid)] text-[var(--ink)] shadow-[0_0_60px_rgba(205,255,78,0.25)]">
            <Layers3 className="h-9 w-9" />
          </div>
          <ArrowDown className="my-8 h-8 w-8 text-[var(--muted)] lg:-rotate-90" />
          <h3 className="font-display text-3xl font-semibold">One optimized AI workflow.</h3>
          <p className="mt-4 max-w-sm text-[var(--muted)]">
            Fewer tools, clearer ownership, and a stack designed around measurable work.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function SolutionSection() {
  return (
    <section className="border-y hairline bg-[var(--ink-2)]">
      <div className="mx-auto max-w-[1300px] px-5 py-24 sm:px-10 sm:py-32">
        <SectionLabel>The Solution</SectionLabel>
        <h2 className="font-display mt-5 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          We’ll Optimize Your Entire AI Stack
        </h2>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {SOLUTIONS.map(({ Icon, title, body }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.65, delay: index * 0.08 }}
              className="rounded-3xl border hairline bg-black/20 p-8 sm:p-10"
            >
              <Icon className="h-7 w-7 text-[var(--acid)]" />
              <h3 className="font-display mt-10 text-3xl">{title}</h3>
              <p className="mt-4 leading-relaxed text-[var(--muted)]">{body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DeliverablesSection() {
  return (
    <section className="mx-auto grid max-w-[1300px] gap-12 px-5 py-24 sm:px-10 sm:py-32 lg:grid-cols-2 lg:items-center">
      <div>
        <SectionLabel>Your Free Audit</SectionLabel>
        <h2 className="font-display mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">
          What You’ll Receive
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
          A practical review built around your costs, your team, and the outcomes you need from AI.
        </p>
      </div>
      <div className="rounded-[2rem] border hairline bg-[var(--ink-2)] p-6 sm:p-10">
        {DELIVERABLES.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            className="flex items-center gap-4 border-b hairline py-5 last:border-b-0"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--acid)] text-[var(--ink)]">
              <Check className="h-4 w-4" strokeWidth={3} />
            </span>
            <span className="text-lg">{item}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y hairline bg-[var(--ink-2)]">
      <div className="mx-auto max-w-[1300px] px-5 py-24 sm:px-10 sm:py-32">
        <SectionLabel>Simple by Design</SectionLabel>
        <h2 className="font-display mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">
          How It Works
        </h2>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map(([number, title], index) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative rounded-3xl border hairline bg-black/20 p-8"
            >
              <span className="font-display text-5xl text-[var(--acid)]">{number}</span>
              <h3 className="mt-12 font-display text-2xl leading-tight">{title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AuditTestimonials() {
  return (
    <section className="mx-auto max-w-[1300px] px-5 py-24 sm:px-10 sm:py-32">
      <SectionLabel>Results</SectionLabel>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        {[
          "NEX3 helped us eliminate four AI subscriptions while improving our workflow.",
          "The audit gave us a clear stack, clear owners, and an immediate list of costs to cut.",
        ].map((quote, index) => (
          <motion.figure
            key={quote}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, delay: index * 0.1 }}
            className="rounded-[2rem] border hairline bg-[var(--ink-2)] p-8 sm:p-10"
          >
            <div className="tracking-[0.22em] text-[var(--acid)]">★★★★★</div>
            <blockquote className="mt-8 font-display text-2xl leading-snug sm:text-3xl">
              “{quote}”
            </blockquote>
            <figcaption className="mt-10 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
              Startup Founder · CEO
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section className="border-y hairline bg-[var(--ink-2)]">
      <div className="mx-auto max-w-[900px] px-5 py-24 sm:px-10 sm:py-32">
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="font-display mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">
          Questions, Answered.
        </h2>
        <div className="mt-12 divide-y divide-[var(--line)] border-y hairline">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group py-6">
              <summary className="cursor-pointer list-none font-display text-xl marker:hidden sm:text-2xl">
                <span className="flex items-center justify-between gap-6">
                  {q}
                  <span className="text-[var(--acid)] transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="max-w-2xl pt-4 leading-relaxed text-[var(--muted)]">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta({ onCta }) {
  return (
    <section className="px-5 py-24 sm:px-10 sm:py-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.75 }}
        className="mx-auto max-w-[1100px] overflow-hidden rounded-[2.5rem] border border-[var(--acid)] bg-[radial-gradient(circle_at_top,rgba(205,255,78,0.18),transparent_55%),var(--ink-2)] px-6 py-20 text-center sm:px-12 sm:py-28"
      >
        <SectionLabel>Limited Weekly Availability</SectionLabel>
        <h2 className="font-display mx-auto mt-6 max-w-4xl text-5xl font-extrabold leading-[0.98] tracking-tight sm:text-7xl">
          Stop Paying for AI You Don’t Need.
        </h2>
        <p className="mt-6 text-lg text-[var(--muted)]">Book your FREE AI Budget Audit today.</p>
        <button
          onClick={onCta}
          className="mt-10 rounded-full bg-[var(--acid)] px-9 py-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink)] transition-transform hover:scale-[1.02]"
        >
          Get My Free Audit
        </button>
      </motion.div>
    </section>
  );
}

