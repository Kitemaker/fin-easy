import { tool } from 'ai';
import { z } from 'zod';
import { getServiceToken } from './token-vault';
import { sendSpendingAlert as sendAlert, sendBillPaymentConfirmation } from './services/resend';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

function notAuthorized(service: string, serviceId: string) {
  return {
    error: 'NOT_AUTHORIZED' as const,
    service,
    serviceId,
    message: `You haven't connected your ${service} yet. FinEasy needs your authorization to access it.`,
    connectUrl: '/dashboard/connections',
  };
}

async function fetchMockService(path: string, token: string, options: RequestInit = {}) {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
}

export function createAgentTools(userId: string, userEmail?: string, userName?: string) {
  return {
    getAccountBalance: tool({
      description: 'Get current balance and recent transactions for checking or savings account',
      inputSchema: z.object({
        accountType: z.enum(['checking', 'savings']).describe('Which account to check'),
      }),
      execute: async ({ accountType }) => {
        const token = await getServiceToken(userId, accountType as 'checking' | 'savings');
        if (!token)
          return notAuthorized(
            accountType === 'checking' ? 'Checking Account' : 'Savings Account',
            accountType
          );
        const res = await fetchMockService(`/api/mock/${accountType}`, token);
        if (!res.ok) return notAuthorized(accountType, accountType);
        return res.json();
      },
    }),

    getTransactions: tool({
      description: 'Get detailed transaction history with categories from checking account',
      inputSchema: z.object({
        limit: z.number().optional().default(20),
        category: z.string().optional(),
      }),
      execute: async ({ limit, category }) => {
        const token = await getServiceToken(userId, 'checking');
        if (!token) return notAuthorized('Checking Account', 'checking');
        const res = await fetchMockService('/api/mock/checking', token);
        if (!res.ok) return notAuthorized('Checking Account', 'checking');
        const data = await res.json();
        let txns = data.recentTransactions ?? [];
        if (category)
          txns = txns.filter((t: { category: string }) =>
            t.category.toLowerCase().includes(category.toLowerCase())
          );
        return { transactions: txns.slice(0, limit), total: txns.length };
      },
    }),

    analyzeSpending: tool({
      description: 'Analyze spending patterns, categorize transactions, and flag unusual activity',
      inputSchema: z.object({}),
      execute: async () => {
        const token = await getServiceToken(userId, 'checking');
        if (!token) return notAuthorized('Checking Account', 'checking');
        const res = await fetchMockService('/api/mock/checking', token);
        if (!res.ok) return notAuthorized('Checking Account', 'checking');
        const data = await res.json();
        const transactions = data.recentTransactions ?? [];

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
          .map(([name, v]) => ({ name, ...v }));

        const anomalies = transactions
          .filter(
            (t: { amount: number; category: string; description: string }) =>
              t.amount < -100 && !['Housing', 'Income'].includes(t.category)
          )
          .map((t: { description: string; amount: number }) => ({
            description: t.description,
            amount: Math.abs(t.amount),
            severity: (Math.abs(t.amount) > 500 ? 'high' : 'medium') as 'medium' | 'high',
          }));

        const subPercent = (((byCategory['Subscriptions'] ?? 0) / totalSpend) * 100).toFixed(0);
        const diningPercent = (((byCategory['Dining'] ?? 0) / totalSpend) * 100).toFixed(0);
        const insights = [
          `You spent $${totalSpend.toFixed(2)} total this period.`,
          `Subscriptions account for ${subPercent}% of your spending.`,
          `Dining out accounts for ${diningPercent}% — consider meal prepping to save.`,
        ];

        return { period: 'Last 30 days', totalSpend, byCategory, topMerchants, anomalies, insights };
      },
    }),

    getInvestmentPortfolio: tool({
      description:
        'View Robinhood investment portfolio: positions, performance, allocation. Read-only — cannot trade.',
      inputSchema: z.object({}),
      execute: async () => {
        const token = await getServiceToken(userId, 'investments');
        if (!token) return notAuthorized('Investment Portfolio', 'investments');
        const res = await fetchMockService('/api/mock/investments', token);
        if (!res.ok) return notAuthorized('Investment Portfolio', 'investments');
        return res.json();
      },
    }),

    getBills: tool({
      description: 'Get all upcoming bills and their payment status',
      inputSchema: z.object({}),
      execute: async () => {
        const token = await getServiceToken(userId, 'bills');
        if (!token) return notAuthorized('Bill Payment', 'bills');
        const res = await fetchMockService('/api/mock/bills', token);
        if (!res.ok) return notAuthorized('Bill Payment', 'bills');
        return res.json();
      },
    }),

    payBill: tool({
      description:
        'Pay a specific bill. ALWAYS state the bill name and amount and get explicit user confirmation before calling this tool.',
      inputSchema: z.object({
        billId: z.string().describe('The bill ID from getBills'),
        sendConfirmationEmail: z.boolean().optional().default(true),
      }),
      execute: async ({ billId, sendConfirmationEmail }) => {
        const token = await getServiceToken(userId, 'bills');
        if (!token) return notAuthorized('Bill Payment', 'bills');
        const res = await fetchMockService('/api/mock/bills', token, {
          method: 'POST',
          body: JSON.stringify({ billId }),
        });
        if (!res.ok) return notAuthorized('Bill Payment', 'bills');
        const { result } = await res.json();
        let emailSent = false;
        if (sendConfirmationEmail) {
          const emailToken = await getServiceToken(userId, 'email');
          if (emailToken && userEmail) {
            const bill = {
              id: billId,
              name: result.billName,
              amount: result.amountPaid,
              dueDate: '',
              status: 'paid' as const,
              category: '',
              autopay: false,
            };
            const emailResult = await sendBillPaymentConfirmation(
              userEmail,
              userName ?? 'there',
              bill,
              result.confirmationNumber
            );
            emailSent = emailResult.success;
          }
        }
        return { ...result, emailSent };
      },
    }),

    sendSpendingAlert: tool({
      description:
        'Send an email alert about spending patterns, anomalies, or a financial summary',
      inputSchema: z.object({
        subject: z.string(),
        message: z.string(),
      }),
      execute: async ({ subject, message }) => {
        const token = await getServiceToken(userId, 'email');
        if (!token) return notAuthorized('Email Alerts', 'email');
        if (userEmail) {
          return sendAlert(userEmail, userName ?? 'there', subject, message);
        }
        return { success: true, message: `Alert queued: "${subject}"` };
      },
    }),
  };
}
