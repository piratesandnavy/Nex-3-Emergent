import { motion } from "framer-motion";

const CHAPTERS = [
  {
    n: "01",
    title: "Plan",
    lead: "Clarity before capital.",
    body: "We pressure-test your thesis, map the real market, and turn ambition into a decision you can defend to your board, your team, and yourself — in days, not quarters.",
  },
  {
    n: "02",
    title: "Build",
    lead: "Ship the right thing.",
    body: "From architecture to token design to go-to-market, we sit inside the work — helping you build a product and a company that survive contact with reality.",
  },
  {
    n: "03",
    title: "Hire",
    lead: "The team that compounds.",
    body: "We help you find and close the operators, engineers, and leaders who move the needle — and design the org so the next hire is easier than the last.",
  },
];

export default function Manifesto() {
  return (
    <section
      id="approach"
      data-testid="manifesto"
      className="mx-auto max-w-[1400px] px-5 py-24 sm:px-10 sm:py-32"
    >
      <div className="mb-16 max-w-2xl">
        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--acid)]">
          The Operating Model
        </span>
        <h2 className="font-display mt-5 text-3xl leading-[1.05] tracking-tight sm:text-5xl">
          Three moves. Nothing wasted.
        </h2>
        <p className="mt-5 text-base text-[var(--muted)] sm:text-lg">
          We work like operators, not slide factories. Every engagement bends
          toward a decision you can act on.
        </p>
      </div>

      <div id="work" className="divide-y divide-[var(--line)] border-t hairline">
        {CHAPTERS.map((c, i) => (
          <motion.div
            key={c.n}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group grid grid-cols-1 gap-6 py-12 md:grid-cols-12 md:items-start"
            data-testid={`chapter-${c.n}`}
          >
            <div className="font-display col-span-2 text-5xl text-[var(--muted)] transition-colors duration-500 group-hover:text-[var(--acid)] sm:text-6xl">
              {c.n}
            </div>
            <div className="col-span-4">
              <h3 className="font-display text-3xl tracking-tight sm:text-4xl">
                {c.title}
              </h3>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                {c.lead}
              </p>
            </div>
            <p className="col-span-6 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              {c.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
