import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { db, uid } from "./store";
import type { ServiceKey, User } from "./types";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  forgot: (email: string) => Promise<{ ok: boolean; error?: string }>;
  refresh: () => void;
  hasService: (service: ServiceKey) => boolean;
  servicePlan: (service: ServiceKey) => string | null;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    const data = db.get();
    if (data.session?.userId) {
      const u = data.users.find((x) => x.id === data.session!.userId) || null;
      setUser(u);
    } else {
      setUser(null);
    }
    setLoading(false);

    const onUpdate = () => {
      const d = db.get();
      if (d.session?.userId) setUser(d.users.find((x) => x.id === d.session!.userId) || null);
      else setUser(null);
    };
    window.addEventListener("enextrade:update", onUpdate);
    return () => window.removeEventListener("enextrade:update", onUpdate);
  }, [tick]);

  const login: AuthCtx["login"] = async (email, password) => {
    await new Promise((r) => setTimeout(r, 350));
    const d = db.get();
    const u = d.users.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (!u) return { ok: false, error: "Invalid email or password." };
    d.session = { userId: u.id };
    db.set(d);
    return { ok: true };
  };

  const register: AuthCtx["register"] = async (name, email, password) => {
    await new Promise((r) => setTimeout(r, 400));
    const d = db.get();
    if (d.users.some((x) => x.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    const u: User = {
      id: uid("u"),
      name: name.trim(),
      email: email.trim(),
      password,
      role: "user",
      verified: true, // mock: auto-verified
      createdAt: new Date().toISOString(),
    };
    d.users.push(u);
    d.session = { userId: u.id };
    d.notifications.unshift({
      id: uid("n"),
      userId: u.id,
      title: "Welcome to Enextrade Global Market",
      message: "Explore our services and activate your first subscription.",
      type: "success",
      createdAt: new Date().toISOString(),
    });
    db.set(d);
    return { ok: true };
  };

  const logout = () => {
    const d = db.get();
    d.session = undefined;
    db.set(d);
  };

  const forgot: AuthCtx["forgot"] = async (email) => {
    await new Promise((r) => setTimeout(r, 500));
    const d = db.get();
    const u = d.users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u) return { ok: false, error: "No account found with this email." };
    return { ok: true };
  };

  const hasService = (service: ServiceKey) => {
    if (!user) return false;
    const d = db.get();
    return d.subscriptions.some(
      (s) => s.userId === user.id && s.service === service && s.status === "active",
    );
  };

  const servicePlan = (service: ServiceKey) => {
    if (!user) return null;
    const d = db.get();
    const sub = d.subscriptions.find(
      (s) => s.userId === user.id && s.service === service && s.status === "active",
    );
    return sub ? sub.plan : null;
  };

  const value = useMemo<AuthCtx>(
    () => ({ user, loading, login, register, logout, forgot, refresh, hasService, servicePlan }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading, tick],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
