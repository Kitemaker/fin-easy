'use client';

import type { DynamicToolUIPart, ToolUIPart } from 'ai';
import { InvestmentPortfolioChart } from './investment-portfolio-chart';

const SERVICE_META: Record<string, { icon: string; name: string }> = {
  getAccountBalance: { icon: '🏦', name: 'Account Balance' },
  getTransactions: { icon: '📄', name: 'Transactions' },
  analyzeSpending: { icon: '🔍', name: 'Spending Analysis' },
  getInvestmentPortfolio: { icon: '📈', name: 'Investment Portfolio' },
  getBills: { icon: '📋', name: 'Bills' },
  payBill: { icon: '💳', name: 'Bill Payment' },
  sendSpendingAlert: { icon: '📧', name: 'Email Alert' },
};

type AnyToolPart = ToolUIPart | DynamicToolUIPart;

interface ToolInvocationCardProps {
  toolName: string;
  part: AnyToolPart;
}

type NotAuthorizedResult = {
  error: 'NOT_AUTHORIZED';
  service: string;
  message: string;
  connectUrl: string;
};

function getSuccessSummary(toolName: string, output: unknown): string {
  if (toolName === 'getAccountBalance') {
    const balance =
      output != null &&
      typeof output === 'object' &&
      typeof (output as Record<string, unknown>).balance === 'number'
        ? (output as Record<string, unknown>).balance
        : null;
    return balance !== null
      ? `Balance: $${(balance as number).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
      : 'Balance retrieved';
  }
  if (toolName === 'getTransactions') {
    const txns =
      output != null &&
      typeof output === 'object' &&
      Array.isArray((output as Record<string, unknown>).transactions)
        ? ((output as Record<string, unknown>).transactions as unknown[]).length
        : null;
    return txns !== null ? `${txns} transaction${txns !== 1 ? 's' : ''} retrieved` : 'Transactions retrieved';
  }
  if (toolName === 'analyzeSpending') {
    const anomalies =
      output != null &&
      typeof output === 'object' &&
      Array.isArray((output as Record<string, unknown>).anomalies)
        ? ((output as Record<string, unknown>).anomalies as unknown[]).length
        : null;
    return anomalies !== null
      ? `Analysis complete — ${anomalies} anomal${anomalies !== 1 ? 'ies' : 'y'} detected`
      : 'Spending analysis complete';
  }
  if (toolName === 'getInvestmentPortfolio') {
    const total =
      output != null &&
      typeof output === 'object' &&
      typeof (output as Record<string, unknown>).totalValue === 'number'
        ? (output as Record<string, unknown>).totalValue
        : null;
    return total !== null
      ? `Portfolio value: $${(total as number).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
      : 'Portfolio retrieved';
  }
  if (toolName === 'getBills') {
    const bills =
      output != null &&
      typeof output === 'object' &&
      Array.isArray((output as Record<string, unknown>).bills)
        ? ((output as Record<string, unknown>).bills as unknown[]).length
        : null;
    return bills !== null ? `${bills} bill${bills !== 1 ? 's' : ''} retrieved` : 'Bills retrieved';
  }
  if (toolName === 'payBill') {
    const conf =
      output != null &&
      typeof output === 'object' &&
      typeof (output as Record<string, unknown>).confirmationNumber === 'string'
        ? (output as Record<string, unknown>).confirmationNumber
        : null;
    return conf !== null ? `Paid — conf. ${conf}` : 'Payment processed';
  }
  if (toolName === 'sendSpendingAlert') return 'Alert sent';
  return 'Completed';
}

export function ToolInvocationCard({ toolName, part }: ToolInvocationCardProps) {
  const meta = SERVICE_META[toolName] ?? { icon: '🔧', name: toolName };

  const state = part.state;
  const isLoading = state === 'input-streaming' || state === 'input-available';
  const hasOutput = state === 'output-available';
  const output = hasOutput ? (part as { output: unknown }).output : null;

  const notAuth =
    output != null &&
    typeof output === 'object' &&
    (output as Record<string, unknown>).error === 'NOT_AUTHORIZED'
      ? (output as NotAuthorizedResult)
      : null;

  const isSuccess = hasOutput && !notAuth;

  const inputRaw = (part as Record<string, unknown>).input;
  const inputEntries: [string, string][] =
    inputRaw != null && typeof inputRaw === 'object'
      ? Object.entries(inputRaw as Record<string, unknown>)
          .filter(([, v]) => v !== undefined && v !== null && v !== '')
          .map(([k, v]) => [k, String(v)])
      : [];

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <div className="my-1 flex items-center gap-2 rounded-full border border-gray-200 bg-emerald-50 px-3 py-1.5 text-sm animate-pulse w-fit">
        <span>{meta.icon}</span>
        <span className="font-medium text-gray-600">{meta.name}</span>
        <span className="text-gray-400">•</span>
        <span className="text-xs text-gray-500">Fetching token from Auth0 Token Vault...</span>
        <span className="flex items-end gap-0.5 pb-0.5">
          <span
            className="inline-block h-1 w-1 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="inline-block h-1 w-1 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="inline-block h-1 w-1 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </span>
      </div>
    );
  }

  /* ── NOT_AUTHORIZED state ── */
  if (notAuth) {
    return (
      <div className="my-1 rounded-lg border border-l-4 border-red-200 border-l-red-500 bg-red-50 px-3 py-2 text-sm">
        <div className="flex items-center gap-2">
          <span>{meta.icon}</span>
          <span className="font-medium text-gray-700">{meta.name}</span>
          <span className="font-medium text-red-600">✗</span>
          <span className="text-red-600">Not authorized</span>
        </div>
        <div className="mt-1 text-xs text-red-500">
          <a
            href={notAuth.connectUrl}
            className="underline hover:no-underline"
          >
            Connect {meta.name} to continue →
          </a>
        </div>
      </div>
    );
  }

  /* ── Success state ── */
  if (isSuccess) {
    const summary = getSuccessSummary(toolName, output);
    const isPayBill = toolName === 'payBill';
    const isPortfolio = toolName === 'getInvestmentPortfolio';

    return (
      <div className="my-1">
        {/* Status pill */}
        <div className="rounded-lg border border-l-4 border-emerald-200 border-l-emerald-500 bg-emerald-50 px-3 py-2 text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span>{meta.icon}</span>
            <span className="font-medium text-gray-700">{meta.name}</span>
            <span className="font-medium text-emerald-600">✓</span>
            <span className="text-emerald-700">{summary}</span>
            {isPayBill && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                Write scope
              </span>
            )}
          </div>
          {inputEntries.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {inputEntries.map(([k, v]) => (
                <span
                  key={k}
                  className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500"
                >
                  <span className="font-medium text-gray-600">{k}:</span> {v}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Inline portfolio chart */}
        {isPortfolio && output != null && typeof output === 'object' &&
          'totalValue' in (output as object) && (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <InvestmentPortfolioChart data={output as any} />
          )}
      </div>
    );
  }

  /* ── Fallback (unknown state) ── */
  return (
    <div className="my-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
      <div className="flex items-center gap-2">
        <span>{meta.icon}</span>
        <span className="font-medium text-gray-700">{meta.name}</span>
      </div>
    </div>
  );
}
