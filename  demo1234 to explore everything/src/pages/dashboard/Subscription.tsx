import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as Lucide from "lucide-react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { SERVICES } from "../../lib/services";
import { useAuth } from "../../lib/auth";
import { db, uid } from "../../lib/store";
import type { PaymentMethod, ServiceKey } from "../../lib/types";
import { Building2, CheckCircle2, Copy, CreditCard, FileUp, Wallet } from "lucide-react";

export default function Subscription() {
  const { user, refresh } = useAuth();
  const [, setVersion] = useState(0);
  const [params] = useSearchParams();
  const initService = params.get("service") as ServiceKey | null;
  const initPlan = params.get("plan");

  const d = db.get();
  const subs = d.subscriptions.filter((s) => s.userId === user!.id);
  const txs = d.transactions.filter((t) => t.userId === user!.id).slice(0, 10);

  const [showPay, setShowPay] = useState(!!initService);
  const [serviceKey, setServiceKey] = useState<ServiceKey>(initService || "signals");
  const [planKey, setPlanKey] = useState<string>(initPlan || SERVICES[0].plans[0].key);
  const [method, setMethod] = useState<PaymentMethod>("paystack");
  const [proof, setProof] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [done, setDone] = useState(false);

  const selectedService = useMemo(() => SERVICES.find((s) => s.key === serviceKey)!, [serviceKey]);
  const selectedPlan = useMemo(() => selectedService.plans.find((p) => p.key === planKey) || selectedService.plans[0], [selectedService, planKey]);

  const settings = d.paymentSettings;

  const copy = (txt: string) => navigator.clipboard.writeText(txt);

  const submitPayment = () => {
    const data = db.get();
    const reference = `ENX-${Date.now().toString().slice(-7)}`;
    // For Paystack: simulate instant approval
    const isInstant = method === "paystack";
    const tx = {
      id: uid("t"),
      userId: user!.id,
      userEmail: user!.email,
      service: serviceKey,
      plan: planKey,
      amount: selectedPlan.price,
      method,
      status: (isInstant ? "approved" : "pending") as "approved" | "pending",
      reference,
      proofUrl: proof || undefined,
      txHash: txHash || undefined,
      createdAt: new Date().toISOString(),
      approvedAt: isInstant ? new Date().toISOString() : undefined,
    };
    data.transactions.unshift(tx);

    if (isInstant) {
      // Create/activate subscription immediately
      activateSubscription(data, user!.id, serviceKey, planKey, selectedPlan.price);
    }
    data.notifications.unshift({
      id: uid("n"),
      userId: user!.id,
      title: isInstant ? "Payment approved" : "Payment received — awaiting verification",
      message: `Reference ${reference} · $${selectedPlan.price} for ${selectedService.name}.`,
      type: isInstant ? "success" : "info",
      createdAt: new Date().toISOString(),
    });
    db.set(data);
    setDone(true);
    refresh();
    setVersion((v) => v + 1);
  };

  const resetModal = () => {
    setDone(false);
    setShowPay(false);
    setProof("");
    setTxHash("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <p className="text-white/60 text-sm">Manage every service subscription independently.</p>
        </div>
        <Button onClick={() => setShowPay(true)}><CreditCard className="w-4 h-4" /> New Subscription</Button>
      </div>

      {/* Active Subscriptions */}
      <Card>
        <CardHeader title="Active subscriptions" />
        <CardBody className="p-0">
          <div className="divide-y divide-[#262626]">
            {subs.length === 0 && <div className="p-6 text-center text-white/60 text-sm">No subscriptions yet.</div>}
            {subs.map((s) => {
              const meta = SERVICES.find((x) => x.key === s.service)!;
              const Icon = (Lucide as any)[meta.icon] || Wallet;
              return (
                <div key={s.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00E676]/10 text-[#00E676] flex items-center justify-center"><Icon className="w-5 h-5" /></div>
                    <div>
                      <div className="text-white font-semibold">{meta.name} · {s.plan.toUpperCase()}</div>
                      <div className="text-xs text-white/50">Expires {new Date(s.expiresAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={s.status === "active" ? "brand" : s.status === "pending" ? "warning" : "danger"}>{s.status}</Badge>
                    <span className="hidden sm:block text-sm text-white/60">${s.amount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Billing history */}
      <Card>
        <CardHeader title="Billing history" />
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-white/50 uppercase">
              <tr className="border-b border-[#262626]">
                <th className="text-left px-5 py-3">Reference</th>
                <th className="text-left px-5 py-3">Service</th>
                <th className="text-left px-5 py-3">Method</th>
                <th className="text-left px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {txs.length === 0 && <tr><td colSpan={6} className="px-5 py-6 text-center text-white/50">No transactions yet.</td></tr>}
              {txs.map((t) => (
                <tr key={t.id} className="border-b border-[#262626] hover:bg-white/5">
                  <td className="px-5 py-3 font-mono text-[#00E676]">{t.reference}</td>
                  <td className="px-5 py-3 capitalize">{t.service.replace("-", " ")} · {t.plan}</td>
                  <td className="px-5 py-3 capitalize">{t.method}</td>
                  <td className="px-5 py-3">${t.amount}</td>
                  <td className="px-5 py-3"><Badge variant={t.status === "approved" ? "brand" : t.status === "pending" ? "warning" : "danger"}>{t.status}</Badge></td>
                  <td className="px-5 py-3 text-white/60">{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Modal open={showPay} onClose={resetModal} title={done ? "Payment submitted" : "New subscription"} maxWidth="max-w-2xl">
        {done ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-14 h-14 text-[#00E676] mx-auto" />
            <h3 className="text-lg font-semibold mt-3">
              {method === "paystack" ? "Payment Successful 🎉" : "Awaiting admin verification"}
            </h3>
            <p className="text-white/60 text-sm mt-2 max-w-sm mx-auto">
              {method === "paystack"
                ? "Your subscription is now active. Refresh to see new modules in your sidebar."
                : "We received your details. Approval typically takes 1–6 hours. You'll receive a notification."}
            </p>
            <Button className="mt-5" onClick={resetModal}>Close</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/60">Service</label>
                <select className="input-base mt-1" value={serviceKey} onChange={(e) => { setServiceKey(e.target.value as ServiceKey); setPlanKey(SERVICES.find((s) => s.key === e.target.value)!.plans[0].key); }}>
                  {SERVICES.map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/60">Plan</label>
                <select className="input-base mt-1" value={planKey} onChange={(e) => setPlanKey(e.target.value)}>
                  {selectedService.plans.map((p) => <option key={p.key} value={p.key}>{p.name} — ${p.price}{p.period}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-white/60">Payment method</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {([
                  { v: "paystack", l: "Paystack", i: CreditCard },
                  { v: "bank", l: "Bank Transfer", i: Building2 },
                  { v: "crypto", l: "Crypto", i: Wallet },
                ] as const).map((m) => (
                  <button
                    key={m.v}
                    type="button"
                    onClick={() => setMethod(m.v)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition text-sm ${method === m.v ? "border-[#00E676] bg-[#00E676]/10 text-[#00E676]" : "border-[#262626] text-white/70 hover:border-white/20"}`}
                  >
                    <m.i className="w-4 h-4" /> {m.l}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-4 text-sm">
              <div className="flex justify-between"><span className="text-white/60">Plan</span><span className="text-white">{selectedService.name} · {selectedPlan.name}</span></div>
              <div className="flex justify-between mt-1"><span className="text-white/60">Total</span><span className="text-[#00E676] font-bold text-lg">${selectedPlan.price}{selectedPlan.period}</span></div>
            </div>

            {method === "bank" && (
              <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-4 text-sm space-y-2">
                <h4 className="font-semibold text-[#00E676]">Bank Transfer Details</h4>
                <PayRow label="Bank" value={settings.bank.bankName} onCopy={copy} />
                <PayRow label="Account Name" value={settings.bank.accountName} onCopy={copy} />
                <PayRow label="Account Number" value={settings.bank.accountNumber} onCopy={copy} />
                {settings.bank.swift && <PayRow label="SWIFT/BIC" value={settings.bank.swift} onCopy={copy} />}
                <p className="text-xs text-white/60 mt-2">{settings.instructions}</p>
                <div className="mt-2">
                  <label className="text-xs text-white/60 flex items-center gap-2"><FileUp className="w-3.5 h-3.5" /> Proof of Payment (URL or note)</label>
                  <input className="input-base mt-1" placeholder="https://... or describe transfer" value={proof} onChange={(e) => setProof(e.target.value)} />
                </div>
              </div>
            )}

            {method === "crypto" && (
              <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-4 text-sm space-y-3">
                <h4 className="font-semibold text-[#00E676]">Crypto Payment</h4>
                {settings.crypto.map((c) => (
                  <div key={c.coin} className="border border-[#262626] rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-white">{c.coin} · {c.network}</span>
                      <button onClick={() => copy(c.address)} className="text-[#00E676] text-xs flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
                    </div>
                    <div className="font-mono text-xs mt-1 text-white/70 break-all">{c.address}</div>
                  </div>
                ))}
                <p className="text-xs text-white/60">{settings.instructions}</p>
                <div>
                  <label className="text-xs text-white/60">Transaction Hash</label>
                  <input className="input-base mt-1 font-mono" placeholder="0x..." value={txHash} onChange={(e) => setTxHash(e.target.value)} />
                </div>
              </div>
            )}

            {method === "paystack" && (
              <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-4 text-sm text-white/70">
                You'll be redirected to Paystack to securely complete payment. <span className="text-[#00E676]">(Demo: auto-approved)</span>
              </div>
            )}

            <Button onClick={submitPayment} className="w-full" size="lg" disabled={method === "bank" && !proof || method === "crypto" && !txHash}>
              {method === "paystack" ? "Pay Now" : "Submit for Verification"}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function PayRow({ label, value, onCopy }: { label: string; value: string; onCopy: (s: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-[10px] text-white/50 uppercase tracking-wider">{label}</div>
        <div className="text-white">{value}</div>
      </div>
      <button onClick={() => onCopy(value)} className="text-[#00E676] text-xs flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
    </div>
  );
}

// Helper exported for admin too
export function activateSubscription(data: ReturnType<typeof db.get>, userId: string, service: ServiceKey, plan: string, amount: number) {
  const existing = data.subscriptions.find((s) => s.userId === userId && s.service === service);
  const expires = new Date(Date.now() + 365 * 86400000).toISOString();
  if (existing) {
    existing.plan = plan;
    existing.status = "active";
    existing.startedAt = new Date().toISOString();
    existing.expiresAt = expires;
    existing.amount = amount;
  } else {
    data.subscriptions.push({
      id: uid("s"),
      userId,
      service,
      plan,
      status: "active",
      startedAt: new Date().toISOString(),
      expiresAt: expires,
      amount,
    });
  }
}
