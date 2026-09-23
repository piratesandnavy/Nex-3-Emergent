export default function AuditButton({ onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-full bg-[var(--paper)] px-7 py-3.5 font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--ink)] transition-all duration-300 hover:shadow-lg ${className}`}
    >
      <span className="relative z-10">Get Your Free AI Audit</span>
      <span className="absolute inset-0 translate-y-full bg-[var(--acid)] transition-transform duration-300 group-hover:translate-y-0" />
    </button>
  );
}
