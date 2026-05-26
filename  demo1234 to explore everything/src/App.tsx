import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";

import { PublicLayout } from "./components/layout/PublicLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Public pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Services from "./pages/public/Services";
import Pricing from "./pages/public/Pricing";
import FAQ from "./pages/public/FAQ";
import Contact from "./pages/public/Contact";
import { Terms, Privacy, Risk } from "./pages/public/Legal";

// Auth
import { Login, Register, Forgot } from "./pages/auth/AuthPages";

// Dashboard (user)
import DashboardOverview from "./pages/dashboard/Overview";
import Signals from "./pages/dashboard/Signals";
import Academy from "./pages/dashboard/Academy";
import CopyTrading from "./pages/dashboard/CopyTrading";
import BotTrading from "./pages/dashboard/BotTrading";
import Investments from "./pages/dashboard/Investments";
import Mentorship from "./pages/dashboard/Mentorship";
import Subscription from "./pages/dashboard/Subscription";
import Notifications from "./pages/dashboard/Notifications";
import Settings from "./pages/dashboard/Settings";

// Admin
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSignals from "./pages/admin/AdminSignals";
import {
  AdminSubscriptions,
  AdminBroadcasts,
  AdminTickets,
  AdminAudit,
  AdminAcademy,
  AdminInvestments,
  AdminSettings,
} from "./pages/admin/AdminMisc";

function ProtectedRoute({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-white/60">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/risk" element={<Risk />} />
          </Route>

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />

          {/* DASHBOARD (user) */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/dashboard/signals" element={<Signals />} />
            <Route path="/dashboard/academy" element={<Academy />} />
            <Route path="/dashboard/copy-trading" element={<CopyTrading />} />
            <Route path="/dashboard/bot-trading" element={<BotTrading />} />
            <Route path="/dashboard/investments" element={<Investments />} />
            <Route path="/dashboard/mentorship" element={<Mentorship />} />
            <Route path="/dashboard/subscription" element={<Subscription />} />
            <Route path="/dashboard/notifications" element={<Notifications />} />
            <Route path="/dashboard/settings" element={<Settings />} />
          </Route>

          {/* ADMIN */}
          <Route element={<ProtectedRoute admin><DashboardLayout admin /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/signals" element={<AdminSignals />} />
            <Route path="/admin/academy" element={<AdminAcademy />} />
            <Route path="/admin/investments" element={<AdminInvestments />} />
            <Route path="/admin/broadcasts" element={<AdminBroadcasts />} />
            <Route path="/admin/tickets" element={<AdminTickets />} />
            <Route path="/admin/audit" element={<AdminAudit />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
