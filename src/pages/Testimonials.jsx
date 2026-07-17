import { useEffect } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import useLenis from "@/hooks/useLenis";
import Nav from "@/components/site/Nav";
import ContactCTA from "@/components/site/ContactCTA";

const TESTIMONIALS = [
  {
    quote:
      "NEX3 cut through six months of internal debate in two weeks. We walked out with a token model our investors actually understood — and a roadmap we could ship against.",
    name: "Elena Vasquez",
    role: "Co-founder & CEO",
    company: "Ledgerframe",
    stat: "$12M raised",
  },
  {
    quote:
      "No decks, no jargon — just operators who sat inside our problem. They helped us hire two staff engineers and a Head of Growth in a single quarter.",
    name: "Marcus Bello",
    role: "Founder",
    company: "Northwind AI",
    stat: "3 senior hires",
  },
  {
    quote:
      "The Plan phase alone paid for the engagement. We killed a feature that would have burned a year of runway and doubled down on what was working.",
    name: "Priya Raman",
    role: "COO",
    company: "Cadence Labs",
    stat: "9 mo. runway saved",
  },
  {
    quote:
      "They speak founder and they speak protocol. Rare to find a team that can pressure-test tokenomics and org design in the same conversation.",
    name: "Jonas Halvorsen",
    role: "General Partner",
    company: "Meridian Capital",
    stat: "4 portfolio cos.",
  },
  {
    quote:
      "We came in convinced we needed to raise. NEX3 showed us we needed to focus. Best strategic decision we made all year.",
    name: "Amara Okonkwo",
    role: "Co-founder",
    company: "Sunfold",
    stat: "2x conversion",
  },
  {
    quote:
      "Fast, candid, and allergic to fluff. Every session ended with a decision I could act on the next morning.",
    name: "David Chen",
    role: "Head of Product",
    company: "Relay Systems",
    stat: "6-wk GTM",
  },
];

const LOGOS = [
  "LEDGERFRAME",
  "NORTHWIND AI",
  "CADENCE LABS",
  "MERIDIAN",
  "SUNFOLD",
  "RELAY SYSTEMS",
];

function Card({ t, i }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      data-testid={`testimonial-${i}`}
      className="group flex flex-col justify-between border hairline bg-[var(--ink-2)] p-8 transition-colors duration-500 hover:border-[var(--acid)] sm:p-10"
    >
      <div>
        <Quote className="h-7 w-7 text-[var(--acid)]" />
        <blockquote className="mt-6 text-lg leading-relaxed text-[var(--paper)] sm:text-xl">
          {t.quote}
        </blockquote>
      </div>
      <figcaption className="mt-10 flex items-end justify-between border-t hairline pt-6">
        <div>
          <div className="font-display text-base tracking-tight">{t.name}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
            {t.role} · {t.company}
          </div>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--acid)]">
          {t.stat}
        </div>
      </figcaption>
    </motion.figure>
  );
}

export default function Testimonials() {
  useLenis();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main data-testid="testimonials-page" className="relative bg-[var(--ink)]">
      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-5 pb-16 pt-36 sm:px-10 sm:pt-44">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--acid)]"
        >
          Testimonials
        </motion.span>
        <motion.h1
          data-testid="testimonials-headline"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display mt-6 max-w-4xl text-4xl font-extrabold leading-[0.98] tracking-[-0.02em] sm:text-6xl lg:text-7xl"
        >
          Trusted by the people making the{" "}
          <span className="text-[var(--acid)]">hard calls</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg"
        >
          Founders, operators, and investors on what changes when you replace
          six-month decks with three clear decisions.
        </motion.p>
      </section>

      {/* Logos strip */}
      <section className="border-y hairline">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-10 gap-y-6 px-5 py-8 sm:px-10">
          {LOGOS.map((l) => (
            <span
              key={l}
              className="font-display text-lg tracking-tight text-[var(--muted)] sm:text-xl"
            >
              {l}
            </span>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Card key={t.name} t={t} i={i} />
          ))}
        </div>
      </section>

      <ContactCTA />
    </main>
  );
}


