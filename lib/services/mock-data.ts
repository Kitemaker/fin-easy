import demoUser from '@/data/demo-user.json';
import type { AccountBalance, Bill, BillPaymentResult, InvestmentPortfolio, SpendingAnalysis, Transaction } from '@/types';

/**
 * Demo token sets — in production these come from Auth0 Token Vault.
 * All 5 service tokens are valid for read operations.
 * Only the bills token is valid for write operations.
 */
export const DEMO_TOKENS = new Set([
  process.env.DEMO_CHECKING_TOKEN ?? 'demo_checking_token_abc123',
  process.env.DEMO_SAVINGS_TOKEN ?? 'demo_savings_token_def456',
  process.env.DEMO_INVESTMENTS_TOKEN ?? 'demo_investments_token_ghi789',
  process.env.DEMO_BILLS_TOKEN ?? 'demo_bills_token_jkl012',
  process.env.DEMO_EMAIL_TOKEN ?? 'demo_email_token_mno345',
]);

export const WRITE_TOKENS = new Set([
  process.env.DEMO_BILLS_TOKEN ?? 'demo_bills_token_jkl012',
]);

export function validateToken(token: string | null | undefined): boolean {
  if (!token) return false;
  return DEMO_TOKENS.has(token);
}

export function validateWriteToken(token: string | null | undefined): boolean {
  if (!token) return false;
  return WRITE_TOKENS.has(token);
}

export function getCheckingData(): AccountBalance {
  return demoUser.checking as AccountBalance;
}

export function getSavingsData(): AccountBalance {
  return demoUser.savings as AccountBalance;
}

export function getInvestmentPortfolio(): InvestmentPortfolio {
  return demoUser.portfolio as InvestmentPortfolio;
}

// In-memory mutable bills list (populated from demo-user.json on first access)
let billsState: Bill[] | null = null;

function initBills(): Bill[] {
  if (!billsState) {
    billsState = demoUser.bills.map((b) => ({ ...b, status: b.status as Bill['status'] }));
  }
  return billsState;
}

export function getBills(): Bill[] {
  return [...initBills()].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export function payBill(billId: string): BillPaymentResult {
  const bills = initBills();
  const bill = bills.find((b) => b.id === billId);
  if (!bill) {
    return {
      success: false,
      billId,
      billName: 'Unknown',
      amountPaid: 0,
      confirmationNumber: '',
      message: `Bill ${billId} not found`,
    };
  }
  bill.status = 'paid';
  const confirmationNumber = `CONF_${Date.now()}`;
  return {
    success: true,
    billId: bill.id,
    billName: bill.name,
    amountPaid: bill.amount,
    confirmationNumber,
    message: `Successfully paid ${bill.name} for $${bill.amount.toFixed(2)}. Confirmation: ${confirmationNumber}`,
  };
}

export function analyzeTransactions(transactions: Transaction[]): SpendingAnalysis {
  const byCategory: Record<string, number> = {};
  const merchantMap: Record<string, { total: number; count: number }> = {};
  let totalSpend = 0;

  for (const t of transactions) {
    if (t.amount < 0) {
      const abs = Math.abs(t.amount);
      totalSpend += abs;
      byCategory[t.category] = (byCategory[t.category] ?? 0) + abs;
      if (!merchantMap[t.merchant]) merchantMap[t.merchant] = { total: 0, count: 0 };
      merchantMap[t.merchant].total += abs;
      merchantMap[t.merchant].count += 1;
    }
  }

  const topMerchants = Object.entries(merchantMap)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 3)
    .map(([name, v]) => ({ name, total: v.total, count: v.count }));

  const anomalies = transactions
    .filter((t) => t.amount < -100 && !['Housing', 'Income'].includes(t.category))
    .map((t) => ({
      description: t.description,
      amount: Math.abs(t.amount),
      severity: (Math.abs(t.amount) > 500 ? 'high' : 'medium') as 'low' | 'medium' | 'high',
    }));

  const subPercent = (((byCategory['Subscriptions'] ?? 0) / totalSpend) * 100).toFixed(0);
  const diningPercent = (((byCategory['Dining'] ?? 0) / totalSpend) * 100).toFixed(0);

  const insights = [
    `You spent $${totalSpend.toFixed(2)} total this period.`,
    `Subscriptions account for ${subPercent}% of your spending.`,
    `Dining out accounts for ${diningPercent}% — consider meal prepping to save.`,
  ];

  return {
    period: 'Last 30 days',
    totalSpend,
    byCategory,
    topMerchants,
    anomalies,
    insights,
  };
}
