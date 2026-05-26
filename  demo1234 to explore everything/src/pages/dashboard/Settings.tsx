import { useState } from "react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../lib/auth";
import { db } from "../../lib/store";
import { Save } from "lucide-react";

export default function Settings() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState(user!.name);
  const [email, setEmail] = useState(user!.email);
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const save = () => {
    const d = db.get();
    const u = d.users.find((x) => x.id === user!.id)!;
    u.name = name;
    u.email = email;
    if (pwd.length >= 6) u.password = pwd;
    db.set(d);
    refresh();
    setMsg("Profile updated.");
    setTimeout(() => setMsg(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-white/60 text-sm">Manage your profile, security and preferences.</p>
      </div>

      <Card>
        <CardHeader title="Profile" />
        <CardBody className="space-y-4">
          {msg && <div className="text-[#00E676] text-sm bg-[#00E676]/10 border border-[#00E676]/30 rounded-lg px-3 py-2">{msg}</div>}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/60">Full name</label>
              <input className="input-base mt-1" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-white/60">Email</label>
              <input className="input-base mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs text-white/60">New password (optional)</label>
            <input className="input-base mt-1" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Leave blank to keep current" />
          </div>
          <Button onClick={save}><Save className="w-4 h-4" /> Save changes</Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Security" />
        <CardBody className="space-y-3 text-sm">
          <Row k="Two-Factor Auth" v="Coming soon" />
          <Row k="Sessions" v="1 active (this device)" />
          <Row k="Login history" v="View" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Preferences" />
        <CardBody className="space-y-3 text-sm">
          <label className="flex items-center justify-between">
            <span>Email signal alerts</span>
            <input type="checkbox" defaultChecked className="accent-[#00E676] w-4 h-4" />
          </label>
          <label className="flex items-center justify-between">
            <span>Subscription expiry reminders</span>
            <input type="checkbox" defaultChecked className="accent-[#00E676] w-4 h-4" />
          </label>
          <label className="flex items-center justify-between">
            <span>Marketing updates</span>
            <input type="checkbox" className="accent-[#00E676] w-4 h-4" />
          </label>
        </CardBody>
      </Card>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#262626] last:border-0">
      <span className="text-white/70">{k}</span>
      <span className="text-white">{v}</span>
    </div>
  );
}
