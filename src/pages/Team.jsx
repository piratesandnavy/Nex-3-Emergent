import { useEffect } from "react";
import { motion } from "framer-motion";
import useLenis from "@/hooks/useLenis";
import Nav from "@/components/site/Nav";
import ContactCTA from "@/components/site/ContactCTA";

const SITE_BASE = window.location.hostname.endsWith("github.io")
  ? "/Nex-3-Emergent"
  : "";

const CONSULTANTS = [
  {
    name: "Mostafa Purmehdi",
    role: "Senior Consultant · PhD, MBA",
    bio: "Leading expert in AI and Web3 business strategy with 15+ years helping companies navigate digital transformation. Specializes in strategic planning, technology integration, and organizational change.",
    image: "/images/team/mostafa-purmehdi.jpg",
    linkedin: "https://www.linkedin.com/in/purmehdi/",
  },
  {
    name: "Mo Feyzbakhsh",
    role: "Digital Marketing Consultant",
    bio: "Owns the digital front of your company — web design, paid social campaigns, community building, content strategy, and growth hacking for digital-first businesses.",
    image: "/images/team/mo-feyzbakhsh.jpg",
    linkedin: "https://www.linkedin.com/in/feyzbakhsh/",
  },
  {
    name: "Mansour Farhan",
    role: "AI & ML Consultant",
    bio: "Machine learning engineer and AI strategist with deep expertise in shipping AI solutions for business. Focuses on practical AI adoption and ROI optimization.",
    image: "/images/team/mansour-farhan.jpg",
    linkedin: "https://linkedin.com/in/mansour-farhan",
  },
  {
    name: "Simon Pipel",
    role: "Products & Operations Consultant",
    bio: "Product strategy and operations expert focused on scaling your operations — from product development to operational efficiency and team management.",
    image: "/images/team/simon-pipel.jpg",
    linkedin: "https://www.linkedin.com/in/simon-pipel/",
  },
];

const INTERNS = [
  {
    name: "Raida Sarooj",
    role: "BI Intern",
    bio: "Business intelligence intern specializing in data analytics and insights. Passionate about leveraging data to drive strategic decisions.",
    image: "/images/team/raida-sarooj.jpg",
    linkedin: "https://www.linkedin.com/in/raida-sarooj/",
  },
  {
    name: "Siddharth Manchanda",
    role: "AI Marketing & Sales Intern",
    bio: "AI marketing and sales specialist focused on using automation, data, and emerging tools to build smarter campaigns and sustainable growth.",
    image: "/images/team/siddharth-m.jpg",
    linkedin: "https://www.linkedin.com/in/siddharthmspm",
  },
  {
    name: "Afrah Ameen",
    role: "Social Media Specialist Intern",
    bio: "Builds engaging online communities and crafts compelling content strategies, managing campaigns and social presence across platforms.",
    image: "/images/team/afrah-ameen.png",
    linkedin: "https://www.linkedin.com/in/afrah-ameen/",
  },
  {
    name: "Dayakar Rayapureddy",
    role: "Sustainability & Leadership Intern",
    bio: "Leads the Youth for the Land program — mobilizing young changemakers around environmental stewardship and community-driven climate action.",
    image: "/images/team/dayakar-rayapureddy.png",
    linkedin: "https://www.linkedin.com/in/dayakar-rayapureddy-018394195",
  },
];

const PROGRAM = [
  { n: "01", t: "Canadian Work Experience", d: "Hands-on experience in the Canadian tech industry." },
  { n: "02", t: "Skill Development", d: "Learn cutting-edge AI and Web3 through real projects." },
  { n: "03", t: "Mentorship", d: "Work closely with industry experts and senior consultants." },
  { n: "04", t: "Career Support", d: "Guidance for applying to your dream jobs." },
];

function LinkedInIcon() { return ( <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#0A66C2" /><circle cx="8.4" cy="8.4" r="1.6" fill="#fff" /><rect x="6.8" y="10.4" width="3.2" height="7.6" fill="#fff" /><path d="M11.6 18V10.4h3.2v1.3c.6-.9 1.6-1.5 2.9-1.5 2.3 0 3.5 1.5 3.5 4.1V18h-3.2v-3.4c0-1.1-.4-1.9-1.4-1.9-1 0-1.6.7-1.6 1.8V18h-3.2z" fill="#fff" /></svg> ); }

function PersonCard({ p, i }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      data-testid={`team-member-${i}`}
      className="group flex flex-col border-t hairline pt-8"
    >
      <div className="relative mb-6 aspect-[4/3] overflow-hidden border hairline bg-[var(--ink-2)]">
        <img
          src={`${SITE_BASE}${p.image}`}
          alt={`${p.name}, ${p.role}`}
          loading="lazy"
          className="h-full w-full object-cover object-top grayscale transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/50 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--muted)]">
          NEX3
        </span>
      </div>
      <h3 className="font-display text-xl tracking-tight sm:text-2xl flex items-center gap-2">
        {p.name}
        {p.linkedin && (
          <a
            href={p.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${p.name} on LinkedIn`}
            className="inline-flex shrink-0 text-[var(--muted)] transition-colors hover:text-[var(--acid)]"
          >
            <LinkedInIcon />
          </a>
        )}
      </h3>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--acid)]">
        {p.role}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{p.bio}</p>
    </motion.article>
  );
}

function CTAButton({ cta }) { return ( <button type="button" onClick={cta.onClick} className="group relative overflow-hidden rounded-full border border-[var(--paper)] px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em]"><span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--ink)]">{cta.label}</span><span className="absolute inset-0 -z-0 translate-y-full bg-[var(--acid)] transition-transform duration-300 group-hover:translate-y-0" /></button> ); } function Group({ label, count, people, offset = 0, cta, ctaPlacement = "top" }) {
  return (
    <div className="mb-24">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b hairline pb-4">
        <h2 className="font-display text-2xl tracking-tight sm:text-3xl">{label}</h2>
        <div className="flex items-center gap-6">
          {cta && ctaPlacement === "top" && <CTAButton cta={cta} />}
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--muted)]">
            {count} people
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {people.map((p, i) => ( <PersonCard key={p.name} p={p} i={i + offset} /> ))} </div> {cta && ctaPlacement === "bottom" && (<div className="mt-12 flex justify-center"><CTAButton cta={cta} /></div>)} </div> ); } export default function Team() {
  useLenis();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const scrollToSpringboard = () => {
    window.location.href = `${SITE_BASE}/springboard/alumni`;
  };

  return (
    <main data-testid="team-page" className="relative bg-[var(--ink)]">
      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-5 pb-16 pt-36 sm:px-10 sm:pt-44">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--acid)]"
        >
          Our Team
        </motion.span>
        <motion.h1
          data-testid="team-headline"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display mt-6 max-w-4xl text-4xl font-extrabold leading-[0.98] tracking-[-0.02em] sm:text-6xl lg:text-7xl"
        >
          The people who move your{" "}
          <span className="text-[var(--acid)]">decisions</span> forward.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg"
        >
          Meet the team that will guide you through your AI and Web3 journey —
          operators, strategists, and builders, not slide factories.
        </motion.p>
      </section>

      {/* Groups */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-10">
        <Group label="Consultants" count={CONSULTANTS.length} people={CONSULTANTS} offset={0} />
        <Group
          label="Interns"
          count={INTERNS.length}
          people={INTERNS}
          offset={100}
          cta={{ label: "Springboard Alumni", onClick: scrollToSpringboard }} ctaPlacement="bottom" />
      </section>

      {/* Internship program */}
      <section
        data-testid="internship-program"
        className="border-y hairline bg-[var(--ink-2)]"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-10 sm:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)] lg:gap-16">
            <div className="max-w-2xl">
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--acid)]">
                Springboard Internship Program
              </span>
              <h2 className="font-display mt-5 text-3xl leading-[1.05] tracking-tight sm:text-5xl">
                Build Canadian work experience while you learn.
              </h2>
              <p className="mt-5 text-base text-[var(--muted)] sm:text-lg">
                For students who want to gain real experience, learn new skills,
                and land their dream jobs.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center lg:justify-end"
            >
              <img
                src={`${SITE_BASE}/images/springboard-logo.png`}
                alt="Springboard — Launch Your Career"
                className="w-full max-w-[620px] mix-blend-screen"
              />
            </motion.div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-px border hairline bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
            {PROGRAM.map((b, i) => (
              <motion.div
                key={b.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-[var(--ink-2)] p-8"
              >
                <div className="font-display text-3xl text-[var(--muted)]">{b.n}</div>
                <h3 className="mt-4 font-display text-lg tracking-tight">{b.t}</h3>
                <p className="mt-2 text-sm leading-snug text-[var(--muted)]">{b.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA careers />
    </main>
  );
}
