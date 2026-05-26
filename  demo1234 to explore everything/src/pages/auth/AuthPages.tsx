import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../components/ui/Logo";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../lib/auth";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";

function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#0A0A0A]">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8"><Logo /></div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-white/60 text-sm mt-1">{subtitle}</p>}
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-sm text-white/60">{footer}</div>}
        </div>
      </div>
      <div className="hidden lg:flex flex-1 relative overflow-hidden border-l border-[#262626]">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A0A0A] via-transparent to-[#00E676]/10" />
        <div className="relative m-auto max-w-md p-10">
          <div className="text-3xl font-bold leading-tight">
            Join the <span className="gradient-text">Enextrade Global Market</span> ecosystem.
          </div>
          <p className="text-white/60 mt-4">Signals, education, copy & bot trading, mentorship and managed investments — all in one professional dashboard.</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { k: "12.4k", v: "Traders" },
              { k: "78%", v: "Win-rate" },
              { k: "6%", v: "Monthly ROI" },
            ].map((s) => (
              <div key={s.v} className="card p-4 text-center">
                <div className="text-xl font-bold text-[#00E676]">{s.k}</div>
                <div className="text-xs text-white/50">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const r = await login(email, password);
    setLoading(false);
    if (!r.ok) setErr(r.error || "Login failed.");
    else {
      // route based on role
      const isAdmin = email.toLowerCase() === "admin@enextrade.com";
      navigate(isAdmin ? "/admin" : "/dashboard");
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Login to your trading dashboard."
      footer={<>Don't have an account? <Link to="/register" className="text-[#00E676]">Create one</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        {err && <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg"><AlertCircle className="w-4 h-4" /> {err}</div>}
        <div>
          <label className="text-xs text-white/60">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-base mt-1" placeholder="you@example.com" />
        </div>
        <div>
          <label className="text-xs text-white/60">Password</label>
          <div className="relative">
            <input type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="input-base mt-1 pr-10" placeholder="••••••••" />
            <button type="button" className="absolute right-3 top-3.5 text-white/50" onClick={() => setShow((s) => !s)}>
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <label className="flex items-center gap-2 text-white/60"><input type="checkbox" className="accent-[#00E676]" /> Remember me</label>
          <Link to="/forgot" className="text-[#00E676]">Forgot password?</Link>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}</Button>
        <div className="text-xs text-white/40 text-center pt-2 border-t border-[#262626] mt-4">
          Demo: <code className="text-[#00E676]">demo@enextrade.com</code> / <code className="text-[#00E676]">demo1234</code> · Admin: <code className="text-[#00E676]">admin@enextrade.com</code> / <code className="text-[#00E676]">admin123</code>
        </div>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const r = await register(name, email, password);
    setLoading(false);
    if (!r.ok) setErr(r.error || "Could not register.");
    else navigate("/dashboard");
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free to join. Subscribe to services as you go."
      footer={<>Already have an account? <Link to="/login" className="text-[#00E676]">Sign in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        {err && <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg"><AlertCircle className="w-4 h-4" /> {err}</div>}
        <div>
          <label className="text-xs text-white/60">Full name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input-base mt-1" />
        </div>
        <div>
          <label className="text-xs text-white/60">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-base mt-1" />
        </div>
        <div>
          <label className="text-xs text-white/60">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-base mt-1" placeholder="At least 6 characters" />
        </div>
        <label className="flex items-start gap-2 text-xs text-white/60">
          <input type="checkbox" required className="accent-[#00E676] mt-0.5" />
          <span>I agree to the <Link to="/terms" className="text-[#00E676]">Terms</Link>, <Link to="/privacy" className="text-[#00E676]">Privacy</Link>, and <Link to="/risk" className="text-[#00E676]">Risk Disclaimer</Link>.</span>
        </label>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}</Button>
      </form>
    </AuthShell>
  );
}

export function Forgot() {
  const { forgot } = useAuth();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setMsg(null);
    setLoading(true);
    const r = await forgot(email);
    setLoading(false);
    if (!r.ok) setErr(r.error || "Failed");
    else setMsg("If an account exists, a reset link has been sent.");
  };

  return (
    <AuthShell
      title="Reset password"
      subtitle="Enter your account email."
      footer={<Link to="/login" className="text-[#00E676]">Back to login</Link>}
    >
      <form onSubmit={submit} className="space-y-4">
        {msg && <div className="flex items-center gap-2 text-[#00E676] text-sm bg-[#00E676]/10 border border-[#00E676]/30 px-3 py-2 rounded-lg"><CheckCircle2 className="w-4 h-4" /> {msg}</div>}
        {err && <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg"><AlertCircle className="w-4 h-4" /> {err}</div>}
        <div>
          <label className="text-xs text-white/60">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-base mt-1" />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? "Sending..." : "Send reset link"}</Button>
      </form>
    </AuthShell>
  );
}
