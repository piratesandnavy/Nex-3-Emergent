import { useEffect, useRef, useState } from "react";
import { ChevronDown, MessageCircle, Send, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Nex3Logo from "@/components/site/Nex3Logo";

const API = `${process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL || "https://nex-3-api.vercel.app"}/api/chat`;
const STORAGE_KEY = "nex3-chat-session-v1";
const FAQ_GREETING = "Hi! I’m here to answer questions about Nex3’s services, workshops, capabilities, and how we work.";
const MAX_MESSAGE_LENGTH = 1200;

const loadSession = () => {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (Array.isArray(parsed?.messages)) return parsed;
  } catch {}
  return { messages: [{ role: "assistant", content: FAQ_GREETING }], submission: null };
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
  const navigate = useNavigate();
  const location = useLocation();
  const initial = useRef(loadSession());
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
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, submission }));
  }, [messages, submission]);

  useEffect(() => {
    const handleSubmission = ({ detail }) => {
      const nextSubmission = {
        firstName: firstName(detail?.name || ""),
        email: (detail?.email || "").trim(),
        company: (detail?.company || "").trim(),
      };
      setSubmission(nextSubmission);
      setMessages((current) => [...current, { role: "assistant", content: confirmationMessage(detail || {}) }]);
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
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => () => requestRef.current?.abort(), []);

  const scrollToContact = () => {
    setOpen(false);
    if (location.pathname !== "/") navigate("/");
    window.setTimeout(() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }), location.pathname === "/" ? 0 : 450);
  };

  const submit = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setError("");
    setInput("");
    const userMessage = { role: "user", content: text.slice(0, MAX_MESSAGE_LENGTH) };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setLoading(true);
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-10), submissionContext: submission }),
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

  return (
    <aside className="nex3-chat" aria-label="Nex3 AI Assistant">
      {open && (
        <section ref={panel} className="nex3-chat-panel" role="dialog" aria-modal="true" aria-labelledby="nex3-chat-title">
          <header className="nex3-chat-header">
            <div className="flex min-w-0 items-center gap-3">
              <span className="nex3-chat-mark"><Nex3Logo animate={false} color="var(--ink)" className="w-full" /></span>
              <div className="min-w-0">
                <span className="nex3-chat-kicker">AI Desk · Online</span>
                <h2 id="nex3-chat-title" className="font-display">Nex3 Assistant</h2>
              </div>
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => setOpen(false)} aria-label="Minimize chat"><ChevronDown /></button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat"><X /></button>
            </div>
          </header>
          <div ref={historyRef} className="nex3-chat-history" role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`nex3-chat-message ${message.role}`}>{message.content}</div>
            ))}
            {loading && <div className="nex3-chat-message assistant nex3-chat-typing" aria-label="Assistant is typing"><i /><i /><i /></div>}
            {error && <div className="nex3-chat-error" role="alert">{error}</div>}
            {!submission && <button type="button" className="nex3-chat-contact" onClick={scrollToContact}>Go to inquiry form</button>}
          </div>
          <form className="nex3-chat-form" onSubmit={submit}>
            <label htmlFor="nex3-chat-input" className="sr-only">Message Nex3 AI Assistant</label>
            <input id="nex3-chat-input" ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} maxLength={MAX_MESSAGE_LENGTH} disabled={loading} placeholder="Ask a question…" autoComplete="off" />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send message"><Send /></button>
          </form>
          <p className="nex3-chat-privacy">AI responses may be imperfect. Don’t enter confidential or sensitive business information.</p>
        </section>
      )}
      {!open && <button type="button" className="nex3-chat-launcher" onClick={() => setOpen(true)} aria-label="Chat with AI"><span className="nex3-chat-live" aria-hidden="true" /><span>Ask Nex3</span><MessageCircle /></button>}
    </aside>
  );
}
