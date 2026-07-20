import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import Nex3Logo from "@/components/site/Nex3Logo";

const CONTACT_EMAIL = "nex3.info@gmail.com";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
const UPLOAD_ENDPOINT = `https://formsubmit.co/${CONTACT_EMAIL}`;

export default function ContactCTA({ careers = false }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [position, setPosition] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const resumeInput = useRef(null);
  const submissionPending = useRef(false);

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
    if (resume && resume.size > 10 * 1024 * 1024) {
      e.preventDefault();
      toast.error("Your résumé must be smaller than 10 MB.");
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
      setForm({ name: "", email: "", company: "", message: "" });
      setPosition("");
      setResume(null);
      if (resumeInput.current) resumeInput.current.value = "";
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

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="border-t hairline bg-[var(--ink-2)]"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-5 py-24 sm:px-10 sm:py-32 lg:grid-cols-12">
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
                <strong className="font-semibold text-[var(--paper)]">
                  Ready to Jump Start Your Career?
                </strong>{" "}
                Join our{" "}
                <strong className="font-semibold text-[var(--paper)]">
                  Springboard Program
                </strong>{" "}
                and take the first step towards building your professional future
                in Canada&apos;s tech ecosystem.
              </>
            ) : (
              <>
                Tell us where you are. We&apos;ll reply within one business day with a
                candid read and a way forward — no obligation, no filler.
              </>
            )}
          </p>
          <div className="mt-12 w-40 opacity-70">
            <Nex3Logo animate={false} className="h-auto w-full" />
          </div>
        </div>

        <form
          onSubmit={submit}
          action={careers ? UPLOAD_ENDPOINT : undefined}
          method={careers ? "POST" : undefined}
          encType={careers ? "multipart/form-data" : undefined}
          target={careers ? "career-submission-frame" : undefined}
          data-testid="lead-form"
          className="flex flex-col gap-7 lg:col-span-6 lg:col-start-7"
        >
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
            <input
              data-testid="lead-name"
              name="name"
              className={field}
              placeholder="Name *"
              value={form.name}
              onChange={update("name")}
            />
            <input
              data-testid="lead-email"
              name="email"
              type="email"
              className={field}
              placeholder="Email *"
              value={form.email}
              onChange={update("email")}
            />
          </div>
          <input
            data-testid="lead-company"
            name={careers ? "linkedin" : "company"}
            className={field}
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
              <option value="" className="bg-[var(--ink-2)]">
                Position *
              </option>
              <option value="Internship" className="bg-[var(--ink-2)]">
                Internship
              </option>
              <option value="Full time" className="bg-[var(--ink-2)]">
                Full time
              </option>
            </select>
          )}
          <textarea
            data-testid="lead-message"
            name={careers ? "cover_letter" : "message"}
            className={`${field} min-h-[120px] resize-none`}
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
              <input
                type="hidden"
                name="_subject"
                value={`NEX3 application from ${form.name.trim() || "candidate"} — ${position || "position not selected"}`}
              />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_url" value="https://nex3.xyz/team" />
            </>
          )}
          <motion.button
            data-testid="lead-submit"
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="group relative mt-2 flex items-center justify-center overflow-hidden rounded-full bg-[var(--paper)] px-8 py-4 font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--ink)] disabled:cursor-wait disabled:opacity-60"
          >
            <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-[var(--ink)]">
              {loading ? (careers ? "Applying…" : "Sending…") : careers ? "Apply Now" : "Send it over"}
              <ArrowRight className="h-4 w-4" />
            </span>
            <span className="absolute inset-0 translate-y-full bg-[var(--acid)] transition-transform duration-300 group-hover:translate-y-0" />
          </motion.button>
        </form>
        {careers && (
          <iframe
            name="career-submission-frame"
            title="Career application submission"
            className="hidden"
            onLoad={finishCareerSubmission}
          />
        )}
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 border-t hairline px-5 py-8 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)] sm:flex-row sm:px-10">
        <span>NEX3 Inc. — Plan · Build · Hire</span>
        <span>© {new Date().getFullYear()} — The next-gen economy, decoded.</span>
      </div>
    </section>
  );
}
