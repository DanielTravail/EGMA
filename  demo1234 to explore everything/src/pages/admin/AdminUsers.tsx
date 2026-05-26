import { useMemo, useState } from "react";
import { Card, CardBody } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { db, uid } from "../../lib/store";
import { Search, Trash2 } from "lucide-react";
import type { ServiceKey } from "../../lib/types";
import { activateSubscription } from "../dashboard/Subscription";
import { SERVICES } from "../../lib/services";
import { Modal } from "../../components/ui/Modal";

export default function AdminUsers() {
  const [v, setV] = useState(0);
  const [q, setQ] = useState("");
  const [grantUser, setGrantUser] = useState<string | null>(null);
  const [gService, setGService] = useState<ServiceKey>("signals");
  const [gPlan, setGPlan] = useState<string>("basic");

  const data = db.get();
  const filtered = useMemo(() => data.users.filter((u) => !q || u.email.toLowerCase().includes(q.toLowerCase()) || u.name.toLowerCase().includes(q.toLowerCase())), [q, v]);

  const remove = (id: string) => {
    if (!confirm("Delete this user?")) return;
    const d = db.get();
    d.users = d.users.filter((u) => u.id !== id);
    d.subscriptions = d.subscriptions.filter((s) => s.userId !== id);
    db.set(d);
    setV((x) => x + 1);
  };

  const grant = () => {
    const d = db.get();
    const svc = SERVICES.find((s) => s.key === gService)!;
    const plan = svc.plans.find((p) => p.key === gPlan) || svc.plans[0];
    activateSubscription(d, grantUser!, gService, gPlan, plan.price);
    d.audit.unshift({ id: uid("a"), actor: "admin", action: `Granted ${gService}/${gPlan} to user`, target: grantUser!, createdAt: new Date().toISOString() });
    db.set(d);
    setGrantUser(null);
    setV((x) => x + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-white/60 text-sm">{data.users.length} total users</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-white/40" />
          <input className="input-base pl-9" placeholder="Search by name or email..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <Card>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-white/50 uppercase">
              <tr className="border-b border-[#262626]">
                <th className="text-left px-5 py-3">User</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3">Subscriptions</th>
                <th className="text-left px-5 py-3">Joined</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const subs = data.subscriptions.filter((s) => s.userId === u.id && s.status === "active");
                return (
                  <tr key={u.id} className="border-b border-[#262626] hover:bg-white/5">
                    <td className="px-5 py-3">
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-white/50 text-xs">{u.email}</div>
                    </td>
                    <td className="px-5 py-3"><Badge variant={u.role === "admin" ? "warning" : "neutral"}>{u.role}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {subs.length === 0 && <span className="text-white/40 text-xs">None</span>}
                        {subs.map((s) => <Badge key={s.id} variant="brand">{s.service.replace("-", " ")}·{s.plan}</Badge>)}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-white/60">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => { setGrantUser(u.id); setGService("signals"); setGPlan("basic"); }}>Grant Service</Button>
                        {u.role !== "admin" && <Button size="sm" variant="ghost" onClick={() => remove(u.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Modal open={!!grantUser} onClose={() => setGrantUser(null)} title="Grant service access">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/60">Service</label>
            <select className="input-base mt-1" value={gService} onChange={(e) => { setGService(e.target.value as ServiceKey); setGPlan(SERVICES.find((s) => s.key === e.target.value)!.plans[0].key); }}>
              {SERVICES.map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-white/60">Plan</label>
            <select className="input-base mt-1" value={gPlan} onChange={(e) => setGPlan(e.target.value)}>
              {SERVICES.find((s) => s.key === gService)!.plans.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
            </select>
          </div>
          <Button onClick={grant} className="w-full">Grant Access</Button>
        </div>
      </Modal>
    </div>
  );
}
