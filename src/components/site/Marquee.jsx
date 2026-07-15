const WORDS = [
  "PLAN",
  "BUILD",
  "HIRE",
  "NO JARGON",
  "NO HYPE",
  "NO 6-MONTH DECKS",
  "AI",
  "WEB3",
];

export default function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <section
      data-testid="marquee"
      className="overflow-hidden border-b hairline py-8"
      aria-hidden="true"
    >
      <div className="flex w-max marquee-track">
        {row.map((w, i) => (
          <div key={i} className="flex items-center">
            <span className="font-display px-8 text-3xl tracking-tight text-[var(--paper)] sm:text-5xl">
              {w}
            </span>
            <span className="text-2xl text-[var(--acid)] sm:text-4xl">✳</span>
          </div>
        ))}
      </div>
    </section>
  );
}
