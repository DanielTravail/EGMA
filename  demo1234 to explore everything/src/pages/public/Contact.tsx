import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { db, uid } from "../../lib/store";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const d = db.get();
    d.tickets.unshift({
      id: uid("t"),
      userId: "anon",
      email: form.email,
      subject: form.subject || "General Inquiry",
      message: `${form.name}\n\n${form.message}`,
      status: "open",
      createdAt: new Date().toISOString(),
    });
    db.set(d);
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-10">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-[#00E676] mb-3">Contact</div>
        <h1 className="text-4xl font-bold">Let's talk.</h1>
        <p className="text-white/60 mt-3">Questions about subscriptions, payments, or partnerships? Our team replies within 24 hours.</p>
        <div className="mt-8 space-y-4">
          {[
            { i: Mail, t: "support@enextrade.com" },
            { i: Phone, t: "+1 (555) 010-2024" },
            { i: MapPin, t: "Global · Remote-first" },
          ].map((c) => (
            <div key={c.t} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] flex items-center justify-center">
                <c.i className="w-5 h-5" />
              </div>
              <span className="text-white/80">{c.t}</span>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={submit} className="card p-7 space-y-4">
        {sent && <div className="rounded-lg bg-[#00E676]/10 border border-[#00E676]/30 text-[#00E676] text-sm px-4 py-3">✓ Thanks! We'll reply within 24 hours.</div>}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/60">Full name</label>
            <input required className="input-base mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-white/60">Email</label>
            <input type="email" required className="input-base mt-1" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="text-xs text-white/60">Subject</label>
          <input className="input-base mt-1" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-white/60">Message</label>
          <textarea required rows={5} className="input-base mt-1" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <Button type="submit" className="w-full">Send Message <Send className="w-4 h-4" /></Button>
      </form>
    </div>
  );
}
