'use client';

import { useState } from 'react';
import type { ConnectedService } from '@/types';

interface ServiceCardProps {
  service: ConnectedService;
  onConnect: (serviceId: string) => Promise<void>;
  onRevoke: (serviceId: string) => Promise<void>;
}

const SERVICE_SCOPES: Record<string, string[]> = {
  checking: [
    'Read checking account balance',
    'View recent transactions',
    'Access account details',
    'View available balance',
  ],
  savings: [
    'Read savings account balance',
    'View transaction history',
    'Access account details',
  ],
  investments: [
    'Read investment portfolio positions',
    'View performance and returns',
    'Access asset allocation data',
    '⛔ Cannot execute trades or modify portfolio',
  ],
  bills: [
    'View upcoming and overdue bills',
    'Read bill amounts and due dates',
    'Pay bills on your behalf',
  ],
  email: [
    'Send spending alerts to your email',
    'Send payment confirmations on your behalf',
  ],
};

export function ServiceCard({ service, onConnect, onRevoke }: ServiceCardProps) {
  const [loading, setLoading] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  const scopes = SERVICE_SCOPES[service.id] ?? [];
  const isWrite = service.scope === 'write';

  function handleConnectClick() {
    setShowConsent(true);
  }

  function handleCancel() {
    setShowConsent(false);
  }

  async function handleAuthorize() {
    setLoading(true);
    await onConnect(service.id);
    setLoading(false);
    setShowConsent(false);
  }

  async function handleRevoke() {
    setLoading(true);
    await onRevoke(service.id);
    setLoading(false);
  }

  return (
    <div
      className={`rounded-xl border transition-all ${
        service.connected
          ? 'border-emerald-200 bg-emerald-50/50'
          : showConsent
          ? 'border-gray-300 bg-white'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      {/* Service info row */}
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-xl ${
              service.connected ? 'bg-emerald-100' : 'bg-gray-100'
            }`}
          >
            {service.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-900">{service.name}</span>
              {service.connected && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Connected
                </span>
              )}
              {isWrite ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                  Write
                </span>
              ) : (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                  Read
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-gray-500">{service.description}</p>
            {service.connected && service.tokenPreview && (
              <p className="mt-1 font-mono text-xs text-gray-400">
                Token: {service.tokenPreview}
              </p>
            )}
            {service.connected && service.connectedAt && (
              <p className="mt-0.5 text-xs text-gray-400">
                Since {new Date(service.connectedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          {service.connected ? (
            <button
              onClick={handleRevoke}
              disabled={loading}
              className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              {loading ? 'Revoking...' : 'Revoke'}
            </button>
          ) : (
            <button
              onClick={handleConnectClick}
              disabled={loading || showConsent}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              Connect
            </button>
          )}
        </div>
      </div>

      {/* Inline OAuth consent panel */}
      {showConsent && !service.connected && (
        <div className="mx-4 mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          {/* Panel header */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900">
              {service.icon} {service.name} wants access to your account
            </h3>
            <span className="flex-shrink-0 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
              OAuth 2.0 Authorization
            </span>
          </div>

          {/* Scopes list */}
          {scopes.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {scopes.map((scope) => (
                <li key={scope} className="flex items-start gap-2 text-xs text-gray-700">
                  <span
                    className={`mt-0.5 flex-shrink-0 font-bold ${
                      scope.startsWith('⛔') ? 'text-red-500' : 'text-emerald-600'
                    }`}
                  >
                    {scope.startsWith('⛔') ? '' : '✓'}
                  </span>
                  <span className={scope.startsWith('⛔') ? 'text-red-600 font-medium' : ''}>
                    {scope}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Bills write scope warning */}
          {service.id === 'bills' && (
            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
              ⚠️ This service can pay bills on your behalf. Every payment will be recorded in the audit log.
            </div>
          )}

          {/* Footer note */}
          <p className="mt-3 rounded-md border border-gray-200 bg-white px-3 py-2 text-[11px] text-gray-500">
            🔒 Secured by Auth0 Token Vault — tokens are never stored in this app
          </p>

          {/* Action buttons */}
          <div className="mt-3 flex flex-col gap-2">
            <button
              onClick={handleAuthorize}
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Authorizing...' : 'Authorize Access'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="w-full py-1.5 text-xs text-gray-500 transition hover:text-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
