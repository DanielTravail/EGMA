export type Role = "admin" | "user";

export type ServiceKey =
  | "signals"
  | "academy"
  | "copy-trading"
  | "bot-trading"
  | "investments"
  | "mentorship";

export type SignalTier = "basic" | "standard" | "vip";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // mock only
  role: Role;
  verified: boolean;
  createdAt: string;
  avatar?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  service: ServiceKey;
  plan: string; // e.g. "basic" | "standard" | "vip" | "monthly" | etc.
  status: "active" | "pending" | "expired" | "rejected";
  startedAt: string;
  expiresAt: string;
  amount: number;
}

export type PaymentMethod = "paystack" | "bank" | "crypto";

export interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  service: ServiceKey;
  plan: string;
  amount: number;
  method: PaymentMethod;
  status: "pending" | "approved" | "rejected" | "expired";
  reference: string;
  proofUrl?: string;
  txHash?: string;
  createdAt: string;
  approvedAt?: string;
  notes?: string;
}

export type SignalStatus =
  | "active"
  | "tp1"
  | "tp2"
  | "tp3"
  | "sl"
  | "closed"
  | "expired";

export interface Signal {
  id: string;
  pair: string;
  type: "BUY" | "SELL";
  entry: number;
  tp1: number;
  tp2: number;
  tp3: number;
  sl: number;
  analysis: string;
  tier: SignalTier; // minimum tier required
  status: SignalStatus;
  postedAt: string;
  chartUrl?: string;
}

export type AcademyLevel = "beginner" | "advanced" | "one-on-one";
export type AcademyContentType = "video" | "pdf" | "article";

export interface AcademyLesson {
  id: string;
  moduleId: string;
  title: string;
  type: AcademyContentType;
  level: AcademyLevel;
  duration: string;
  description: string;
  locked?: boolean;
}

export interface AcademyModule {
  id: string;
  title: string;
  level: AcademyLevel;
  description: string;
  lessons: AcademyLesson[];
}

export interface CopyTrader {
  id: string;
  name: string;
  country: string;
  roi30d: number;
  winRate: number;
  followers: number;
  risk: "Low" | "Medium" | "High";
  copied?: boolean;
  avatar: string;
}

export interface TradingBot {
  id: string;
  name: string;
  strategy: string;
  pair: string;
  status: "running" | "stopped";
  performance: number;
  trades: number;
  subscribed?: boolean;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  monthlyRoi: number; // 6
  duration: number; // months
}

export interface UserInvestment {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  startedAt: string;
  monthsElapsed: number; // mock
  claimable: number;
  totalEarned: number;
}

export interface MentorshipSession {
  id: string;
  title: string;
  mentor: string;
  type: "group" | "one-on-one";
  date: string;
  duration: string;
  seats: number;
  booked?: boolean;
}

export interface Notification {
  id: string;
  userId: string | "all";
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  createdAt: string;
  read?: boolean;
}

export interface PaymentSettings {
  bank: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swift?: string;
    logoUrl?: string;
  };
  crypto: Array<{
    coin: string;
    network: string;
    address: string;
    qrUrl?: string;
  }>;
  instructions: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  email: string;
  subject: string;
  message: string;
  status: "open" | "in-progress" | "closed";
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target?: string;
  createdAt: string;
}
