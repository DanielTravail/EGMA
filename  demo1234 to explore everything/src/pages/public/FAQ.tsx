import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How do subscriptions work?", a: "Each service has its own subscription. You can subscribe to one or several services independently — your dashboard updates automatically based on what's active." },
  { q: "Which payment methods are supported?", a: "Paystack (card, bank, transfer), direct manual bank transfer (with proof upload), and crypto (USDT, BTC, ETH with transaction hash verification)." },
  { q: "Is Signal Room billed monthly?", a: "No. Signal Room is annual-only: Basic $100/year, Standard $250/year, VIP $500/year." },
  { q: "How is the 6% monthly ROI delivered?", a: "Investment plans accrue 6% monthly. You can claim each month from your investment dashboard once unlocked." },
  { q: "How long does manual payment verification take?", a: "Approvals typically take 1–6 hours during business hours. You'll be notified instantly via in-app & email once approved." },
  { q: "Can I get a refund?", a: "Subscriptions are non-refundable once activated. Please review service descriptions and risk disclaimer before subscribing." },
  { q: "Is my data secure?", a: "We use secure auth sessions, encrypted storage, audit-logged admin actions and never share your data with third parties." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-xs uppercase tracking-[0.2em] text-[#00E676] mb-3">FAQ</div>
      <h1 className="text-4xl lg:text-5xl font-bold">Frequently asked questions</h1>
      <div className="mt-10 space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="card overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between text-left px-5 py-4 hover:bg-white/5">
              <span className="font-medium">{f.q}</span>
              <ChevronDown className={`w-5 h-5 text-[#00E676] transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <div className="px-5 pb-5 text-white/70 text-sm border-t border-[#262626] pt-4">{f.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
