import { BookOpen, Menu, X } from "lucide-react";

export default function Topbar({ open, onToggle }) {
  return (
    <div
      className="lg:hidden flex items-center justify-between text-stone-100 px-4 py-3.5"
      style={{ background: "linear-gradient(180deg, #0F1B2D 0%, #16273F 100%)" }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full border border-gold/50 flex items-center justify-center bg-gold/10">
          <BookOpen size={14} className="text-gold-light" />
        </div>
        <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>Bookshelf</span>
      </div>
      <button
        onClick={onToggle}
        aria-label="Toggle menu"
        className="p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-gold-light/60"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </div>
  );
}
