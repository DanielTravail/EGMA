import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../ui/Logo";
import { useAuth } from "../../lib/auth";
import { SERVICES } from "../../lib/services";
import { Bell, ChevronDown, LayoutDashboard, LogOut, Menu, Settings, Sparkles, X, CreditCard, Shield } from "lucide-react";
import * as Lucide from "lucide-react";
import { db } from "../../lib/store";

export function DashboardLayout({ admin = false }: { admin?: boolean }) {
  const { user, logout, hasService } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); setProfileOpen(false); setNotifOpen(false); }, [loc.pathname]);

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
    else if (admin && user.role !== "admin") navigate("/dashboard", { replace: true });
  }, [user, admin, navigate]);

  const notifications = useMemo(() => {
    if (!user) return [];
    const d = db.get();
    return d.notifications.filter((n) => n.userId === user.id || n.userId === "all").slice(0, 8);
  }, [user, loc.pathname, notifOpen]);

  const subscribedServices = useMemo(() => SERVICES.filter((s) => hasService(s.key)), [user, loc.pathname]);
  const lockedServices = useMemo(() => SERVICES.filter((s) => !hasService(s.key)), [user, loc.pathname]);

  if (!user) return null;

  const userLinks = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
    ...subscribedServices.map((s) => ({ to: s.path, label: s.name, icon: (Lucide as any)[s.icon] || Sparkles, end: false })),
    { to: "/dashboard/subscription", label: "Subscriptions", icon: CreditCard, end: false },
    { to: "/dashboard/notifications", label: "Notifications", icon: Bell, end: false },
    { to: "/dashboard/settings", label: "Settings", icon: Settings, end: false },
  ];

  const adminLinks = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/admin/users", label: "Users", icon: Lucide.Users, end: false },
    { to: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard, end: false },
    { to: "/admin/payments", label: "Payment Center", icon: Lucide.BadgeDollarSign, end: false },
    { to: "/admin/signals", label: "Signals", icon: Lucide.Radio, end: false },
    { to: "/admin/academy", label: "Academy", icon: Lucide.GraduationCap, end: false },
    { to: "/admin/investments", label: "Investments", icon: Lucide.Wallet, end: false },
    { to: "/admin/broadcasts", label: "Broadcasts", icon: Lucide.Megaphone, end: false },
    { to: "/admin/tickets", label: "Support", icon: Lucide.LifeBuoy, end: false },
    { to: "/admin/audit", label: "Audit Logs", icon: Lucide.ShieldCheck, end: false },
    { to: "/admin/settings", label: "Platform Settings", icon: Settings, end: false },
  ];

  const links = admin ? adminLinks : userLinks;

  return (
    <div className="min-h-screen flex bg-[#0A0A0A]">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-[#0F0F0F] border-r border-[#262626] flex-shrink-0 transform transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#262626]">
          <Logo to={admin ? "/admin" : "/dashboard"} />
          <button className="lg:hidden text-white/70" onClick={() => setSidebarOpen(false)}><X /></button>
        </div>
        <div className="px-3 py-4 overflow-y-auto h-[calc(100vh-4rem)]">
          {admin && (
            <div className="px-3 mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
              <Shield className="w-3.5 h-3.5" /> Admin Console
            </div>
          )}
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                    isActive ? "bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20" : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
                  }`
                }
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </NavLink>
            ))}
          </nav>

          {!admin && lockedServices.length > 0 && (
            <div className="mt-6">
              <div className="px-3 mb-2 text-xs uppercase tracking-wider text-white/40">Discover</div>
              <div className="flex flex-col gap-1">
                {lockedServices.map((s) => {
                  const Icon = (Lucide as any)[s.icon] || Sparkles;
                  return (
                    <Link
                      key={s.key}
                      to={`/pricing#${s.key}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 border border-transparent group"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1">{s.name}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[#00E676] opacity-0 group-hover:opacity-100">Unlock</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[#262626]">
          <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}><Menu /></button>
            <div className="hidden md:flex items-center gap-2 text-sm text-white/50">
              <span>{admin ? "Admin" : "Dashboard"}</span>
              <span>/</span>
              <span className="text-white capitalize">{loc.pathname.split("/").filter(Boolean).slice(1).join(" / ") || "Overview"}</span>
            </div>
            <div className="flex-1 lg:hidden" />
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setNotifOpen((o) => !o)} className="relative p-2 rounded-lg hover:bg-white/5">
                  <Bell className="w-5 h-5 text-white/80" />
                  {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#00E676]" />}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#161616] border border-[#262626] rounded-xl shadow-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#262626] flex items-center justify-between">
                      <span className="text-sm font-semibold">Notifications</span>
                      <Link to="/dashboard/notifications" className="text-xs text-[#00E676]">View all</Link>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 && <div className="p-6 text-center text-sm text-white/50">No notifications yet.</div>}
                      {notifications.map((n) => (
                        <div key={n.id} className="px-4 py-3 border-b border-[#262626] hover:bg-white/5">
                          <div className="text-sm font-medium text-white">{n.title}</div>
                          <div className="text-xs text-white/60 mt-0.5">{n.message}</div>
                          <div className="text-[10px] text-white/40 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Profile */}
              <div className="relative">
                <button onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-white/5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E676] to-[#00B85F] text-[#0A0A0A] font-bold flex items-center justify-center text-sm">
                    {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm text-white leading-tight">{user.name}</div>
                    <div className="text-[10px] text-white/50 leading-tight uppercase tracking-wider">{user.role}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-white/50" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#161616] border border-[#262626] rounded-xl shadow-2xl overflow-hidden">
                    <Link to="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    {user.role === "admin" && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5">
                        <Shield className="w-4 h-4" /> Admin Console
                      </Link>
                    )}
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <button onClick={() => { logout(); navigate("/login"); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 border-t border-[#262626]">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1500px] w-full mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
