import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { useAuth } from "../../lib/auth";
import { db } from "../../lib/store";
import { Bell, Check } from "lucide-react";

export default function Notifications() {
  const { user } = useAuth();
  const [version, setVersion] = useState(0);
  const notifs = useMemo(() => {
    const d = db.get();
    return d.notifications.filter((n) => n.userId === user!.id || n.userId === "all").sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [user, version]);

  const markAll = () => {
    const d = db.get();
    d.notifications.forEach((n) => {
      if (n.userId === user!.id || n.userId === "all") n.read = true;
    });
    db.set(d);
    setVersion((v) => v + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-white/60 text-sm">{notifs.length} total</p>
        </div>
        <Button variant="outline" onClick={markAll}><Check className="w-4 h-4" /> Mark all read</Button>
      </div>

      <Card>
        <CardHeader title="Inbox" />
        <CardBody className="p-0">
          {notifs.length === 0 ? (
            <EmptyState icon={<Bell className="w-6 h-6" />} title="No notifications" />
          ) : (
            <div className="divide-y divide-[#262626]">
              {notifs.map((n) => (
                <div key={n.id} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${n.read ? "bg-white/20" : "bg-[#00E676]"}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{n.title}</span>
                        <Badge variant={n.type === "success" ? "brand" : n.type === "warning" ? "warning" : n.type === "alert" ? "danger" : "info"}>{n.type}</Badge>
                      </div>
                      <div className="text-sm text-white/70 mt-1">{n.message}</div>
                      <div className="text-xs text-white/40 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
