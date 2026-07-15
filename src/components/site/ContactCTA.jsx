import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import Nex3Logo from "@/components/site/Nex3Logo";

const CONTACT_EMAIL = "nex3info@gmail.com";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

export default function ContactCTA() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim() || "Not provided",
          message: form.message.trim() || "No message provided.",
          _subject: `NEX3 website enquiry from ${form.name.trim()}`,
          _template: "table",
          _captcha: "false",
        }),
      });

      if (!response.ok) throw new Error("Form submission failed");

      toast.success("Message sent. We'll be in touch within one business day.");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch (error) {
      toast.error("Your message could not be sent. Please try again.");
    } finally {
      setLoading(false);
    }
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
            Book a Call
          </span>
          <h2 className="font-display mt-5 text-3xl leading-[1.05] tracking-tight sm:text-5xl">
            Let&apos;s make your next three decisions the right ones.
          </h2>
          <p className="mt-5 max-w-md text-base text-[var(--muted)] sm:text-lg">
            Tell us where you are. We&apos;ll reply within one business day with a
            candid read and a way forward — no obligation, no filler.
          </p>
          <div className="mt-12 w-40 opacity-70">
            <Nex3Logo animate={false} className="h-auto w-full" />
          </div>
        </div>

        <form
          onSubmit={submit}
          data-testid="lead-form"
          className="flex flex-col gap-7 lg:col-span-6 lg:col-start-7"
        >
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
            <input
              data-testid="lead-name"
              className={field}
              placeholder="Name *"
              value={form.name}
              onChange={update("name")}
            />
            <input
              data-testid="lead-email"
              type="email"
              className={field}
              placeholder="Email *"
              value={form.email}
              onChange={update("email")}
            />
          </div>
          <input
            data-testid="lead-company"
            className={field}
            placeholder="Company / project"
            value={form.company}
            onChange={update("company")}
          />
          <textarea
            data-testid="lead-message"
            className={`${field} min-h-[120px] resize-none`}
            placeholder="What are you deciding right now?"
            value={form.message}
            onChange={update("message")}
          />
          <motion.button
            data-testid="lead-submit"
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="group relative mt-2 flex items-center justify-center overflow-hidden rounded-full bg-[var(--paper)] px-8 py-4 font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--ink)] disabled:cursor-wait disabled:opacity-60"
          >
            <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-[var(--ink)]">
              {loading ? "Sending…" : "Send it over"}
              <ArrowRight className="h-4 w-4" />
            </span>
            <span className="absolute inset-0 translate-y-full bg-[var(--acid)] transition-transform duration-300 group-hover:translate-y-0" />
          </motion.button>
        </form>
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 border-t hairline px-5 py-8 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)] sm:flex-row sm:px-10">
        <span>NEX3 Inc. — Plan · Build · Hire</span>
        <span>© {new Date().getFullYear()} — The next-gen economy, decoded.</span>
      </div>
    </section>
  );
}
