import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { db } from "../../lib/store";
import { Users, DollarSign, BadgeCheck, Radio } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export default function AdminOverview() {
  const d = db.get();
  const users = d.users.length;
  const subs = d.subscriptions.filter((s) => s.status === "active").length;
  const pending = d.transactions.filter((t) => t.status === "pending").length;
  const revenue = d.transactions.filter((t) => t.status === "approved").reduce((s, t) => s + t.amount, 0);

  const revData = Array.from({ length: 12 }, (_, i) => ({ m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], v: 1200 + Math.round(Math.random() * 4000) }));
  const userGrowth = Array.from({ length: 14 }, (_, i) => ({ d: i, v: 200 + i * 22 + Math.round(Math.random() * 15) }));
  const serviceMix = [
    { name: "Signals", value: d.subscriptions.filter((s) => s.service === "signals").length || 1 },
    { name: "Academy", value: d.subscriptions.filter((s) => s.service === "academy").length || 1 },
    { name: "Copy", value: d.subscriptions.filter((s) => s.service === "copy-trading").length || 1 },
    { name: "Bots", value: d.subscriptions.filter((s) => s.service === "bot-trading").length || 1 },
    { name: "Invest", value: d.subscriptions.filter((s) => s.service === "investments").length || 1 },
    { name: "Mentor", value: d.subscriptions.filter((s) => s.service === "mentorship").length || 1 },
  ];
  const COLORS = ["#00E676", "#22d3ee", "#a78bfa", "#f59e0b", "#ec4899", "#3b82f6"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <p className="text-white/60 text-sm">Live platform analytics</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={Users} label="Total users" value={String(users)} />
        <KPI icon={BadgeCheck} label="Active subscriptions" value={String(subs)} />
        <KPI icon={DollarSign} label="Revenue (approved)" value={`$${revenue.toLocaleString()}`} />
        <KPI icon={Radio} label="Pending payments" value={String(pending)} tone={pending > 0 ? "warning" : "neutral"} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue (last 12 months)" action={<Badge variant="brand">+24% YoY</Badge>} />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1d1d1d" />
                  <XAxis dataKey="m" stroke="#666" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0A0A0A", border: "1px solid #262626", borderRadius: 10 }} />
                  <Bar dataKey="v" fill="#00E676" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Service mix" />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={serviceMix} dataKey="value" innerRadius={50} outerRadius={85} paddingAngle={2}>
                    {serviceMix.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0A0A0A", border: "1px solid #262626", borderRadius: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs mt-2">
              {serviceMix.map((s, i) => (
                <div key={s.name} className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} /> {s.name}</div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="User growth" />
        <CardBody>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth}>
                <defs>
                  <linearGradient id="gu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00E676" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#00E676" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d1d1d" />
                <Tooltip contentStyle={{ background: "#0A0A0A", border: "1px solid #262626", borderRadius: 10 }} />
                <Area type="monotone" dataKey="v" stroke="#00E676" strokeWidth={2.5} fill="url(#gu)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function KPI({ icon: Icon, label, value, tone = "neutral" }: { icon: any; label: string; value: string; tone?: "neutral" | "warning" }) {
  return (
    <Card><CardBody>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-white/50">{label}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tone === "warning" ? "bg-amber-500/10 text-amber-400" : "bg-[#00E676]/10 text-[#00E676]"}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </CardBody></Card>
  );
}
