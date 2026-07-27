import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Building2,
  ChartNoAxesCombined,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  MessageCircle,
  Paperclip,
  Puzzle,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import Nex3Logo from "@/components/site/Nex3Logo";

const API = `${process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL || "https://nex-3-api.vercel.app"}/api/chat`;
const FAQ_STORAGE_KEY = "nex3-faq-chat-v3";
const POST_STORAGE_KEY = "nex3-post-chat-v2";
const SUBMISSION_STORAGE_KEY = "nex3-submission-v2";
const FAQ_GREETING = "Hi! I’m here to answer questions about Nex3’s services, workshops, capabilities, and how we work.";
const MAX_MESSAGE_LENGTH = 1200;
const TOPICS = [
  {
    label: "What is an AI agent?",
    Icon: Bot,
    answer:
      "An AI agent is a software system that can understand a goal, reason through the steps needed, and take useful actions with limited supervision. Nex3 helps teams identify practical agent use cases, design the right workflows, and build systems that fit the way their business actually operates.",
  },
  {
    label: "How much does it cost for an organization?",
    Icon: CircleDollarSign,
    answer:
      "The cost for an organization depends on the scope, complexity, team size, and stage of the work. After a short discovery conversation, Nex3 recommends a focused engagement with clear deliverables, timing, and cost—so your organization knows exactly what it is investing in before work begins.",
  },
  {
    label: "How to audit your AI budget?",
    Icon: ChartNoAxesCombined,
    answer:
      "Start by mapping every AI tool, model, vendor, experiment, and internal project to its owner, monthly cost, usage, business outcome, and risk. Nex3 can help identify duplicated spend, underused tools, hidden implementation costs, and high-value investments, then turn the findings into a practical AI budget and governance plan.",
    cta: {
      label: "Audit your AI budget",
      href: "https://www.nex3.xyz/audit",
    },
  },
  {
    label: "Typical timelines",
    Icon: Clock3,
    answer:
      "Most focused advisory and workshop engagements take days or a few weeks. Larger product, architecture, and implementation projects may run longer. Nex3 defines the milestones up front and keeps the work oriented around decisions and tangible outcomes.",
  },
  {
    label: "What services do you offer?",
    Icon: Puzzle,
    answer:
      "Nex3 helps leaders plan, build, and hire for the AI and Web3 economy. That includes strategy, market and product validation, technical architecture, AI agent design, token and go-to-market work, workshops, and support finding the operators and specialists needed to execute.",
  },
  {
    label: "Which industries can use Nex3 services?",
    Icon: Building2,
    answer:
      "Nex3 services can support organizations across financial services, education, professional services, hospitality, retail, technology, nonprofits, and other sectors. The work is industry-aware but begins with the specific business problem, decision, or goal your organization needs to address.",
  },
];

const loadStored = (key, fallback) => {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(key));
    return parsed ?? fallback;
  } catch {}
  return fallback;
};

const firstName = (name) => name.trim().split(/\s+/)[0] || "";

function confirmationMessage({ name = "", company = "" }) {
  const person = firstName(name);
  const project = company.trim();
  const thanks = person ? `Thanks for reaching out, ${person}! 🎯` : "Thanks for reaching out! 🎯";
  const subject = project ? `your inquiry about ${project}` : "your inquiry";
  return `${thanks}\n\nI’ve received ${subject}. We’ll review what you’re working on and get back to you within 1–2 business days.\n\nIn the meantime, feel free to ask me anything about our services, workshops, or how we typically work with clients.`;
}

export default function Chatbot() {
  const initial = useRef(null);
  if (!initial.current) {
    const storedSubmission = loadStored(SUBMISSION_STORAGE_KEY, null);
    initial.current = {
      mode: "faq",
      submission: storedSubmission,
      messages: loadStored(FAQ_STORAGE_KEY, [{ role: "assistant", content: FAQ_GREETING }]),
    };
  }
  const [mode, setMode] = useState(initial.current.mode);
  const [messages, setMessages] = useState(initial.current.messages);
  const [submission, setSubmission] = useState(initial.current.submission);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const panel = useRef(null);
  const inputRef = useRef(null);
  const historyRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem(mode === "post" ? POST_STORAGE_KEY : FAQ_STORAGE_KEY, JSON.stringify(messages));
    if (submission) sessionStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(submission));
  }, [messages, mode, submission]);

  useEffect(() => {
    const handleSubmission = ({ detail }) => {
      const nextSubmission = {
        firstName: firstName(detail?.name || ""),
        email: (detail?.email || "").trim(),
        company: (detail?.company || "").trim(),
      };
      const postGreeting = { role: "assistant", content: confirmationMessage(detail || {}) };
      sessionStorage.setItem(POST_STORAGE_KEY, JSON.stringify([postGreeting]));
      sessionStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(nextSubmission));
      setSubmission(nextSubmission);
      setMode("post");
      setMessages([postGreeting]);
      setOpen(true);
    };
    window.addEventListener("nex3:inquiry-submitted", handleSubmission);
    return () => window.removeEventListener("nex3:inquiry-submitted", handleSubmission);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !panel.current) return;
      const focusable = [...panel.current.querySelectorAll("button:not(:disabled), input:not(:disabled), a[href]")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  useEffect(() => {
    const history = historyRef.current;
    if (!history) return;
    if (messages.length === 1 && !loading) {
      history.scrollTo({ top: 0 });
      return;
    }
    history.scrollTo({ top: history.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => () => requestRef.current?.abort(), []);

  const sendMessage = async (value) => {
    const text = value.trim();
    if (!text || loading) return;
    setError("");
    setInput("");
    const userMessage = { role: "user", content: text.slice(0, MAX_MESSAGE_LENGTH) };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setLoading(true);
    const topic = TOPICS.find(({ label }) => label.toLowerCase() === text.toLowerCase());
    if (topic?.answer) {
      window.setTimeout(() => {
        setMessages((current) => [
          ...current,
          { role: "assistant", content: topic.answer, cta: topic.cta || null },
        ]);
        setLoading(false);
      }, 550);
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-10),
          submissionContext: mode === "post" ? submission : null,
        }),
        signal: controller.signal,
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || typeof body.reply !== "string") throw new Error(body.error || "Assistant unavailable");
      setMessages((current) => [...current, { role: "assistant", content: body.reply }]);
    } catch (requestError) {
      if (requestError.name !== "AbortError") setError(requestError.message || "The assistant is temporarily unavailable. Please try again.");
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
      setLoading(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  const openFaqWindow = () => {
    setMode("faq");
    setMessages(loadStored(FAQ_STORAGE_KEY, [{ role: "assistant", content: FAQ_GREETING }]));
    setError("");
    setOpen(true);
  };

  return (
    <aside className="nex3-chat" aria-label="Nex3 AI Assistant">
      <AnimatePresence>
        {open && (
        <motion.section
          ref={panel}
          className="nex3-chat-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="nex3-chat-title"
          initial={{ opacity: 0, scale: 0.9, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 18 }}
          transition={{ type: "spring", stiffness: 330, damping: 28, mass: 0.8 }}
        >
          <header className="nex3-chat-header">
            <div className="flex min-w-0 items-center gap-3">
              <span className="nex3-chat-mark">
                <Nex3Logo animate={false} className="nex3-chat-wordmark" />
                <span>INC.</span>
              </span>
              <div className="min-w-0">
                <span className="nex3-chat-kicker">{mode === "post" ? "Inquiry Desk · Received" : "AI Desk · Online"}</span>
                <h2 id="nex3-chat-title" className="font-display">{mode === "post" ? "Inquiry Assistant" : "Nex3 Assistant"}</h2>
              </div>
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat"><X /></button>
            </div>
          </header>
          <div ref={historyRef} className="nex3-chat-history" role="log" aria-live="polite" aria-relevant="additions" data-lenis-prevent>
            <div className="nex3-chat-messages">
              {messages.map((message, index) => message.role === "assistant" && index === 0 ? (
                <div key={`${message.role}-${index}`} className="nex3-chat-welcome">
                  <span className="nex3-chat-welcome-icon"><MessageCircle aria-hidden="true" /></span>
                  <div>
                    <span className="nex3-chat-speaker">{mode === "post" ? "Inquiry Assistant" : "Nex3 Assistant"}</span>
                    <p>{message.content}</p>
                  </div>
                </div>
              ) : (
                <div key={`${message.role}-${index}`}>
                  <div className={`nex3-chat-message ${message.role}`}>{message.content}</div>
                  {message.cta && (
                    <a
                      className="nex3-audit-cta"
                      href={message.cta.href}
                      aria-label={message.cta.label}
                    >
                      <span className="nex3-audit-cta-prompt" aria-hidden="true">&gt;_</span>
                      <span className="nex3-audit-cta-label">{message.cta.label}</span>
                      <span className="nex3-audit-cta-arrow" aria-hidden="true"><ArrowRight /></span>
                    </a>
                  )}
                </div>
              ))}
              {loading && <div className="nex3-chat-message assistant nex3-chat-typing" aria-label="Assistant is typing"><i /><i /><i /></div>}
              {error && <div className="nex3-chat-error" role="alert">{error}</div>}
            </div>
            {mode === "faq" && messages.length === 1 && (
              <section className="nex3-chat-topics" aria-labelledby="nex3-topic-title">
                <h3 id="nex3-topic-title">Popular topics</h3>
                <div className="nex3-chat-topic-grid">
                  {TOPICS.map(({ label, Icon }) => (
                    <button type="button" key={label} onClick={() => sendMessage(label)} disabled={loading}>
                      <Icon aria-hidden="true" /><span>{label}</span><ChevronRight aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
          <form className="nex3-chat-form" onSubmit={submit}>
            <label htmlFor="nex3-chat-input" className="sr-only">{mode === "post" ? "Message the Nex3 inquiry assistant" : "Message the Nex3 AI assistant"}</label>
            <input id="nex3-chat-input" ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} maxLength={MAX_MESSAGE_LENGTH} disabled={loading} placeholder={mode === "post" ? "Ask about your inquiry…" : "Ask a question…"} autoComplete="off" />
            <button type="button" className="nex3-chat-attach" aria-label="File attachments are not available" title="File attachments are not available" disabled><Paperclip /></button>
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send message"><Send /></button>
          </form>
          <p className="nex3-chat-privacy"><ShieldCheck aria-hidden="true" />AI responses may be imperfect. Don’t enter confidential or sensitive business information.</p>
        </motion.section>
        )}
      </AnimatePresence>
      {!open && (
        <button type="button" className="nex3-chat-launcher" onClick={openFaqWindow} aria-label="Chat with AI"><span className="nex3-chat-live" aria-hidden="true" /><span>Ask Nex3</span><MessageCircle /></button>
      )}
    </aside>
  );
}
