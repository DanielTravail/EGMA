import { useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../lib/auth";
import { db } from "../../lib/store";
import { BookOpen, CheckCircle2, FileText, Lock, PlayCircle, Search } from "lucide-react";
import type { AcademyLevel } from "../../lib/types";

const levelRank: Record<AcademyLevel, number> = { beginner: 1, advanced: 2, "one-on-one": 3 };

export default function Academy() {
  const { hasService, servicePlan } = useAuth();
  if (!hasService("academy")) return <Navigate to="/pricing#academy" replace />;

  const userLevel = (servicePlan("academy") as AcademyLevel) || "beginner";
  const d = db.get();
  const [q, setQ] = useState("");
  const [progress, setProgress] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem("enextrade.academy.progress") || "{}"); } catch { return {}; }
  });

  const modules = useMemo(() => d.academy
    .map((m) => ({ ...m, lessons: m.lessons.filter((l) => !q || l.title.toLowerCase().includes(q.toLowerCase())) }))
    .filter((m) => m.lessons.length > 0), [q]);

  const toggle = (id: string) => {
    const next = { ...progress, [id]: !progress[id] };
    setProgress(next);
    localStorage.setItem("enextrade.academy.progress", JSON.stringify(next));
  };

  const allLessons = d.academy.flatMap((m) => m.lessons);
  const completed = allLessons.filter((l) => progress[l.id]).length;
  const overall = Math.round((completed / allLessons.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Academy</h1>
          <p className="text-white/60 text-sm">Plan: <Badge variant="brand">{userLevel.toUpperCase()}</Badge></p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-white/40" />
          <input className="input-base pl-9" placeholder="Search lessons..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardBody>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/70">Overall progress</span>
                <span className="text-[#00E676] font-semibold">{overall}%</span>
              </div>
              <div className="h-2 bg-[#0A0A0A] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#00E676] to-[#00B85F] transition-all" style={{ width: `${overall}%` }} />
              </div>
              <div className="text-xs text-white/50 mt-2">{completed} of {allLessons.length} lessons completed</div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="space-y-4">
        {modules.map((m) => {
          const locked = levelRank[m.level] > levelRank[userLevel];
          return (
            <Card key={m.id} className={locked ? "opacity-80" : ""}>
              <CardHeader
                title={m.title}
                subtitle={m.description}
                action={<Badge variant={locked ? "warning" : "brand"}>{m.level.replace("-", " ")}</Badge>}
              />
              <CardBody className="p-0">
                <div className="divide-y divide-[#262626]">
                  {m.lessons.map((l) => {
                    const Icon = l.type === "video" ? PlayCircle : l.type === "pdf" ? FileText : BookOpen;
                    const done = progress[l.id];
                    return (
                      <div key={l.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-white/5">
                        <Icon className={`w-5 h-5 ${done ? "text-[#00E676]" : "text-white/60"}`} />
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm">{l.title}</div>
                          <div className="text-xs text-white/50">{l.duration} · {l.type.toUpperCase()}</div>
                        </div>
                        {locked ? (
                          <Link to="/pricing#academy"><Button variant="outline" size="sm"><Lock className="w-3 h-3" /> Unlock</Button></Link>
                        ) : (
                          <button onClick={() => toggle(l.id)} className="flex items-center gap-1 text-xs">
                            <CheckCircle2 className={`w-5 h-5 ${done ? "text-[#00E676]" : "text-white/30"}`} />
                            <span className={done ? "text-[#00E676]" : "text-white/60"}>{done ? "Completed" : "Mark done"}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
