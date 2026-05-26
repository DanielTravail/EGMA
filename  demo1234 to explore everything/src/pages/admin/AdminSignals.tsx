import { useState } from "react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { db, uid } from "../../lib/store";
import type { Signal, SignalStatus, SignalTier } from "../../lib/types";
import { Plus, Trash2, Edit2 } from "lucide-react";

export default function AdminSignals() {
  const [, setV] = useState(0);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<Signal | null>(null);
  const data = db.get();

  const blank: Signal = {
    id: "",
    pair: "EUR/USD",
    type: "BUY",
    entry: 1.085,
    tp1: 1.088,
    tp2: 1.092,
    tp3: 1.095,
    sl: 1.082,
    analysis: "",
    tier: "basic",
    status: "active",
    postedAt: new Date().toISOString(),
  };
  const [form, setForm] = useState<Signal>(blank);

  const open = (s?: Signal) => {
    if (s) { setEdit(s); setForm({ ...s }); } else { setEdit(null); setForm({ ...blank, postedAt: new Date().toISOString() }); }
    setShow(true);
  };

  const save = () => {
    const d = db.get();
    if (edit) {
      const i = d.signals.findIndex((x) => x.id === edit.id);
      d.signals[i] = { ...form, id: edit.id };
      d.audit.unshift({ id: uid("a"), actor: "admin", action: `Updated signal ${form.pair}`, createdAt: new Date().toISOString() });
    } else {
      d.signals.unshift({ ...form, id: uid("sg"), postedAt: new Date().toISOString() });
      d.notifications.unshift({ id: uid("n"), userId: "all", title: "New signal posted", message: `${form.pair} ${form.type} — ${form.tier.toUpperCase()} tier`, type: "info", createdAt: new Date().toISOString() });
      d.audit.unshift({ id: uid("a"), actor: "admin", action: `Created signal ${form.pair}`, createdAt: new Date().toISOString() });
    }
    db.set(d);
    setShow(false);
    setV((x) => x + 1);
  };

  const remove = (id: string) => {
    if (!confirm("Delete signal?")) return;
    const d = db.get();
    d.signals = d.signals.filter((s) => s.id !== id);
    db.set(d);
    setV((x) => x + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Signal Management</h1>
          <p className="text-white/60 text-sm">Create, edit and publish signals across tiers</p>
        </div>
        <Button onClick={() => open()}><Plus className="w-4 h-4" /> New Signal</Button>
      </div>

      <Card>
        <CardHeader title="All signals" />
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-white/50 uppercase">
              <tr className="border-b border-[#262626]">
                <th className="text-left px-5 py-3">Pair</th>
                <th className="text-left px-5 py-3">Type</th>
                <th className="text-left px-5 py-3">Entry / TP / SL</th>
                <th className="text-left px-5 py-3">Tier</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Posted</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.signals.map((s) => (
                <tr key={s.id} className="border-b border-[#262626] hover:bg-white/5">
                  <td className="px-5 py-3 font-semibold">{s.pair}</td>
                  <td className="px-5 py-3"><Badge variant={s.type === "BUY" ? "brand" : "danger"}>{s.type}</Badge></td>
                  <td className="px-5 py-3 text-white/70 text-xs">E {s.entry} · TP {s.tp1}/{s.tp2}/{s.tp3} · SL {s.sl}</td>
                  <td className="px-5 py-3"><Badge variant="info">{s.tier}</Badge></td>
                  <td className="px-5 py-3"><Badge variant={["tp1","tp2","tp3"].includes(s.status) ? "brand" : s.status === "sl" ? "danger" : s.status === "active" ? "info" : "neutral"}>{s.status}</Badge></td>
                  <td className="px-5 py-3 text-white/60 text-xs">{new Date(s.postedAt).toLocaleString()}</td>
                  <td className="px-5 py-3 flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => open(s)}><Edit2 className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Modal open={show} onClose={() => setShow(false)} title={edit ? "Edit signal" : "New signal"} maxWidth="max-w-2xl">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Pair" value={form.pair} onChange={(v) => setForm({ ...form, pair: v })} />
          <div>
            <label className="text-xs text-white/60">Type</label>
            <select className="input-base mt-1" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "BUY" | "SELL" })}>
              <option>BUY</option><option>SELL</option>
            </select>
          </div>
          <Input label="Entry" type="number" value={String(form.entry)} onChange={(v) => setForm({ ...form, entry: Number(v) })} />
          <Input label="SL" type="number" value={String(form.sl)} onChange={(v) => setForm({ ...form, sl: Number(v) })} />
          <Input label="TP1" type="number" value={String(form.tp1)} onChange={(v) => setForm({ ...form, tp1: Number(v) })} />
          <Input label="TP2" type="number" value={String(form.tp2)} onChange={(v) => setForm({ ...form, tp2: Number(v) })} />
          <Input label="TP3" type="number" value={String(form.tp3)} onChange={(v) => setForm({ ...form, tp3: Number(v) })} />
          <div>
            <label className="text-xs text-white/60">Tier</label>
            <select className="input-base mt-1" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value as SignalTier })}>
              <option value="basic">Basic</option><option value="standard">Standard</option><option value="vip">VIP</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs text-white/60">Status</label>
            <select className="input-base mt-1" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as SignalStatus })}>
              <option value="active">Active</option><option value="tp1">TP1 Hit</option><option value="tp2">TP2 Hit</option><option value="tp3">TP3 Hit</option><option value="sl">SL Hit</option><option value="closed">Closed</option><option value="expired">Expired</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs text-white/60">Analysis</label>
            <textarea rows={3} className="input-base mt-1" value={form.analysis} onChange={(e) => setForm({ ...form, analysis: e.target.value })} />
          </div>
          <div className="col-span-2"><Button onClick={save} className="w-full">{edit ? "Save changes" : "Create signal"}</Button></div>
        </div>
      </Modal>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs text-white/60">{label}</label>
      <input type={type} className="input-base mt-1" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
