import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const ADMINS_KEY = "lms_admins";
const SESSION_KEY = "lms_session";

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export function AuthProvider({ children }) {
  const [admins, setAdmins] = useState(() => readJSON(ADMINS_KEY, []));
  const [currentAdmin, setCurrentAdmin] = useState(() => readJSON(SESSION_KEY, null));

  const persistAdmins = (list) => {
    setAdmins(list);
    localStorage.setItem(ADMINS_KEY, JSON.stringify(list));
  };

  const persistSession = (admin) => {
    setCurrentAdmin(admin);
    if (admin) localStorage.setItem(SESSION_KEY, JSON.stringify(admin));
    else localStorage.removeItem(SESSION_KEY);
  };

  const signup = ({ name, email, password }) => {
    if (admins.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, message: "An admin account with this email already exists." };
    }
    const admin = { id: Date.now(), name, email, password };
    persistAdmins([...admins, admin]);
    persistSession({ id: admin.id, name: admin.name, email: admin.email });
    return { ok: true };
  };

  const login = ({ email, password }) => {
    const found = admins.find((a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
    if (!found) return { ok: false, message: "Invalid email or password." };
    persistSession({ id: found.id, name: found.name, email: found.email });
    return { ok: true };
  };

  const logout = () => persistSession(null);

  return (
    <AuthContext.Provider value={{ currentAdmin, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
