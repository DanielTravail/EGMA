import type {
  AcademyModule,
  AuditLog,
  CopyTrader,
  InvestmentPlan,
  MentorshipSession,
  Notification,
  PaymentSettings,
  Signal,
  Subscription,
  SupportTicket,
  TradingBot,
  Transaction,
  User,
  UserInvestment,
} from "./types";

/**
 * Lightweight local persistence layer simulating a backend.
 * Designed so it can be swapped for Supabase/Prisma calls with minimal change:
 * each function returns Promises and uses simple keys.
 */

const KEY = "enextrade.v1";

interface DB {
  users: User[];
  subscriptions: Subscription[];
  transactions: Transaction[];
  signals: Signal[];
  academy: AcademyModule[];
  copyTraders: CopyTrader[];
  bots: TradingBot[];
  plans: InvestmentPlan[];
  investments: UserInvestment[];
  mentorship: MentorshipSession[];
  notifications: Notification[];
  tickets: SupportTicket[];
  audit: AuditLog[];
  paymentSettings: PaymentSettings;
  session?: { userId: string };
}

const seed = (): DB => ({
  users: [
    {
      id: "u_admin",
      name: "Platform Admin",
      email: "admin@enextrade.com",
      password: "admin123",
      role: "admin",
      verified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "u_demo",
      name: "Demo Trader",
      email: "demo@enextrade.com",
      password: "demo1234",
      role: "user",
      verified: true,
      createdAt: new Date().toISOString(),
    },
  ],
  subscriptions: [
    {
      id: "s_demo_1",
      userId: "u_demo",
      service: "signals",
      plan: "vip",
      status: "active",
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
      amount: 500,
    },
    {
      id: "s_demo_2",
      userId: "u_demo",
      service: "academy",
      plan: "beginner",
      status: "active",
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
      amount: 199,
    },
    {
      id: "s_demo_3",
      userId: "u_demo",
      service: "investments",
      plan: "starter",
      status: "active",
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
      amount: 0,
    },
  ],
  transactions: [
    {
      id: "t_1",
      userId: "u_demo",
      userEmail: "demo@enextrade.com",
      service: "signals",
      plan: "vip",
      amount: 500,
      method: "bank",
      status: "approved",
      reference: "ENX-100001",
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      approvedAt: new Date(Date.now() - 29 * 86400000).toISOString(),
    },
  ],
  signals: [
    {
      id: "sg_1",
      pair: "EUR/USD",
      type: "BUY",
      entry: 1.085,
      tp1: 1.088,
      tp2: 1.092,
      tp3: 1.095,
      sl: 1.082,
      analysis:
        "Price respecting demand zone at 1.0840 with bullish RSI divergence on H1. Looking for continuation into the New York session.",
      tier: "basic",
      status: "tp1",
      postedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      id: "sg_2",
      pair: "GBP/JPY",
      type: "SELL",
      entry: 195.4,
      tp1: 194.9,
      tp2: 194.3,
      tp3: 193.6,
      sl: 195.95,
      analysis:
        "Rejection at H4 supply, bearish engulfing close. Watching for momentum break below 195.10.",
      tier: "standard",
      status: "active",
      postedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    },
    {
      id: "sg_3",
      pair: "XAU/USD",
      type: "BUY",
      entry: 2032,
      tp1: 2040,
      tp2: 2050,
      tp3: 2065,
      sl: 2024,
      analysis: "Gold accumulation pattern, DXY weakening into FOMC week. VIP setup.",
      tier: "vip",
      status: "active",
      postedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
      id: "sg_4",
      pair: "USD/JPY",
      type: "SELL",
      entry: 149.8,
      tp1: 149.3,
      tp2: 148.7,
      tp3: 148.0,
      sl: 150.3,
      analysis: "Lower highs on H4, BOJ intervention risk.",
      tier: "basic",
      status: "tp2",
      postedAt: new Date(Date.now() - 26 * 3600000).toISOString(),
    },
    {
      id: "sg_5",
      pair: "AUD/USD",
      type: "BUY",
      entry: 0.658,
      tp1: 0.661,
      tp2: 0.664,
      tp3: 0.668,
      sl: 0.6555,
      analysis: "Risk-on flows, commodity bid.",
      tier: "standard",
      status: "sl",
      postedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    },
  ],
  academy: [
    {
      id: "m_1",
      title: "Forex Foundations",
      level: "beginner",
      description: "Master the core building blocks of the forex market.",
      lessons: [
        { id: "l_1", moduleId: "m_1", title: "What is Forex?", type: "video", level: "beginner", duration: "12:30", description: "Intro to the global FX market." },
        { id: "l_2", moduleId: "m_1", title: "Major, Minor & Exotic Pairs", type: "article", level: "beginner", duration: "6 min read", description: "Understanding currency pair classes." },
        { id: "l_3", moduleId: "m_1", title: "Forex Starter PDF", type: "pdf", level: "beginner", duration: "24 pages", description: "Downloadable beginner workbook." },
      ],
    },
    {
      id: "m_2",
      title: "Technical Analysis Mastery",
      level: "advanced",
      description: "Smart money concepts, order blocks, liquidity & ICT models.",
      lessons: [
        { id: "l_4", moduleId: "m_2", title: "Market Structure", type: "video", level: "advanced", duration: "28:14", description: "HH, HL, LH, LL framework." },
        { id: "l_5", moduleId: "m_2", title: "Liquidity & Order Blocks", type: "video", level: "advanced", duration: "41:02", description: "Institutional zones." },
        { id: "l_6", moduleId: "m_2", title: "Risk Management Playbook", type: "pdf", level: "advanced", duration: "48 pages", description: "Pro money management." },
      ],
    },
    {
      id: "m_3",
      title: "One-on-One Coaching Track",
      level: "one-on-one",
      description: "Personalized roadmap with a senior mentor.",
      lessons: [
        { id: "l_7", moduleId: "m_3", title: "Discovery Call", type: "video", level: "one-on-one", duration: "45:00", description: "Diagnostic + goal setting." },
        { id: "l_8", moduleId: "m_3", title: "Custom Trading Plan", type: "pdf", level: "one-on-one", duration: "Tailored", description: "Built for your schedule and risk." },
      ],
    },
  ],
  copyTraders: [
    { id: "ct_1", name: "Marcus Vega", country: "🇬🇧 UK", roi30d: 18.4, winRate: 71, followers: 1284, risk: "Medium", avatar: "MV" },
    { id: "ct_2", name: "Sofia Lin", country: "🇸🇬 SG", roi30d: 24.9, winRate: 66, followers: 980, risk: "High", avatar: "SL" },
    { id: "ct_3", name: "Anita Okafor", country: "🇳🇬 NG", roi30d: 11.2, winRate: 78, followers: 2210, risk: "Low", avatar: "AO" },
    { id: "ct_4", name: "Diego Souza", country: "🇧🇷 BR", roi30d: 15.7, winRate: 69, followers: 754, risk: "Medium", avatar: "DS" },
  ],
  bots: [
    { id: "b_1", name: "Apex Scalper", strategy: "Scalping", pair: "EUR/USD", status: "running", performance: 12.6, trades: 184 },
    { id: "b_2", name: "Trend Hunter", strategy: "Trend Following", pair: "XAU/USD", status: "running", performance: 22.4, trades: 64 },
    { id: "b_3", name: "Grid Master", strategy: "Grid", pair: "GBP/USD", status: "stopped", performance: 7.1, trades: 312 },
  ],
  plans: [
    { id: "p_starter", name: "Starter", minAmount: 100, maxAmount: 999, monthlyRoi: 6, duration: 12 },
    { id: "p_growth", name: "Growth", minAmount: 1000, maxAmount: 9999, monthlyRoi: 6, duration: 12 },
    { id: "p_pro", name: "Pro Capital", minAmount: 10000, maxAmount: 100000, monthlyRoi: 6, duration: 12 },
  ],
  investments: [
    {
      id: "iv_1",
      userId: "u_demo",
      planId: "p_starter",
      amount: 500,
      startedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      monthsElapsed: 1,
      claimable: 30,
      totalEarned: 30,
    },
  ],
  mentorship: [
    { id: "ms_1", title: "Weekly Market Outlook", mentor: "Coach Alex", type: "group", date: new Date(Date.now() + 2 * 86400000).toISOString(), duration: "60 min", seats: 40 },
    { id: "ms_2", title: "Psychology of Winning Traders", mentor: "Coach Lena", type: "group", date: new Date(Date.now() + 5 * 86400000).toISOString(), duration: "45 min", seats: 25 },
    { id: "ms_3", title: "1-on-1 Strategy Review", mentor: "Coach Daniel", type: "one-on-one", date: new Date(Date.now() + 7 * 86400000).toISOString(), duration: "60 min", seats: 1 },
  ],
  notifications: [
    { id: "n_1", userId: "u_demo", title: "Welcome to Enextrade", message: "Your VIP Signal Room is now active.", type: "success", createdAt: new Date().toISOString() },
    { id: "n_2", userId: "all", title: "Scheduled Maintenance", message: "Brief maintenance window on Sunday 02:00 UTC.", type: "info", createdAt: new Date().toISOString() },
  ],
  tickets: [],
  audit: [
    { id: "a_1", actor: "admin@enextrade.com", action: "Approved transaction ENX-100001", createdAt: new Date().toISOString() },
  ],
  paymentSettings: {
    bank: {
      bankName: "Zenith Bank",
      accountName: "Enextrade Global Market Ltd",
      accountNumber: "0123456789",
      swift: "ZEIBNGLA",
    },
    crypto: [
      { coin: "USDT", network: "TRC20", address: "TXYZabc1234567890DemoWalletAddress" },
      { coin: "BTC", network: "Bitcoin", address: "bc1qexampleenextradedemowalletxxxxxx" },
      { coin: "ETH", network: "ERC20", address: "0xExampleEnextradeDemoWalletAddress00" },
    ],
    instructions:
      "After payment, upload your proof of payment (screenshot or transaction hash). Subscriptions are activated within 1–6 hours after manual verification.",
  },
});

function load(): DB {
  if (typeof window === "undefined") return seed();
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const fresh = seed();
    localStorage.setItem(KEY, JSON.stringify(fresh));
    return fresh;
  }
  try {
    return JSON.parse(raw) as DB;
  } catch {
    const fresh = seed();
    localStorage.setItem(KEY, JSON.stringify(fresh));
    return fresh;
  }
}

function save(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db));
  // notify listeners
  window.dispatchEvent(new CustomEvent("enextrade:update"));
}

export const db = {
  get: load,
  set: save,
  reset: () => save(seed()),
};

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`;
}
