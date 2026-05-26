import { useState } from "react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { db, uid } from "../../lib/store";
import { Check, ExternalLink, X } from "lucide-react";
import { activateSubscription } from "../dashboard/Subscription";

export default function AdminPayments() {
  const [, setV] = useState(0);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const d = db.get();
  const txs = d.transactions.filter((t) => filter === "all" || t.status === filter);

  const approve = (id: string) => {
    const data = db.get();
    const t = data.transactions.find((x) => x.id === id)!;
    t.status = "approved";
    t.approvedAt = new Date().toISOString();
    activateSubscription(data, t.userId, t.service, t.plan, t.amount);
    data.audit.unshift({ id: uid("a"), actor: "admin", action: `Approved ${t.reference}`, target: t.userId, createdAt: new Date().toISOString() });
    data.notifications.unshift({ id: uid("n"), userId: t.userId, title: "Payment approved", message: `${t.reference} confirmed. ${t.service.toUpperCase()} now active.`, type: "success", createdAt: new Date().toISOString() });
    db.set(data);
    setV((x) => x + 1);
  };

  const reject = (id: string) => {
    const data = db.get();
    const t = data.transactions.find((x) => x.id === id)!;
    t.status = "rejected";
    data.audit.unshift({ id: uid("a"), actor: "admin", action: `Rejected ${t.reference}`, target: t.userId, createdAt: new Date().toISOString() });
    data.notifications.unshift({ id: uid("n"), userId: t.userId, title: "Payment rejected", message: `${t.reference} could not be verified. Please contact support.`, type: "alert", createdAt: new Date().toISOString() });
    db.set(data);
    setV((x) => x + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Payment Verification Center</h1>
          <p className="text-white/60 text-sm">Approve or reject pending transactions</p>
        </div>
        <select className="input-base w-auto" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <Card>
        <CardHeader title={`Transactions · ${txs.length}`} />
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-white/50 uppercase">
              <tr className="border-b border-[#262626]">
                <th className="text-left px-5 py-3">Reference</th>
                <th className="text-left px-5 py-3">User</th>
                <th className="text-left px-5 py-3">Service / Plan</th>
                <th className="text-left px-5 py-3">Method</th>
                <th className="text-left px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3">Proof</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {txs.map((t) => (
                <tr key={t.id} className="border-b border-[#262626] hover:bg-white/5 align-top">
                  <td className="px-5 py-3 font-mono text-[#00E676]">{t.reference}</td>
                  <td className="px-5 py-3">{t.userEmail}</td>
                  <td className="px-5 py-3 capitalize">{t.service.replace("-", " ")} · {t.plan}</td>
                  <td className="px-5 py-3 capitalize">{t.method}</td>
                  <td className="px-5 py-3 text-[#00E676]">${t.amount}</td>
                  <td className="px-5 py-3 text-xs text-white/60 max-w-[180px] break-all">
                    {t.proofUrl && <a href={t.proofUrl} target="_blank" className="inline-flex items-center gap-1 text-blue-400"><ExternalLink className="w-3 h-3" /> Proof</a>}
                    {t.txHash && <span className="font-mono">{t.txHash.slice(0, 16)}…</span>}
                    {!t.proofUrl && !t.txHash && <span className="text-white/30">—</span>}
                  </td>
                  <td className="px-5 py-3"><Badge variant={t.status === "approved" ? "brand" : t.status === "pending" ? "warning" : "danger"}>{t.status}</Badge></td>
                  <td className="px-5 py-3">
                    {t.status === "pending" ? (
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="brand" onClick={() => approve(t.id)}><Check className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="danger" onClick={() => reject(t.id)}><X className="w-3.5 h-3.5" /></Button>
                      </div>
                    ) : <span className="text-white/30 text-xs">—</span>}
                  </td>
                </tr>
              ))}
              {txs.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-white/50">No transactions match this filter.</td></tr>}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
