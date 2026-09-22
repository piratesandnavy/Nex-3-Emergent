import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, CalendarDays, ClipboardList, GraduationCap, X } from "lucide-react";
import Nex3Logo from "@/components/site/Nex3Logo";

const CONTACT_EMAIL = "nex3info@gmail.com";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
const UPLOAD_ENDPOINT = `https://formsubmit.co/${CONTACT_EMAIL}`;

export default function ContactCTA({ careers = false }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [position, setPosition] = useState("");
  const [resume, setResume] = useState(null);
  const [projectSpec, setProjectSpec] = useState(null);
  const [loading, setLoading] = useState(false);
  const [proposalOpen, setProposalOpen] = useState(false);
  const resumeInput = useRef(null);
  const projectSpecInput = useRef(null);
  const closeButton = useRef(null);
  const submissionPending = useRef(false);

  useEffect(() => {
    if (!proposalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setProposalOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => closeButton.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [proposalOpen]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    if (!form.name.trim() || !form.email.trim()) {
      e.preventDefault();
      toast.error("Name and email are required.");
      return;
    }
    if (careers && (!form.company.trim() || !form.message.trim() || !position || !resume)) {
      e.preventDefault();
      toast.error("LinkedIn, position, cover letter, and résumé are required.");
      return;
    }
    if (!careers && !projectSpec) {
      e.preventDefault();
      toast.error("RFP / Project Spec is required.");
      return;
    }
    if (resume && resume.size > 10 * 1024 * 1024) {
      e.preventDefault();
      toast.error("Your résumé must be smaller than 10 MB.");
      return;
    }
    if (projectSpec && projectSpec.size > 10 * 1024 * 1024) {
      e.preventDefault();
      toast.error("Your RFP / Project Spec must be smaller than 10 MB.");
      return;
    }

    if (careers) {
      submissionPending.current = true;
      setLoading(true);
      return;
    }

    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("email", form.email.trim());
      payload.append("company", form.company.trim() || "Not provided");
      payload.append("message", form.message.trim() || "No message provided.");
      payload.append("attachment", projectSpec);
      payload.append("_subject", `NEX3 website enquiry from ${form.name.trim()}`);
      payload.append("_template", "table");
      payload.append("_captcha", "false");
      payload.append("_url", window.location.href);

      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: payload,
      });

      if (!response.ok) throw new Error("Form submission failed");

      window.dispatchEvent(new CustomEvent("nex3:inquiry-submitted", {
        detail: { name: form.name.trim(), email: form.email.trim(), company: form.company.trim() },
      }));

      toast.success(
        careers
          ? "Application sent. Thank you for applying to Nex3."
          : "Message sent. We'll be in touch within one business day.",
      );
      setProposalOpen(false);
      setForm({ name: "", email: "", company: "", message: "" });
      setPosition("");
      setResume(null);
      setProjectSpec(null);
      if (resumeInput.current) resumeInput.current.value = "";
      if (projectSpecInput.current) projectSpecInput.current.value = "";
    } catch (error) {
      toast.error("Your message could not be sent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const finishCareerSubmission = () => {
    if (!submissionPending.current) return;
    submissionPending.current = false;
    setLoading(false);
    setForm({ name: "", email: "", company: "", message: "" });
    setPosition("");
    setResume(null);
    if (resumeInput.current) resumeInput.current.value = "";
    toast.success("Application sent with your résumé. Thank you for applying to Nex3.");
  };

  const field =
    "w-full border-b hairline bg-transparent py-3 text-base text-[var(--paper)] placeholder:text-[var(--muted)] outline-none transition-colors duration-300 focus:border-[var(--acid)]";

  const formFields = (modal = false) => (
    <form
      onSubmit={submit}
      action={careers ? UPLOAD_ENDPOINT : undefined}
      method={careers ? "POST" : undefined}
      encType={careers ? "multipart/form-data" : undefined}
      target={careers ? "career-submission-frame" : undefined}
      data-testid={modal ? "proposal-form" : "lead-form"}
      className={modal ? "flex flex-col gap-10 sm:gap-12" : "flex flex-col gap-7 lg:col-span-6 lg:col-start-7"}
    >
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-14">
        <input
          data-testid="lead-name"
          name="name"
          className={`${field} ${modal ? "lg:py-4 lg:text-2xl" : ""}`}
          placeholder="Name *"
          value={form.name}
          onChange={update("name")}
          autoComplete="name"
        />
        <input
          data-testid="lead-email"
          name="email"
          type="email"
          className={`${field} ${modal ? "lg:py-4 lg:text-2xl" : ""}`}
          placeholder="Email *"
          value={form.email}
          onChange={update("email")}
          autoComplete="email"
        />
      </div>
      <input
        data-testid="lead-company"
        name={careers ? "linkedin" : "company"}
        className={`${field} ${modal ? "lg:py-4 lg:text-2xl" : ""}`}
        placeholder={careers ? "LinkedIn *" : "Company / project"}
        value={form.company}
        onChange={update("company")}
      />
      {careers && (
        <select
          data-testid="lead-position"
          name="position"
          className={`${field} appearance-none`}
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          aria-label="Position"
        >
          <option value="" className="bg-[var(--ink-2)]">Position *</option>
          <option value="Internship" className="bg-[var(--ink-2)]">Internship</option>
          <option value="Full time" className="bg-[var(--ink-2)]">Full time</option>
        </select>
      )}
      <textarea
        data-testid="lead-message"
        name={careers ? "cover_letter" : "message"}
        className={`${field} min-h-[120px] resize-none ${modal ? "lg:py-4 lg:text-2xl" : ""}`}
        placeholder={careers ? "Short cover letter *" : "What are you deciding right now?"}
        value={form.message}
        onChange={update("message")}
      />
      {careers && (
        <label className="flex flex-col gap-3 border-b hairline pb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
          <span>Résumé * · PDF, DOC, or DOCX · Max 10 MB</span>
          <input
            ref={resumeInput}
            data-testid="lead-resume"
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setResume(e.target.files?.[0] || null)}
            className="text-sm normal-case tracking-normal text-[var(--paper)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--paper)] file:px-4 file:py-2 file:font-mono file:text-[10px] file:uppercase file:tracking-[0.15em] file:text-[var(--ink)]"
          />
        </label>
      )}
      {careers && (
        <>
          <input type="hidden" name="_subject" value={`NEX3 application from ${form.name.trim() || "candidate"} — ${position || "position not selected"}`} />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_url" value="https://nex3.xyz/team" />
        </>
      )}
      <div className={modal ? "mt-2 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between" : "contents"}>
        {modal && !careers && (
          <label className="flex w-full max-w-xl flex-col gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            <span>RFP / Project Spec * · PDF, DOC, or DOCX · Max 10 MB</span>
            <input
              ref={projectSpecInput}
              data-testid="lead-project-spec"
              name="project_spec"
              type="file"
              required
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setProjectSpec(e.target.files?.[0] || null)}
              className="text-sm normal-case tracking-normal text-[var(--paper)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--paper)] file:px-6 file:py-3 file:font-mono file:text-[11px] file:uppercase file:tracking-[0.15em] file:text-[var(--ink)]"
            />
          </label>
        )}
        <motion.button
          data-testid="lead-submit"
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className={`${modal ? "shrink-0 sm:ml-auto" : "mt-2"} group relative flex items-center justify-center overflow-hidden rounded-full bg-[var(--paper)] px-8 py-4 font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--ink)] disabled:cursor-wait disabled:opacity-60`}
        >
          <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-[var(--ink)]">
            {loading ? (careers ? "Applying…" : "Sending…") : careers ? "Apply Now" : "Send it over"}
            <ArrowRight className="h-4 w-4" />
          </span>
          <span className="absolute inset-0 translate-y-full bg-[var(--acid)] transition-transform duration-300 group-hover:translate-y-0" />
        </motion.button>
      </div>
    </form>
  );

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="border-t hairline bg-[var(--ink-2)]"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-5 py-24 sm:px-10 sm:py-32 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--acid)]">
            {careers ? "Apply for Nex3" : "Book a Call"}
          </span>
          <h2 className="font-display mt-5 text-3xl leading-[1.05] tracking-tight sm:text-5xl">
            {careers
              ? "Join our team for internships and other positions."
              : "Let’s make your next three decisions the right ones."}
          </h2>
          <p className="mt-5 max-w-md text-base text-[var(--muted)] sm:text-lg">
            {careers ? (
              <>
                <strong className="font-semibold text-[var(--paper)]">Ready to Jump Start Your Career?</strong>{" "}
                Join our <strong className="font-semibold text-[var(--paper)]">Springboard Program</strong>{" "}
                and take the first step towards building your professional future in Canada&apos;s tech ecosystem.
              </>
            ) : (
              <>
                <span className="block">Ready to Build Smarter?</span>
                Whether you&apos;re starting with a workshop or ready for full agent deployment, Nex3 meets you where you are. Let&apos;s map out your AI strategy together.
              </>
            )}
          </p>
          <div className="mt-12 w-40 opacity-70">
            <Nex3Logo animate={false} className="h-auto w-full" />
          </div>
        </div>

        {careers ? formFields() : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-7 lg:col-start-6">
            <motion.a
              href="https://cal.com/purmehdi/30min"
              data-cal-link="purmehdi/30min"
              data-cal-namespace="30min"
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
              onClick={(event) => {
                if (!window.Cal?.ns?.["30min"]) return;
                event.preventDefault();
                event.stopPropagation();
                window.Cal.ns["30min"]("modal", {
                  calLink: "purmehdi/30min",
                  config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
                });
              }}
              data-testid="discovery-card"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
              className="group relative min-h-[320px] overflow-hidden rounded-[22px] border hairline bg-[var(--ink-2)] p-8 text-left transition-colors duration-300 hover:border-[var(--acid)] sm:p-10"
            >
              <span className="absolute inset-0 translate-y-full bg-[var(--acid)] transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0 group-active:translate-y-0" />
              <div className="relative z-10 flex items-start justify-between">
                <CalendarDays className="h-8 w-8 text-[var(--acid)] transition-colors duration-300 group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)] group-active:text-[var(--ink)]" strokeWidth={1.8} />
                <ArrowRight className="h-7 w-7 text-[var(--muted)] transition-all duration-300 group-hover:translate-x-2 group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)] group-active:text-[var(--ink)]" strokeWidth={1.5} />
              </div>
              <div className="relative z-10 mt-9 max-w-xl">
                <h3 className="font-display text-3xl font-bold leading-tight tracking-[-0.035em] transition-colors duration-300 group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)] group-active:text-[var(--ink)]">Book a Discovery Call</h3>
                <p className="mt-5 text-lg leading-relaxed text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)] group-active:text-[var(--ink)]">30-minute strategy session — no commitment required.</p>
              </div>
            </motion.a>

            <motion.button
              type="button"
              data-testid="proposal-card"
              onClick={() => setProposalOpen(true)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
              className="group relative min-h-[320px] overflow-hidden rounded-[22px] border hairline bg-[var(--ink-2)] p-8 text-left transition-colors duration-300 hover:border-[var(--acid)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acid)] sm:p-10"
              aria-haspopup="dialog"
            >
              <span className="absolute inset-0 translate-y-full bg-[var(--acid)] transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0 group-active:translate-y-0" />
              <div className="relative z-10 flex items-start justify-between">
                <ClipboardList className="h-8 w-8 text-[var(--acid)] transition-colors duration-300 group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)] group-active:text-[var(--ink)]" strokeWidth={1.8} />
                <ArrowRight className="h-7 w-7 text-[var(--muted)] transition-all duration-300 group-hover:translate-x-2 group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)] group-active:text-[var(--ink)]" strokeWidth={1.5} />
              </div>
              <div className="relative z-10 mt-9 max-w-xl">
                <h3 className="font-display text-3xl font-bold leading-tight tracking-[-0.035em] transition-colors duration-300 group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)] group-active:text-[var(--ink)]">Request a Proposal</h3>
                <p className="mt-5 text-lg leading-relaxed text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)] group-active:text-[var(--ink)]">Get a scoped plan and pricing tailored to your organization.</p>
              </div>
            </motion.button>

            <motion.a
              href="https://cal.com/purmehdi/ai-web3-business-clinic-session"
              data-cal-link="purmehdi/ai-web3-business-clinic-session"
              data-cal-namespace="ai-web3-business-clinic-session"
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
              onClick={(event) => {
                const namespace = "ai-web3-business-clinic-session";
                if (!window.Cal?.ns?.[namespace]) return;
                event.preventDefault();
                event.stopPropagation();
                window.Cal.ns[namespace]("modal", {
                  calLink: "purmehdi/ai-web3-business-clinic-session",
                  config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
                });
              }}
              data-testid="workshop-card"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
              className="group relative min-h-[250px] overflow-hidden rounded-[22px] border hairline bg-[var(--ink-2)] p-8 text-left transition-colors duration-300 hover:border-[var(--acid)] sm:p-10 md:col-span-2"
            >
              <span className="absolute inset-0 translate-y-full bg-[var(--acid)] transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0 group-active:translate-y-0" />
              <div className="relative z-10 flex items-start justify-between">
                <GraduationCap className="h-8 w-8 text-[var(--acid)] transition-colors duration-300 group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)] group-active:text-[var(--ink)]" strokeWidth={1.8} />
                <ArrowRight className="h-7 w-7 text-[var(--muted)] transition-all duration-300 group-hover:translate-x-2 group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)] group-active:text-[var(--ink)]" strokeWidth={1.5} />
              </div>
              <div className="relative z-10 mt-9 max-w-4xl">
                <h3 className="font-display text-3xl font-bold leading-tight tracking-[-0.035em] transition-colors duration-300 group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)] group-active:text-[var(--ink)]">Start with a Workshop</h3>
                <p className="mt-5 text-lg leading-relaxed text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)] group-active:text-[var(--ink)]">Executive briefings available within 2 weeks of engagement.</p>
              </div>
            </motion.a>
          </div>
        )}
        {careers && (
          <iframe
            name="career-submission-frame"
            title="Career application submission"
            className="hidden"
            onLoad={finishCareerSubmission}
          />
        )}
      </div>

      {!careers && createPortal(
        <AnimatePresence>
          {proposalOpen && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-0 backdrop-blur-md sm:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setProposalOpen(false);
              }}
              data-testid="proposal-modal-backdrop"
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Request a Proposal"
                data-testid="proposal-modal"
                initial={{ opacity: 0, y: 28, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.99 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-h-[100dvh] w-full max-w-[1120px] overflow-y-auto border border-[var(--line)] bg-[var(--ink-2)] px-6 pb-10 pt-16 shadow-2xl sm:max-h-[82dvh] sm:rounded-[24px] sm:px-12 sm:pb-12 sm:pt-12 lg:px-16 lg:pb-14 lg:pt-8"
              >
                <div className="mx-auto max-w-[1260px]">
                  {formFields(true)}
                </div>
                <button
                  ref={closeButton}
                  type="button"
                  onClick={() => setProposalOpen(false)}
                  className="absolute right-5 top-5 rounded-full border hairline p-3 text-[var(--muted)] transition-colors hover:border-[var(--acid)] hover:text-[var(--paper)] focus:outline-none focus:ring-2 focus:ring-[var(--acid)] sm:right-8 sm:top-8"
                  aria-label="Close proposal form"
                >
                  <X className="h-5 w-5" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 border-t hairline px-5 py-8 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)] sm:flex-row sm:px-10">
        <span>NEX3 Inc. — Plan · Build · Hire</span>
        <span>© {new Date().getFullYear()} — The next-gen economy, decoded.</span>
      </div>
    </section>
  );
}
