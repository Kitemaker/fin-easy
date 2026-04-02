export type ServiceId = 'checking' | 'savings' | 'investments' | 'bills' | 'email';
export type ServiceScope = 'read' | 'write';

export interface FinancialService {
  id: ServiceId;
  name: string;
  description: string;
  icon: string;
  connection: string;
  scope: ServiceScope;
  scopes?: string[];
}

export interface ConnectedService extends FinancialService {
  connected: boolean;
  connectedAt?: string;
  tokenPreview?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  service: string;
  action: string;
  tokenPreview: string;
  success: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  merchant: string;
}

export interface AccountBalance {
  accountType: 'checking' | 'savings';
  bankName: string;
  accountNumberPreview: string;
  balance: number;
  availableBalance: number;
  recentTransactions: Transaction[];
}

export interface Investment {
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
  assetType: 'stock' | 'etf' | 'crypto';
}

export interface InvestmentPortfolio {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  positions: Investment[];
  allocation: { stocks: number; etfs: number; cash: number };
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'upcoming' | 'overdue' | 'paid';
  category: string;
  autopay: boolean;
}

export interface BillPaymentResult {
  success: boolean;
  billId: string;
  billName: string;
  amountPaid: number;
  confirmationNumber: string;
  message: string;
}

export interface SpendingAnalysis {
  period: string;
  totalSpend: number;
  byCategory: Record<string, number>;
  topMerchants: Array<{ name: string; total: number; count: number }>;
  anomalies: Array<{ description: string; amount: number; severity: 'low' | 'medium' | 'high' }>;
  insights: string[];
}
