import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../lib/auth";
import { db } from "../../lib/store";
import { Calendar, Clock, User } from "lucide-react";

export default function Mentorship() {
  const { hasService, servicePlan } = useAuth();
  if (!hasService("mentorship")) return <Navigate to="/pricing#mentorship" replace />;
  const plan = servicePlan("mentorship");
  const sessions = db.get().mentorship;
  const [booked, setBooked] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mentorship</h1>
        <p className="text-white/60 text-sm">Plan: <Badge variant="brand">{(plan || "group").toUpperCase()}</Badge></p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((s) => {
          const locked = s.type === "one-on-one" && plan !== "private";
          const isBooked = booked[s.id];
          return (
            <Card key={s.id}>
              <CardHeader title={s.title} subtitle={`with ${s.mentor}`} action={<Badge variant={s.type === "one-on-one" ? "info" : "neutral"}>{s.type}</Badge>} />
              <CardBody className="space-y-3">
                <div className="text-sm text-white/70 flex items-center gap-2"><Calendar className="w-4 h-4 text-[#00E676]" /> {new Date(s.date).toLocaleString()}</div>
                <div className="text-sm text-white/70 flex items-center gap-2"><Clock className="w-4 h-4 text-[#00E676]" /> {s.duration}</div>
                <div className="text-sm text-white/70 flex items-center gap-2"><User className="w-4 h-4 text-[#00E676]" /> {s.seats} seat(s) available</div>
                {locked ? (
                  <Button variant="outline" className="w-full">Upgrade to access</Button>
                ) : (
                  <Button onClick={() => setBooked({ ...booked, [s.id]: !isBooked })} variant={isBooked ? "outline" : "brand"} className="w-full">
                    {isBooked ? "Cancel booking" : "Reserve seat"}
                  </Button>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
