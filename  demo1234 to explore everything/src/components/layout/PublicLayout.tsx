import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../lib/auth";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export function PublicLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm transition ${isActive ? "text-[#00E676] bg-[#00E676]/5" : "text-white/70 hover:text-white"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <Link to={user.role === "admin" ? "/admin" : "/dashboard"}>
                <Button variant="brand">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login"><Button variant="outline">Login</Button></Link>
                <Link to="/register"><Button variant="brand">Get Started</Button></Link>
              </>
            )}
          </div>
          <button className="lg:hidden text-white" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="lg:hidden border-t border-[#262626] bg-[#0A0A0A]">
            <div className="px-4 py-3 flex flex-col gap-1">
              {nav.map((n) => (
                <NavLink key={n.to} to={n.to} end={n.to === "/"} className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm ${isActive ? "text-[#00E676] bg-[#00E676]/5" : "text-white/80"}`
                }>{n.label}</NavLink>
              ))}
              <div className="flex gap-2 pt-2">
                {user ? (
                  <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className="flex-1"><Button className="w-full">Dashboard</Button></Link>
                ) : (
                  <>
                    <Link to="/login" className="flex-1"><Button variant="outline" className="w-full">Login</Button></Link>
                    <Link to="/register" className="flex-1"><Button className="w-full">Sign Up</Button></Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#262626] bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Logo />
          <p className="text-sm text-white/50 mt-3 max-w-xs">
            Premium trading ecosystem combining signals, education, copy & bot trading, mentorship and managed investments.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/services" className="hover:text-[#00E676]">Services</Link></li>
            <li><Link to="/pricing" className="hover:text-[#00E676]">Pricing</Link></li>
            <li><Link to="/about" className="hover:text-[#00E676]">About</Link></li>
            <li><Link to="/contact" className="hover:text-[#00E676]">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/terms" className="hover:text-[#00E676]">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-[#00E676]">Privacy Policy</Link></li>
            <li><Link to="/risk" className="hover:text-[#00E676]">Risk Disclaimer</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Get Started</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/register" className="hover:text-[#00E676]">Create Account</Link></li>
            <li><Link to="/login" className="hover:text-[#00E676]">Login</Link></li>
            <li><Link to="/faq" className="hover:text-[#00E676]">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#262626] py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Enextrade Global Market. Trading involves risk. Past performance does not guarantee future results.
      </div>
    </footer>
  );
}
