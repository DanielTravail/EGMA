import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../lib/auth";
import { db, uid } from "../../lib/store";
import { Wallet, TrendingUp, Clock, Plus, Check } from "lucide-react";
import { Modal } from "../../components/ui/Modal";

export default function Investments() {
  const { user, hasService } = useAuth();
  if (!hasService("investments")) return <Navigate to="/pricing#investments" replace />;

  const [version, setVersion] = useState(0);
  const data = db.get();
  const plans = data.plans;
  const investments = data.investments.filter((i) => i.userId === user!.id);
  const [showNew, setShowNew] = useState(false);
  const [planId, setPlanId] = useState(plans[0]?.id || "");
  const [amount, setAmount] = useState(100);

  const totals = useMemo(() => {
    return investments.reduce(
      (acc, i) => ({ invested: acc.invested + i.amount, earned: acc.earned + i.totalEarned, claimable: acc.claimable + i.claimable }),
      { invested: 0, earned: 0, claimable: 0 },
    );
  }, [investments, version]);

  const claim = (id: string) => {
    const d = db.get();
    const iv = d.investments.find((x) => x.id === id);
    if (!iv) return;
    iv.claimable = 0;
    db.set(d);
    d.notifications.unshift({ id: uid("n"), userId: user!.id, title: "ROI claimed", message: `You claimed $${iv.claimable} from your investment.`, type: "success", createdAt: new Date().toISOString() });
    db.set(d);
    setVersion((v) => v + 1);
  };

  const createInvestment = () => {
    const d = db.get();
    const plan = plans.find((p) => p.id === planId);
    if (!plan || amount < plan.minAmount) return;
    d.investments.push({ id: uid("iv"), userId: user!.id, planId, amount, startedAt: new Date().toISOString(), monthsElapsed: 0, claimable: 0, totalEarned: 0 });
    db.set(d);
    setShowNew(false);
    setVersion((v) => v + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Investments</h1>
          <p className="text-white/60 text-sm">6% monthly ROI · claimable monthly · 12-month terms</p>
        </div>
        <Button onClick={() => setShowNew(true)}><Plus className="w-4 h-4" /> New Investment</Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={Wallet} label="Total invested" value={`$${totals.invested.toLocaleString()}`} />
        <Stat icon={TrendingUp} label="Total earned" value={`$${totals.earned.toLocaleString()}`} tone="brand" />
        <Stat icon={Clock} label="Claimable now" value={`$${totals.claimable.toLocaleString()}`} tone="brand" />
      </div>

      <div className="space-y-4">
        {investments.length === 0 && (
          <Card><CardBody className="text-center py-10">
            <Wallet className="w-10 h-10 text-[#00E676] mx-auto" />
            <h3 className="mt-3 font-semibold">No active investments</h3>
            <p className="text-sm text-white/60 mt-1">Create your first plan to start earning 6% monthly.</p>
            <Button onClick={() => setShowNew(true)} className="mt-4"><Plus className="w-4 h-4" /> Start Investing</Button>
          </CardBody></Card>
        )}
        {investments.map((iv) => {
          const plan = plans.find((p) => p.id === iv.planId);
          if (!plan) return null;
          const progress = Math.min(100, (iv.monthsElapsed / plan.duration) * 100);
          const monthlyRoi = (iv.amount * plan.monthlyRoi) / 100;
          const nextClaim = new Date(new Date(iv.startedAt).getTime() + (iv.monthsElapsed + 1) * 30 * 86400000);
          const remainingMs = nextClaim.getTime() - Date.now();
          const daysLeft = Math.max(0, Math.ceil(remainingMs / 86400000));
          return (
            <Card key={iv.id}>
              <CardHeader title={`${plan.name} Plan`} subtitle={`Started ${new Date(iv.startedAt).toLocaleDateString()}`} action={<Badge variant="brand">{plan.monthlyRoi}% / month</Badge>} />
              <CardBody>
                <div className="grid sm:grid-cols-4 gap-3">
                  <Field label="Invested" value={`$${iv.amount.toLocaleString()}`} />
                  <Field label="Monthly ROI" value={`$${monthlyRoi.toFixed(2)}`} accent />
                  <Field label="Total earned" value={`$${iv.totalEarned.toFixed(2)}`} accent />
                  <Field label="Claimable" value={`$${iv.claimable.toFixed(2)}`} accent />
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-white/70">Plan progress · month {iv.monthsElapsed}/{plan.duration}</span>
                    <span className="text-[#00E676] font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-[#0A0A0A] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#00E676] to-[#00B85F] transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-white/50 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Next claim in <span className="text-white">{daysLeft} days</span></div>
                    <Button onClick={() => claim(iv.id)} disabled={iv.claimable <= 0} variant={iv.claimable > 0 ? "brand" : "outline"} size="sm">
                      <Check className="w-3.5 h-3.5" /> Claim ${iv.claimable.toFixed(2)}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Start a new investment">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/60">Plan</label>
            <select className="input-base mt-1" value={planId} onChange={(e) => setPlanId(e.target.value)}>
              {plans.map((p) => <option key={p.id} value={p.id}>{p.name} (min ${p.minAmount})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-white/60">Amount (USD)</label>
            <input type="number" className="input-base mt-1" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </div>
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-3 text-sm">
            <div className="flex justify-between"><span className="text-white/60">Monthly ROI</span><span className="text-[#00E676]">${((amount * 6) / 100).toFixed(2)}</span></div>
            <div className="flex justify-between mt-1"><span className="text-white/60">12-month return</span><span className="text-[#00E676]">${((amount * 6 * 12) / 100).toFixed(2)}</span></div>
          </div>
          <Button onClick={createInvestment} className="w-full">Confirm Investment</Button>
        </div>
      </Modal>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone = "neutral" }: { icon: any; label: string; value: string; tone?: "neutral" | "brand" }) {
  return (
    <Card><CardBody>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-white/50">{label}</div>
          <div className={`text-2xl font-bold mt-1 ${tone === "brand" ? "text-[#00E676]" : ""}`}>{value}</div>
        </div>
        <Icon className="w-6 h-6 text-[#00E676]" />
      </div>
    </CardBody></Card>
  );
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-3">
      <div className="text-[10px] text-white/50 uppercase tracking-wider">{label}</div>
      <div className={`font-semibold mt-1 ${accent ? "text-[#00E676]" : ""}`}>{value}</div>
    </div>
  );
}
