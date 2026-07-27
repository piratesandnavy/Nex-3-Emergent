import { useEffect } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import useLenis from "@/hooks/useLenis";
import Nav from "@/components/site/Nav";
import ContactCTA from "@/components/site/ContactCTA";

const TESTIMONIALS = [
  {
    quote:
      "Nex3's free discovery call helped turn my vague idea into a clear, actionable plan. Their hands-on brainstorming and sharp feedback played a key role in helping me secure a $5,000 grant in Vancouver. If you need clarity and direction, this is where it starts.",
    name: "Dayakar Rayapureddy",
    role: "President",
    company: "Akhanda Seva Samsthan NGO",
    stat: "$5,000 grant secured",
    image: "/images/testimonials/dayakar-rayapureddy.png",
  },
  {
    quote:
      "I had the pleasure of working directly with Mostafa as his Teaching Assistant for the MBA Marketing Management course at Simon Fraser University. He is an exceptional professor and mentor who brings clarity, structure, and energy to everything he does. His openness to new ideas, paired with a strong foundation in marketing strategy, created a dynamic and inclusive learning environment.",
    name: "Tara Nichols",
    role: "RN · MBA",
    company: "Strategy and Operations",
    stat: "Reported directly · 2025",
    image: "/images/testimonials/tara-nichols.png",
  },
  {
    quote:
      "Mostafa's depth of knowledge and passion for leveraging innovative technologies in marketing and business intelligence is truly inspiring. His guidance in business intelligence and data analytics has resulted in tangible improvements in customer acquisition and overall performance.",
    name: "Afa Habibi",
    role: "Senior Project Coordinator",
    company: "Civil Construction",
    stat: "Client · 2024",
    image: "/images/testimonials/afa-habibi.png",
  },
  {
    quote:
      "Over the last year, I had several consulting sessions with Nex3 discussing my Ed-Tech startup. The team has always provided insightful feedback on the business as well as actionable items on how to move forward. The team is sharp, knowledgeable, and above all, extremely visionary.",
    name: "Iman Moazzen",
    role: "CEO",
    company: "Castofly",
    stat: "Client · 2021",
    image: "/images/testimonials/iman-moazzen.png",
  },
  {
    quote:
      "He is an excellent consultant with great vision for technical marketing and data. His simple yet logical methods make you understand concepts. He believes in thinking big and outside the box, is patient, and is always ready to help.",
    name: "Rishab Gupta",
    role: "Senior Trade Operations Analyst",
    company: "NextEra Energy",
    stat: "Reported directly · 2020",
    image: "/images/testimonials/rishab-gupta.png",
  },
  {
    quote:
      "His patience on envisioning, his talent in data analysis, his focus on your need, and his direct-to-the-point solutions are what make him unique in his field.",
    name: "Hashem Aletaha",
    role: "Sales Manager ProAV & Events",
    company: "Barco",
    stat: "Worked together · 2010",
    image: "/images/testimonials/hashem-aletaha.png",
  },
];

const LOGOS = [
  "AKHANDA SEVA SAMSTHAN",
  "STRATEGY & OPERATIONS",
  "CIVIL CONSTRUCTION",
  "CASTOFLY",
  "NEXTERA ENERGY",
  "BARCO",
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
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={t.image}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full border hairline object-cover"
          />
          <div className="min-w-0">
            <div className="font-display text-base tracking-tight">{t.name}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              {t.role} · {t.company}
            </div>
          </div>
        </div>
        <div className="ml-3 max-w-[9rem] text-right font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--acid)]">
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
          Founders, operators, and leaders on what changes when clear strategy
          replaces noise, delay, and generic advice.
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
