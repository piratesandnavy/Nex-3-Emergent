import { motion } from "framer-motion";

const STATS = [
  { k: "120+", v: "Founders & operators advised" },
  { k: "$300M+", v: "Raised & deployed alongside" },
  { k: "3", v: "Continents, one operating model" },
  { k: "0", v: "Jargon. Hype. Filler decks." },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function TrustBar() {
  return (
    <section data-testid="trust-bar" className="border-y hairline">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px bg-[var(--line)] lg:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.k}
            custom={i}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="bg-[var(--ink)] px-6 py-10 sm:px-8 sm:py-14"
            data-testid={`stat-${i}`}
          >
            <div className="font-display text-4xl tracking-tight sm:text-5xl">
              {s.k}
            </div>
            <div className="mt-3 max-w-[16ch] text-sm leading-snug text-[var(--muted)]">
              {s.v}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
