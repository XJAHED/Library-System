import { Check, AlertCircle, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";

export const inputCls =
  "w-full rounded-lg border border-ink/12 bg-white px-3.5 py-2.5 text-sm text-ink placeholder-ink/35 shadow-[inset_0_1px_2px_rgba(15,27,45,0.03)] focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors";

export function Stamp({ status }) {
  const styles = {
    Issued: "border-gold text-gold bg-gold/10",
    Returned: "border-sage text-sage bg-sage/10",
    Overdue: "border-rust text-rust bg-rust/10",
    Available: "border-sage text-sage bg-sage/10",
    Unavailable: "border-rust text-rust bg-rust/10",
    Booked: "border-gold text-gold bg-gold/10",
  };
  return (
    <span
      className={`inline-block -rotate-1 border rounded px-2.5 py-1 text-[10.5px] font-semibold tracking-widest uppercase ${styles[status] || "border-ink/20 text-ink/50 bg-ink/5"}`}
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {status}
    </span>
  );
}

export function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-8 animate-fade-in">
      <p
        className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gold mb-2"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {eyebrow}
      </p>
      <h2 className="text-[2rem] leading-tight text-ink" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
        {title}
      </h2>
      {subtitle && <p className="text-ink/50 mt-1.5 text-[13.5px]">{subtitle}</p>}
      <div className="mt-5 h-px w-full bg-gradient-to-r from-gold/50 via-ink/10 to-transparent" />
    </div>
  );
}

export function Field({ label, children, required }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-ink/70 mb-1.5 tracking-wide">
        {label}
        {required && <span className="text-rust ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-white border border-ink/8 shadow-[0_1px_2px_rgba(15,27,45,0.04),0_12px_28px_-12px_rgba(15,27,45,0.18)] animate-fade-in ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold via-gold-light to-gold" />
      {children}
    </div>
  );
}

export function EmptyState({ text }) {
  return (
    <div className="text-center py-16 text-ink/35 text-sm border-2 border-dashed border-ink/10 rounded-lg bg-paper/60">
      {text}
    </div>
  );
}

export function Msg({ value }) {
  if (!value) return null;
  const [kind, text] = value.split(":");
  return (
    <div
      className={`mb-5 text-sm rounded-lg px-3.5 py-2.5 border flex items-center gap-2 ${
        kind === "ok" ? "bg-sage/8 border-sage/30 text-sage" : "bg-rust/8 border-rust/30 text-rust"
      }`}
    >
      {kind === "ok" ? <Check size={15} /> : <AlertCircle size={15} />}
      {text}
    </div>
  );
}

export function Th({ children }) {
  return (
    <th className="text-left text-[10.5px] font-semibold uppercase tracking-widest text-ink/40 px-5 py-3.5 bg-paper border-b border-ink/8">
      {children}
    </th>
  );
}

export function Td({ children, mono }) {
  return (
    <td className="px-5 py-3.5 text-[13.5px] text-ink/85 border-b border-ink/5" style={mono ? { fontFamily: "'JetBrains Mono', monospace" } : {}}>
      {children}
    </td>
  );
}

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-ink/8 bg-paper/50">
      <p className="text-[11px] text-ink/40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-1.5">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md border border-ink/12 text-ink/60 bg-white hover:bg-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          <ChevronLeft size={13} /> Prev
        </button>
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md border border-ink/12 text-ink/60 bg-white hover:bg-paper disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          Next <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

export function Avatar({ src, alt }) {
  return (
    <div className="w-9 h-9 rounded-full overflow-hidden border border-ink/10 bg-paper flex items-center justify-center shrink-0">
      {src ? <img src={src} alt={alt || ""} className="w-full h-full object-cover" /> : <ImageIcon size={14} className="text-ink/20" />}
    </div>
  );
}

export function CoverThumb({ src, alt }) {
  return (
    <div className="w-9 h-12 rounded-md overflow-hidden border border-ink/10 bg-paper flex items-center justify-center shrink-0">
      {src ? <img src={src} alt={alt || ""} className="w-full h-full object-cover" /> : <ImageIcon size={14} className="text-ink/20" />}
    </div>
  );
}

export function ImageUpload({ label, value, onChange, shape = "square" }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <span className="block text-[13px] font-medium text-ink/70 mb-1.5 tracking-wide">{label}</span>
      <div className="flex items-center gap-4">
        <div
          className={`overflow-hidden border border-ink/12 bg-paper flex items-center justify-center ${
            shape === "circle" ? "w-16 h-16 rounded-full" : "w-16 h-20 rounded-lg"
          }`}
        >
          {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-ink/20" />}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="cursor-pointer text-xs font-semibold tracking-wide uppercase text-gold hover:text-gold-light border border-gold/40 hover:border-gold rounded-md px-3 py-1.5 transition-colors w-fit">
            Upload Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
          {value && (
            <button type="button" onClick={() => onChange("")} className="text-[11px] text-ink/35 hover:text-rust text-left">
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
