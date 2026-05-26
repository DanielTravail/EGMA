import { useState } from "react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { db, uid } from "../../lib/store";
import { EmptyState } from "../../components/ui/EmptyState";
import { Megaphone, ShieldCheck, LifeBuoy, BookOpen, Wallet, Save, Plus, Trash2 } from "lucide-react";

/* ---------------- SUBSCRIPTIONS ---------------- */
export function AdminSubscriptions() {
  const [, setV] = useState(0);
  const d = db.get();
  const cancel = (id: string) => {
    const data = db.get();
    const s = data.subscriptions.find((x) => x.id === id)!;
    s.status = "expired";
    data.audit.unshift({ id: uid("a"), actor: "admin", action: `Cancelled subscription ${id}`, createdAt: new Date().toISOString() });
    db.set(data);
    setV((x) => x + 1);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-white/60 text-sm">All user subscriptions across services</p>
      </div>
      <Card>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-white/50 uppercase">
              <tr className="border-b border-[#262626]">
                <th className="text-left px-5 py-3">User</th>
                <th className="text-left px-5 py-3">Service</th>
                <th className="text-left px-5 py-3">Plan</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Expires</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {d.subscriptions.map((s) => {
                const u = d.users.find((x) => x.id === s.userId);
                return (
                  <tr key={s.id} className="border-b border-[#262626] hover:bg-white/5">
                    <td className="px-5 py-3">{u?.email || "-"}</td>
                    <td className="px-5 py-3 capitalize">{s.service.replace("-", " ")}</td>
                    <td className="px-5 py-3 capitalize">{s.plan}</td>
                    <td className="px-5 py-3"><Badge variant={s.status === "active" ? "brand" : s.status === "pending" ? "warning" : "danger"}>{s.status}</Badge></td>
                    <td className="px-5 py-3 text-white/60">{new Date(s.expiresAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-right">
                      {s.status === "active" && <Button size="sm" variant="danger" onClick={() => cancel(s.id)}>Cancel</Button>}
                    </td>
                  </tr>
                );
              })}
              {d.subscriptions.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-white/50">No subscriptions yet.</td></tr>}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

/* ---------------- BROADCASTS ---------------- */
export function AdminBroadcasts() {
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const send = () => {
    if (!title || !msg) return;
    const d = db.get();
    d.notifications.unshift({ id: uid("n"), userId: "all", title, message: msg, type: "info", createdAt: new Date().toISOString() });
    d.audit.unshift({ id: uid("a"), actor: "admin", action: `Broadcast: ${title}`, createdAt: new Date().toISOString() });
    db.set(d);
    setSent(true);
    setTitle(""); setMsg("");
    setTimeout(() => setSent(false), 2500);
  };
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Broadcasts</h1>
        <p className="text-white/60 text-sm">Send platform-wide notifications</p>
      </div>
      <Card>
        <CardHeader title="Compose broadcast" />
        <CardBody className="space-y-3">
          {sent && <div className="text-[#00E676] text-sm bg-[#00E676]/10 border border-[#00E676]/30 rounded-lg px-3 py-2">✓ Broadcast sent to all users.</div>}
          <input className="input-base" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea rows={4} className="input-base" placeholder="Message..." value={msg} onChange={(e) => setMsg(e.target.value)} />
          <Button onClick={send}><Megaphone className="w-4 h-4" /> Send to all users</Button>
        </CardBody>
      </Card>
    </div>
  );
}

/* ---------------- TICKETS ---------------- */
export function AdminTickets() {
  const [, setV] = useState(0);
  const d = db.get();
  const close = (id: string) => {
    const data = db.get();
    const t = data.tickets.find((x) => x.id === id)!;
    t.status = "closed";
    db.set(data); setV((x) => x + 1);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <p className="text-white/60 text-sm">{d.tickets.length} total</p>
      </div>
      {d.tickets.length === 0 ? (
        <Card><CardBody><EmptyState icon={<LifeBuoy className="w-6 h-6" />} title="No tickets" message="When users send messages they'll appear here." /></CardBody></Card>
      ) : (
        <div className="space-y-3">
          {d.tickets.map((t) => (
            <Card key={t.id}>
              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{t.subject}</div>
                    <div className="text-xs text-white/50 mt-0.5">{t.email} · {new Date(t.createdAt).toLocaleString()}</div>
                    <p className="text-sm text-white/70 mt-3 whitespace-pre-line">{t.message}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={t.status === "open" ? "info" : "neutral"}>{t.status}</Badge>
                    {t.status !== "closed" && <Button size="sm" onClick={() => close(t.id)}>Close</Button>}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- AUDIT ---------------- */
export function AdminAudit() {
  const d = db.get();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-white/60 text-sm">All admin actions</p>
      </div>
      <Card>
        <CardBody className="p-0">
          <div className="divide-y divide-[#262626]">
            {d.audit.length === 0 && <div className="p-8 text-center text-white/50 text-sm">No audit entries yet.</div>}
            {d.audit.map((a) => (
              <div key={a.id} className="px-5 py-3 flex items-center justify-between hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#00E676]" />
                  <div>
                    <div className="text-sm">{a.action}</div>
                    <div className="text-xs text-white/50">{a.actor} {a.target && `→ ${a.target}`}</div>
                  </div>
                </div>
                <div className="text-xs text-white/40">{new Date(a.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/* ---------------- ACADEMY ADMIN ---------------- */
export function AdminAcademy() {
  const d = db.get();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Academy</h1>
        <p className="text-white/60 text-sm">Manage modules and lessons</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        {d.academy.map((m) => (
          <Card key={m.id}>
            <CardHeader title={m.title} subtitle={m.description} action={<Badge variant="brand">{m.level}</Badge>} />
            <CardBody className="space-y-2">
              {m.lessons.map((l) => (
                <div key={l.id} className="flex items-center gap-2 text-sm py-1.5 border-b border-[#262626] last:border-0">
                  <BookOpen className="w-4 h-4 text-[#00E676]" />
                  <span className="flex-1">{l.title}</span>
                  <span className="text-xs text-white/50">{l.type}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------- INVESTMENTS ADMIN ---------------- */
export function AdminInvestments() {
  const d = db.get();
  const total = d.investments.reduce((s, i) => s + i.amount, 0);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Investments</h1>
        <p className="text-white/60 text-sm">Total managed: <span className="text-[#00E676]">${total.toLocaleString()}</span></p>
      </div>
      <Card>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-white/50 uppercase">
              <tr className="border-b border-[#262626]">
                <th className="text-left px-5 py-3">User</th>
                <th className="text-left px-5 py-3">Plan</th>
                <th className="text-left px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3">Earned</th>
                <th className="text-left px-5 py-3">Claimable</th>
                <th className="text-left px-5 py-3">Started</th>
              </tr>
            </thead>
            <tbody>
              {d.investments.map((iv) => {
                const u = d.users.find((x) => x.id === iv.userId);
                const p = d.plans.find((x) => x.id === iv.planId);
                return (
                  <tr key={iv.id} className="border-b border-[#262626] hover:bg-white/5">
                    <td className="px-5 py-3">{u?.email}</td>
                    <td className="px-5 py-3">{p?.name}</td>
                    <td className="px-5 py-3">${iv.amount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-[#00E676]">${iv.totalEarned.toFixed(2)}</td>
                    <td className="px-5 py-3 text-[#00E676]">${iv.claimable.toFixed(2)}</td>
                    <td className="px-5 py-3 text-white/60">{new Date(iv.startedAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
              {d.investments.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-white/50">No investments yet.</td></tr>}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

/* ---------------- PAYMENT SETTINGS ---------------- */
export function AdminSettings() {
  const d = db.get();
  const [bank, setBank] = useState(d.paymentSettings.bank);
  const [crypto, setCrypto] = useState(d.paymentSettings.crypto);
  const [instructions, setInstructions] = useState(d.paymentSettings.instructions);
  const [msg, setMsg] = useState<string | null>(null);

  const save = () => {
    const data = db.get();
    data.paymentSettings = { bank, crypto, instructions };
    data.audit.unshift({ id: uid("a"), actor: "admin", action: `Updated payment settings`, createdAt: new Date().toISOString() });
    db.set(data);
    setMsg("Saved.");
    setTimeout(() => setMsg(null), 2000);
  };

  const addCrypto = () => setCrypto([...crypto, { coin: "USDT", network: "TRC20", address: "" }]);
  const removeCrypto = (i: number) => setCrypto(crypto.filter((_, x) => x !== i));

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Platform Settings</h1>
        <p className="text-white/60 text-sm">Configure payment accounts and platform behavior</p>
      </div>

      {msg && <div className="text-[#00E676] text-sm bg-[#00E676]/10 border border-[#00E676]/30 rounded-lg px-3 py-2">{msg}</div>}

      <Card>
        <CardHeader title="Bank Account Details" />
        <CardBody className="grid sm:grid-cols-2 gap-3">
          <Field label="Bank Name" value={bank.bankName} set={(v) => setBank({ ...bank, bankName: v })} />
          <Field label="Account Name" value={bank.accountName} set={(v) => setBank({ ...bank, accountName: v })} />
          <Field label="Account Number" value={bank.accountNumber} set={(v) => setBank({ ...bank, accountNumber: v })} />
          <Field label="SWIFT/BIC (optional)" value={bank.swift || ""} set={(v) => setBank({ ...bank, swift: v })} />
          <Field label="Bank Logo URL (optional)" value={bank.logoUrl || ""} set={(v) => setBank({ ...bank, logoUrl: v })} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Crypto Wallets" action={<Button size="sm" variant="outline" onClick={addCrypto}><Plus className="w-4 h-4" /> Add</Button>} />
        <CardBody className="space-y-4">
          {crypto.map((c, i) => (
            <div key={i} className="grid sm:grid-cols-4 gap-2 items-end border border-[#262626] rounded-xl p-3">
              <Field label="Coin" value={c.coin} set={(v) => setCrypto(crypto.map((x, j) => j === i ? { ...x, coin: v } : x))} />
              <Field label="Network" value={c.network} set={(v) => setCrypto(crypto.map((x, j) => j === i ? { ...x, network: v } : x))} />
              <Field label="Address" value={c.address} set={(v) => setCrypto(crypto.map((x, j) => j === i ? { ...x, address: v } : x))} />
              <div className="flex gap-2">
                <Field label="QR URL" value={c.qrUrl || ""} set={(v) => setCrypto(crypto.map((x, j) => j === i ? { ...x, qrUrl: v } : x))} />
                <Button size="sm" variant="ghost" onClick={() => removeCrypto(i)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Payment Instructions" />
        <CardBody>
          <textarea rows={4} className="input-base" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
        </CardBody>
      </Card>

      <Button onClick={save} size="lg"><Save className="w-4 h-4" /> Save Settings</Button>
    </div>
  );
}

function Field({ label, value, set }: { label: string; value: string; set: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-white/60">{label}</label>
      <input className="input-base mt-1" value={value} onChange={(e) => set(e.target.value)} />
    </div>
  );
}

// Re-export for convenience to avoid extra files
export { Wallet };
