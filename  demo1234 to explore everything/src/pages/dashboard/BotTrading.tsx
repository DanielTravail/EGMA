import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../lib/auth";
import { db } from "../../lib/store";
import { Bot as BotIcon, Pause, Play } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";

export default function BotTrading() {
  const { hasService } = useAuth();
  if (!hasService("bot-trading")) return <Navigate to="/pricing#bot-trading" replace />;

  const [bots, setBots] = useState(db.get().bots);
  const totalPerf = bots.reduce((s, b) => s + b.performance, 0);
  const activity = Array.from({ length: 12 }, (_, i) => ({ h: i, t: Math.round(2 + Math.random() * 8) }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bot Trading</h1>
        <p className="text-white/60 text-sm">Automated strategies running 24/7. <Badge variant="warning">MVP UI</Badge></p>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <Card><CardBody><div className="text-xs text-white/50">Bots</div><div className="text-2xl font-bold mt-1">{bots.length}</div></CardBody></Card>
        <Card><CardBody><div className="text-xs text-white/50">Running</div><div className="text-2xl font-bold text-[#00E676] mt-1">{bots.filter((b) => b.status === "running").length}</div></CardBody></Card>
        <Card><CardBody><div className="text-xs text-white/50">Total trades</div><div className="text-2xl font-bold mt-1">{bots.reduce((s, b) => s + b.trades, 0)}</div></CardBody></Card>
        <Card><CardBody><div className="text-xs text-white/50">Avg performance</div><div className="text-2xl font-bold text-[#00E676] mt-1">+{(totalPerf / bots.length).toFixed(1)}%</div></CardBody></Card>
      </div>

      <Card>
        <CardHeader title="Bot activity (last 12h)" />
        <CardBody>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activity}>
                <Tooltip contentStyle={{ background: "#0A0A0A", border: "1px solid #262626", borderRadius: 10 }} />
                <Bar dataKey="t" fill="#00E676" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {bots.map((b) => (
          <Card key={b.id}>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] flex items-center justify-center">
                  <BotIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold">{b.name}</div>
                  <div className="text-xs text-white/50">{b.strategy} · {b.pair}</div>
                </div>
                <Badge variant={b.status === "running" ? "brand" : "neutral"}>{b.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-3">
                  <div className="text-[10px] text-white/50">Performance</div>
                  <div className="text-[#00E676] font-semibold">+{b.performance}%</div>
                </div>
                <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-3">
                  <div className="text-[10px] text-white/50">Trades</div>
                  <div className="text-white font-semibold">{b.trades}</div>
                </div>
              </div>
              <Button
                onClick={() => setBots(bots.map((x) => x.id === b.id ? { ...x, status: x.status === "running" ? "stopped" : "running" } : x))}
                variant={b.status === "running" ? "outline" : "brand"}
                className="w-full mt-4"
              >
                {b.status === "running" ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start</>}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
