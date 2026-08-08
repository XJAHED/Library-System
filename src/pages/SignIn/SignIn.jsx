import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { inputCls } from "../../components/ui/UI.jsx";

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const result = login(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate("/add-member");
  };

  return (
    <div className="min-h-screen w-full flex">
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between px-14 py-14 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0F1B2D 0%, #1E3352 100%)" }}
      >
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 w-[420px] h-[420px] rounded-full opacity-[0.10] blur-3xl"
          style={{ background: "radial-gradient(circle, #D9BA80 0%, transparent 70%)" }}
        />
        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-full border border-gold/50 flex items-center justify-center bg-gold/10">
            <BookOpen size={18} className="text-gold-light" />
          </div>
          <span className="text-xl" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>Bookshelf</span>
        </div>
        <div className="relative">
          <p className="text-[11px] tracking-[0.25em] uppercase text-gold-light/70 mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Library Management System
          </p>
          <h1 className="text-4xl leading-tight max-w-md" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
            Catalogue, circulation and study spaces — in one admin desk.
          </h1>
        </div>
        <p className="text-white/30 text-xs relative" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Admin Access Only
        </p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-paper px-6 py-14">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div className="w-8 h-8 rounded-full border border-gold/50 flex items-center justify-center bg-gold/10">
              <BookOpen size={15} className="text-gold" />
            </div>
            <span className="text-lg text-ink" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>Bookshelf</span>
          </div>

          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gold mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Admin Login
          </p>
          <h2 className="text-3xl text-ink mb-8" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
            Welcome back
          </h2>

          {error && (
            <div className="mb-5 text-sm rounded-lg px-3.5 py-2.5 border bg-rust/8 border-rust/30 text-rust flex items-center gap-2">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="block text-[13px] font-medium text-ink/70 mb-1.5 tracking-wide">Email</span>
              <input required type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@library.edu" />
            </label>
            <label className="block">
              <span className="block text-[13px] font-medium text-ink/70 mb-1.5 tracking-wide">Password</span>
              <input required type="password" className={inputCls} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            </label>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold to-gold-light text-ink text-sm font-semibold tracking-wide px-6 py-2.5 rounded-lg shadow-[0_4px_14px_-4px_rgba(176,138,66,0.5)] hover:shadow-[0_6px_18px_-4px_rgba(176,138,66,0.6)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 transition-all duration-150"
            >
              Sign In
            </button>
          </form>

          <p className="text-sm text-ink/50 mt-8 text-center">
            Don't have an admin account?{" "}
            <Link to="/signup" className="text-gold font-medium hover:text-gold-light">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
