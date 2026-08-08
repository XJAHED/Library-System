import { NavLink } from "react-router-dom";
import {
  BookOpen, Users, UserPlus, BookPlus, ArrowRightLeft, Undo2, History, DoorOpen, Mail, Inbox, LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const NAV = [
  { to: "/add-member", label: "Add Member", icon: UserPlus },
  { to: "/view-members", label: "View Members", icon: Users },
  { to: "/add-book", label: "Add Book", icon: BookPlus },
  { to: "/view-books", label: "View Books", icon: BookOpen },
  { to: "/issue-book", label: "Issue Book", icon: ArrowRightLeft },
  { to: "/return-book", label: "Return Book", icon: Undo2 },
  { to: "/history", label: "Book History", icon: History },
  { to: "/study-room", label: "Study Room", icon: DoorOpen },
  { to: "/compose-email", label: "Compose Email", icon: Mail },
  { to: "/email-history", label: "Email History", icon: Inbox },
];

export default function Sidebar({ open, onNavigate }) {
  const { currentAdmin, logout } = useAuth();

  return (
    <aside
      className={`lg:w-72 w-full lg:flex lg:flex-col lg:min-h-screen text-stone-300 ${open ? "block" : "hidden"}`}
      style={{ background: "linear-gradient(180deg, #0F1B2D 0%, #16273F 100%)" }}
    >
      <div className="hidden lg:flex items-center gap-3 px-7 py-8 border-b border-white/8">
        <div className="w-9 h-9 rounded-full border border-gold/50 flex items-center justify-center bg-gold/10">
          <BookOpen size={17} className="text-gold-light" />
        </div>
        <div>
          <div className="text-[17px] text-white leading-none" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
            Bookshelf
          </div>
          <div
            className="text-[10px] tracking-[0.25em] uppercase text-gold-light/70 mt-1"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Library System
          </div>
        </div>
      </div>

      <nav className="py-5 px-4 lg:flex-1 overflow-y-auto">
        <p
          className="px-3 mb-2 text-[10px] tracking-[0.2em] uppercase text-white/25"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Menu
        </p>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group w-full flex items-center gap-3 px-3.5 py-2.5 mb-1 rounded-lg text-[13.5px] text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gold-light/50 ${
                isActive
                  ? "bg-white/[0.06] text-white font-medium shadow-[inset_2px_0_0_0_#D9BA80]"
                  : "text-white/45 hover:bg-white/[0.04] hover:text-white/80"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? "text-gold-light" : "text-white/30 group-hover:text-white/60"} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-5 border-t border-white/8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold-light text-xs font-semibold">
            {(currentAdmin?.name || "A").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] text-white truncate">{currentAdmin?.name || "Admin"}</p>
            <p className="text-[11px] text-white/35 truncate">{currentAdmin?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 text-[12.5px] font-medium text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-light/50"
        >
          <LogOut size={13} /> Log Out
        </button>
      </div>
    </aside>
  );
}
