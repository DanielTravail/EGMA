import type { ServiceKey } from "./types";

export interface ServiceMeta {
  key: ServiceKey;
  name: string;
  short: string;
  description: string;
  path: string; // dashboard path
  icon: string; // lucide icon name
  color: string;
  plans: Array<{ key: string; name: string; price: number; period: string; perks: string[] }>;
}

export const SERVICES: ServiceMeta[] = [
  {
    key: "signals",
    name: "Signal Room",
    short: "Premium Forex Signals",
    description: "Real-time, professionally analyzed forex signals across tiered access levels.",
    path: "/dashboard/signals",
    icon: "Radio",
    color: "from-emerald-500/20 to-emerald-500/0",
    plans: [
      { key: "basic", name: "Basic", price: 100, period: "/year", perks: ["3–5 signals / week", "Email alerts", "Signal history"] },
      { key: "standard", name: "Standard", price: 250, period: "/year", perks: ["8–12 signals / week", "Live chart snapshots", "Priority alerts"] },
      { key: "vip", name: "VIP", price: 500, period: "/year", perks: ["All signals", "Direct mentor access", "VIP-only setups"] },
    ],
  },
  {
    key: "academy",
    name: "Academy",
    short: "Trading Academy",
    description: "Structured curriculum from beginner to advanced & 1-on-1 coaching.",
    path: "/dashboard/academy",
    icon: "GraduationCap",
    color: "from-cyan-500/20 to-cyan-500/0",
    plans: [
      { key: "beginner", name: "Beginner", price: 199, period: "/year", perks: ["Forex foundations", "PDF library", "Quizzes"] },
      { key: "advanced", name: "Advanced", price: 399, period: "/year", perks: ["Smart money concepts", "Pro strategies", "Live workshops"] },
      { key: "one-on-one", name: "One-on-One", price: 999, period: "/year", perks: ["Personal mentor", "Custom roadmap", "Weekly reviews"] },
    ],
  },
  {
    key: "copy-trading",
    name: "Copy Trading",
    short: "Mirror Top Traders",
    description: "Browse verified traders and mirror their strategies (demo MVP).",
    path: "/dashboard/copy-trading",
    icon: "Copy",
    color: "from-violet-500/20 to-violet-500/0",
    plans: [
      { key: "monthly", name: "Monthly", price: 49, period: "/month", perks: ["Copy up to 3 traders", "Performance analytics", "Risk controls"] },
      { key: "yearly", name: "Yearly", price: 449, period: "/year", perks: ["Unlimited traders", "Priority allocation", "VIP support"] },
    ],
  },
  {
    key: "bot-trading",
    name: "Bot Trading",
    short: "Automated Strategies",
    description: "Curated trading bots with transparent performance metrics.",
    path: "/dashboard/bot-trading",
    icon: "Bot",
    color: "from-amber-500/20 to-amber-500/0",
    plans: [
      { key: "monthly", name: "Bot Access", price: 79, period: "/month", perks: ["3 active bots", "Backtest reports", "Slack/email alerts"] },
      { key: "yearly", name: "Bot Pro", price: 699, period: "/year", perks: ["Unlimited bots", "Custom strategy builder", "Priority compute"] },
    ],
  },
  {
    key: "investments",
    name: "Investment Plans",
    short: "Managed ROI",
    description: "Capital-managed investment plans with predictable monthly ROI.",
    path: "/dashboard/investments",
    icon: "Wallet",
    color: "from-pink-500/20 to-pink-500/0",
    plans: [
      { key: "starter", name: "Starter", price: 100, period: " min", perks: ["6% monthly ROI", "12-month term", "Claimable monthly"] },
      { key: "growth", name: "Growth", price: 1000, period: " min", perks: ["6% monthly ROI", "Priority claim", "Dedicated manager"] },
      { key: "pro", name: "Pro Capital", price: 10000, period: " min", perks: ["6% monthly ROI", "VIP reporting", "Custom strategy"] },
    ],
  },
  {
    key: "mentorship",
    name: "Mentorship",
    short: "Group & 1-on-1",
    description: "Live group sessions and personal mentorship with senior coaches.",
    path: "/dashboard/mentorship",
    icon: "Users",
    color: "from-blue-500/20 to-blue-500/0",
    plans: [
      { key: "group", name: "Group", price: 149, period: "/year", perks: ["Weekly group calls", "Replay library", "Community access"] },
      { key: "private", name: "One-on-One", price: 1499, period: "/year", perks: ["Personal mentor", "Direct messaging", "Tailored curriculum"] },
    ],
  },
];

export function getService(key: ServiceKey) {
  return SERVICES.find((s) => s.key === key)!;
}
