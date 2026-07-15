import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import Nex3Logo from "@/components/site/Nex3Logo";

const scrollTo = (id) => {
  const el = document.querySelector(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: 0 });
  else el.scrollIntoView({ behavior: "smooth" });
};

const HEADLINE = ["Your Next 3 Decisions", "in the AI &", "Web3 Economy."];

function Line({ children, delay }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const base = 1.55; // start headline after logo assembles

  return (
    <section
      id="top"
      ref={ref}
      data-testid="hero-section"
      className="relative flex min-h-screen flex-col justify-between overflow-hidden px-5 pb-10 pt-28 sm:px-10"
    >
      {/* kicker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mx-auto flex w-full max-w-[1400px] items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]"
      >
        <span data-testid="hero-kicker">Advisory · Plan / Build / Hire</span>
        <span className="hidden sm:inline">Est. for the next-gen economy</span>
      </motion.div>

      {/* Assembling logo */}
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 items-center justify-center">
        <motion.div
          style={{ y: logoY, scale: logoScale, opacity: logoOpacity }}
          className="w-full"
        >
          <Nex3Logo
            className="mx-auto h-auto w-[86%] max-w-[900px]"
            delay={0.35}
            testId="hero-logo"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 h-px w-[86%] max-w-[900px] origin-left bg-[var(--line)]"
          />
        </motion.div>
      </div>

      {/* Headline + copy + CTA */}
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
        <h1
          data-testid="hero-headline"
          className="font-display col-span-1 text-[9vw] font-extrabold leading-[0.95] tracking-[-0.02em] sm:text-5xl md:text-6xl lg:col-span-7 lg:text-[4.4rem]"
        >
          {HEADLINE.map((l, i) => (
            <Line key={i} delay={base + i * 0.12}>
              {i === 2 ? (
                <span>
                  Web3 <span className="text-[var(--acid)]">Economy.</span>
                </span>
              ) : (
                l
              )}
            </Line>
          ))}
        </h1>

        <div className="col-span-1 lg:col-span-5">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: base + 0.5 }}
            data-testid="hero-subcopy"
            className="max-w-md text-base leading-relaxed text-[var(--muted)] sm:text-lg"
          >
            We help founders and operators <span className="text-[var(--paper)]">Plan, Build, and Hire</span> for
            the next-gen economy — without the jargon, hype, or 6-month
            consulting decks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: base + 0.65 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button
              data-testid="hero-book-call"
              onClick={() => scrollTo("#contact")}
              className="group relative overflow-hidden rounded-full bg-[var(--paper)] px-7 py-3.5 font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--ink)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Book a Call <ArrowDownRight className="h-4 w-4" />
              </span>
              <span className="absolute inset-0 translate-y-full bg-[var(--acid)] transition-transform duration-300 group-hover:translate-y-0" />
            </button>

            <button
              data-testid="hero-approach"
              onClick={() => scrollTo("#approach")}
              className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--muted)] underline decoration-[var(--line)] underline-offset-8 transition-colors duration-300 hover:text-[var(--paper)]"
            >
              See how we work
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
