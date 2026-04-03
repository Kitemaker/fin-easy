'use client';

import { useState, useCallback } from 'react';
import { ChatInterface } from '@/components/chat/chat-interface';
import { ConnectionsPanel } from '@/components/connections/connections-panel';
import { FinEasyLogo } from '@/components/ui/logo';
import type { AuditLogEntry } from '@/types';

const SERVICE_NAMES: Record<string, string> = {
  getAccountBalance: 'Account Balance',
  getTransactions: 'Transactions',
  analyzeSpending: 'Spending Analysis',
  getInvestmentPortfolio: 'Investment Portfolio',
  getBills: 'Bills',
  payBill: 'Bill Payment',
  sendSpendingAlert: 'Email Alert',
};

const SERVICE_TOKENS: Record<string, string> = {
  getAccountBalance: 'demo_che****abc123',
  getTransactions: 'demo_che****abc123',
  analyzeSpending: 'demo_che****abc123',
  getInvestmentPortfolio: 'demo_inv****ghi789',
  getBills: 'demo_bil****jkl012',
  payBill: 'demo_bil****jkl012',
  sendSpendingAlert: 'demo_eml****mno345',
};

interface User {
  name?: string;
  email?: string;
  picture?: string;
  [key: string]: unknown;
}

export function DashboardClient({ user }: { user: User }) {
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToolCall = useCallback((toolName: string, success: boolean) => {
    setAuditLog((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
        service: toolName as AuditLogEntry['service'],
        action: SERVICE_NAMES[toolName] ?? toolName,
        tokenPreview: SERVICE_TOKENS[toolName] ?? 'unknown',
        success,
      },
    ]);
  }, []);

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="flex h-screen flex-col" style={{ background: '#f8fafc' }}>
      {/* Top nav */}
      <header className="flex h-14 items-center justify-between px-4" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded-lg p-1.5 hover:bg-gray-100"
            style={{ color: '#64748b' }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <FinEasyLogo size="sm" />
          <span className="hidden rounded-full px-2.5 py-0.5 text-xs font-medium sm:block" style={{ background: '#f3f0ff', border: '1px solid #c4b5fd', color: '#7c3aed' }}>
            Auth0 Token Vault
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/dashboard/connections"
            className="hidden rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-gray-100 sm:block"
            style={{ color: '#475569' }}
          >
            Connections
          </a>
          <a
            href="/dashboard/help"
            className="hidden rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-gray-100 sm:block"
            style={{ color: '#475569' }}
          >
            Help
          </a>
          <div className="hidden items-center gap-2 sm:flex">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name ?? 'User'}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                {initials}
              </div>
            )}
            <div className="flex flex-col leading-tight">
              {user.name && <span className="text-sm font-medium" style={{ color: '#0f172a' }}>{user.name}</span>}
              {user.email && <span className="text-xs" style={{ color: '#94a3b8' }}>{user.email}</span>}
            </div>
          </div>
          <a
            href="/auth/logout"
            className="rounded-lg px-3 py-1.5 text-xs hover:bg-gray-100"
            style={{ border: '1px solid #e2e8f0', color: '#475569' }}
          >
            Logout
          </a>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-72 flex-shrink-0 overflow-y-auto" style={{ background: '#f1f5f9', borderRight: '1px solid #e2e8f0' }}>
            <ConnectionsPanel auditLog={auditLog} />
          </aside>
        )}

        {/* Chat */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <ChatInterface onToolCall={handleToolCall} userName={user.name ?? user.email} />
        </main>
      </div>
    </div>
  );
}
