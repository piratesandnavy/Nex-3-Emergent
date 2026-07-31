import { useEffect } from "react";
import { motion } from "framer-motion";
import useLenis from "@/hooks/useLenis";
import Nav from "@/components/site/Nav";
import ContactCTA from "@/components/site/ContactCTA";

const STATS = [
  { value: "2", label: "Alumni placed" },
  { value: "100%", label: "Job placement" },
  { value: "200+", label: "Mentor-hours invested" },
  { value: "10+", label: "Projects shipped" },
];

const ALUMNI = [
  {
    name: "Sepideh Sadeghi",
    cohort: "Springboard '25 Alum",
    former: "Former BI Intern at Nex3",
    nowRole: "Business Intelligence Professional",
    nowDetail: "Recently graduated, NYIT MBA (Vancouver), 2025",
    image:
      "https://nex3.lovable.app/lovable-uploads/7d8fda24-87c2-483d-bf51-72372b920926.png",
    linkedin: "https://www.linkedin.com/in/sepideh-sadeghi1993/",
    quote:
      "Springboard didn't just give me Canadian work experience — it gave me the confidence to walk into a room and own my craft.",
    journey:
      "Sepideh joined Nex3 as an MBA candidate at NYIT Vancouver looking for hands-on Canadian work experience to bridge classroom theory with real client outcomes. She came in curious about analytics and left as a polished BI practitioner.",
    built: [
      "Client-facing BI dashboards translating raw operational data into weekly executive views",
      "Reusable reporting templates that the team still uses for new engagements",
      "Data storytelling decks that turned numbers into recommendations",
    ],
    learned: [
      "End-to-end BI delivery — from stakeholder interview to deployed dashboard",
      "How to communicate technical findings to non-technical decision makers",
      "Working in a fast-moving consulting environment alongside senior advisors",
    ],
    impact: [
      "Internally: raised the bar for how Nex3 packages and presents BI work to clients",
      "Externally: contributions are still in production at client engagements months after her departure",
      "Graduated her MBA and stepped into the Canadian tech market with a portfolio she built here",
    ],
    tags: ["Business Intelligence", "Dashboard Development", "Data Storytelling"],
  },
  {
    name: "Hamed Aghaei",
    cohort: "Springboard '25 Alum",
    former: "Former BI Intern at Nex3",
    nowRole: "BI & Analytics Professional",
    nowDetail: "Recently placed in industry",
    image:
    "/images/team/hamed-aghaei.jpeg",
    linkedin: "https://www.linkedin.com/in/hamedaghaei/",
    quote:
      "I came in to learn the tools. I left with a way of thinking — model the data, then tell the story.",
    journey:
      "Hamed joined the BI track wanting to deepen his data modeling chops on real business problems. He went from sketching schemas on paper to shipping reporting systems that the team relies on.",
    built: [
      "Data models powering recurring client reporting workflows",
      "Reporting pipelines that cut manual work for the analytics team",
      "Documentation that made it easy for the next intern to pick up where he left off",
    ],
    learned: [
      "Production-grade data modeling and reporting architecture",
      "Translating ambiguous business questions into clean analytical schemas",
      "Working across consultants and clients with calm precision",
    ],
    impact: [
      "Internally: established documentation patterns now used across BI projects",
      "Externally: shipped reporting systems still serving client decisions today",
      "Successfully landed a role in the Canadian tech industry post-program",
    ],
    tags: ["Data Modeling", "Reporting Systems", "Business Analytics"],
  },
];

const GIVES = [
  {
    title: "Real mentorship",
    desc: "You sit alongside senior consultants. No coffee runs — actual project ownership and weekly feedback.",
  },
  {
    title: "Real projects",
    desc: "Client-facing work that ships. Your portfolio after Springboard is the work itself, not a slide deck about it.",
  },
  {
    title: "A career launchpad",
    desc: "Canadian work experience, a polished portfolio, and a network that helps you land your first role.",
  },
];

function LinkedInButton({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-fit items-center justify-center rounded-lg border border-[var(--line)] px-6 py-3 font-mono text-sm text-[var(--paper)] transition-colors duration-300 hover:border-[var(--acid)] hover:text-[var(--acid)]"
    >
      Connect on LinkedIn
    </a>
  );
}

function AlumniCard({ a, i }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
      data-testid={`alumni-${i}`}
      className="border hairline bg-[var(--ink-2)] p-8 sm:p-10"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        <div>
          <div className="overflow-hidden border hairline">
            <img
              src={a.image}
              alt={a.name}
              className="aspect-square w-full object-cover"
            />
          </div>
          <span className="mt-6 block font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--acid)]">
            {a.cohort}
          </span>
          <h3 className="font-display mt-2 text-2xl tracking-tight sm:text-3xl">
            {a.name}
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">{a.former}</p>

          <div className="mt-6 border-t hairline pt-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
              Now
            </span>
            <p className="mt-2 font-display text-lg tracking-tight">
              {a.nowRole}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">{a.nowDetail}</p>
          </div>

          <div className="mt-6">
            <LinkedInButton href={a.linkedin} />
          </div>

          <blockquote className="mt-8 border-l-2 border-[var(--acid)] pl-4 text-sm italic leading-relaxed text-[var(--paper)]">
            "{a.quote}"
          </blockquote>

          <div className="mt-6 flex flex-wrap gap-2">
            {a.tags.map((t) => (
              <span
                key={t}
                className="border hairline px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--acid)]">
            The Journey
          </h4>
          <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
            {a.journey}
          </p>

          <h4 className="mt-8 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--acid)]">
            What They Built
          </h4>
          <ul className="mt-3 space-y-2">
            {a.built.map((b) => (
              <li key={b} className="flex gap-3 text-sm leading-relaxed text-[var(--muted)]">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--acid)]" />
                {b}
              </li>
            ))}
          </ul>

          <h4 className="mt-8 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--acid)]">
            What They Learned
          </h4>
          <ul className="mt-3 space-y-2">
            {a.learned.map((l) => (
              <li key={l} className="flex gap-3 text-sm leading-relaxed text-[var(--muted)]">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--acid)]" />
                {l}
              </li>
            ))}
          </ul>

          <h4 className="mt-8 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--acid)]">
            The Impact — Inside Nex3 And Beyond
          </h4>
          <ul className="mt-3 space-y-2">
            {a.impact.map((im) => (
              <li key={im} className="flex gap-3 text-sm leading-relaxed text-[var(--muted)]">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--acid)]" />
                {im}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.article>
  );
}

export default function SpringboardAlumni() {
  useLenis();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main data-testid="springboard-alumni-page" className="relative bg-[var(--ink)]">
      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-5 pb-16 pt-36 sm:px-10 sm:pt-44">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--acid)]"
        >
          Springboard · Class Notes
        </motion.span>
        <motion.h1
          data-testid="alumni-headline"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display mt-6 max-w-4xl text-4xl font-extrabold leading-[0.98] tracking-[-0.02em] sm:text-6xl lg:text-7xl"
        >
          From intern to <span className="text-[var(--acid)]">industry.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg"
        >
          Springboard is built to launch careers. These are the people who
          came through Nex3, did the work, and stepped out the other side as
          professionals. We're proud of them — and we're proud of the program
          that helped get them there.
        </motion.p>
      </section>

      {/* Stats */}
      <section className="border-y hairline">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-5 py-10 sm:px-10 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl tracking-tight text-[var(--acid)] sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alumni */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-10 sm:py-28">
        <div className="flex flex-col gap-10">
          {ALUMNI.map((a, i) => (
            <AlumniCard key={a.name} a={a} i={i} />
          ))}
        </div>
      </section>

      {/* What Springboard gives you */}
      <section className="border-t hairline bg-[var(--ink-2)]">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-10 sm:py-28">
          <h2 className="font-display max-w-2xl text-3xl tracking-tight sm:text-5xl">
            What Springboard gives you
          </h2>
          <p className="mt-5 max-w-xl text-base text-[var(--muted)] sm:text-lg">
            The same things that turned Sepideh and Hamed into industry-ready
            professionals are waiting for the next cohort.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-px border hairline bg-[var(--line)] sm:grid-cols-3">
            {GIVES.map((g) => (
              <div key={g.title} className="bg-[var(--ink-2)] p-8">
                <h3 className="font-display text-lg tracking-tight">{g.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {g.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 text-center sm:px-10 sm:py-28">
        <h2 className="font-display mx-auto max-w-2xl text-3xl tracking-tight sm:text-5xl">
          Be the next name on this wall.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-[var(--muted)] sm:text-lg">
          Applications for the next Springboard cohort are open. Bring the
          curiosity — we'll bring the projects, the mentors, and the runway.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/book-discovery-call"
            className="rounded-full bg-[var(--acid)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink)]"
          >
            Apply to Springboard
          </a>
          <a
            href="/team"
            className="rounded-full border border-[var(--paper)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper)]"
          >
            See student projects
          </a>
        </div>
      </section>

      <ContactCTA />
    </main>
  );
}
