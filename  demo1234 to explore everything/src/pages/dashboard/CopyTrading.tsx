import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardBody } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../lib/auth";
import { db } from "../../lib/store";
import { TrendingUp, Users } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export default function CopyTrading() {
  const { hasService } = useAuth();
  if (!hasService("copy-trading")) return <Navigate to="/pricing#copy-trading" replace />;

  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const traders = db.get().copyTraders;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Copy Trading</h1>
        <p className="text-white/60 text-sm">Browse top-performing traders and mirror their strategy. <Badge variant="warning">Demo MVP</Badge></p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardBody><div className="text-xs text-white/50">Following</div><div className="text-2xl font-bold mt-1">{Object.values(copied).filter(Boolean).length}</div></CardBody></Card>
        <Card><CardBody><div className="text-xs text-white/50">Copy capital</div><div className="text-2xl font-bold mt-1">$2,500</div></CardBody></Card>
        <Card><CardBody><div className="text-xs text-white/50">30D P/L</div><div className="text-2xl font-bold text-[#00E676] mt-1">+$418</div></CardBody></Card>
        <Card><CardBody><div className="text-xs text-white/50">Open positions</div><div className="text-2xl font-bold mt-1">7</div></CardBody></Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {traders.map((t) => {
          const data = Array.from({ length: 20 }, (_, i) => ({ v: 100 + i * (t.roi30d / 20) + Math.sin(i) * 3 }));
          const isCopied = copied[t.id];
          return (
            <Card key={t.id} className="overflow-hidden">
              <CardBody>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00E676] to-[#00B85F] text-[#0A0A0A] font-bold flex items-center justify-center">{t.avatar}</div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">{t.name}</div>
                    <div className="text-xs text-white/50">{t.country} · <Users className="w-3 h-3 inline" /> {t.followers}</div>
                  </div>
                  <Badge variant={t.risk === "Low" ? "brand" : t.risk === "Medium" ? "info" : "danger"}>{t.risk}</Badge>
                </div>
                <div className="h-20 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id={`g-${t.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00E676" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#00E676" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke="#00E676" strokeWidth={2} fill={`url(#g-${t.id})`} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-2.5">
                    <div className="text-[10px] text-white/50">30D ROI</div>
                    <div className="text-[#00E676] font-semibold flex items-center gap-1"><TrendingUp className="w-3 h-3" />+{t.roi30d}%</div>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-2.5">
                    <div className="text-[10px] text-white/50">Win-rate</div>
                    <div className="text-white font-semibold">{t.winRate}%</div>
                  </div>
                </div>
                <Button onClick={() => setCopied({ ...copied, [t.id]: !isCopied })} variant={isCopied ? "outline" : "brand"} className="w-full mt-4">
                  {isCopied ? "Stop copying" : "Copy trader"}
                </Button>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
