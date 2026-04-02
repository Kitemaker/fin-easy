/**
 * Token Vault — manages per-service OAuth tokens for the AI agent
 *
 * Uses Auth0 Management API to store and retrieve third-party service tokens.
 * Each connected service has its own token that the agent must present when
 * calling that service. Users can revoke tokens at any time.
 *
 * Architecture:
 * - Mock services (checking, savings, investments, bills, email) use demo tokens stored in Auth0 user metadata
 * - All tokens are fetched at agent tool execution time — never stored client-side
 */

import type { ServiceId, ConnectedService, FinancialService } from '@/types';

export const FINANCIAL_SERVICES: FinancialService[] = [
  {
    id: 'checking',
    name: 'Checking Account',
    description: 'View balance and recent transactions from your Chase checking account',
    icon: '🏦',
    connection: 'mock-checking',
    scope: 'read',
    scopes: ['Read account balance', 'View transaction history', 'Access last 30 days of activity'],
  },
  {
    id: 'savings',
    name: 'Savings Account',
    description: 'View your Chase savings balance and transfer history',
    icon: '💰',
    connection: 'mock-savings',
    scope: 'read',
    scopes: ['Read savings balance', 'View transfer history'],
  },
  {
    id: 'investments',
    name: 'Investment Portfolio',
    description: 'View your Robinhood portfolio positions and performance (read-only — cannot trade)',
    icon: '📈',
    connection: 'mock-investments',
    scope: 'read',
    scopes: [
      'Read portfolio positions',
      'View performance data',
      'Access allocation breakdown',
      '⛔ Cannot execute trades or modify portfolio',
    ],
  },
  {
    id: 'bills',
    name: 'Bill Payment',
    description: 'View upcoming bills and pay them on your behalf',
    icon: '📋',
    connection: 'mock-bills',
    scope: 'write',
    scopes: ['View upcoming bills', 'Pay bills on your behalf', 'Send payment confirmations'],
  },
  {
    id: 'email',
    name: 'Email Alerts',
    description: 'Receive spending alerts, payment confirmations, and financial summaries',
    icon: '📧',
    connection: 'mock-email',
    scope: 'read',
    scopes: ['Send spending alerts to your email', 'Send bill payment confirmations'],
  },
];

/**
 * Demo token map — in production these would come from Auth0 Token Vault.
 * Stored in user metadata: app_metadata.token_vault.{ serviceId: token }
 */
const DEMO_TOKENS: Record<ServiceId, string> = {
  checking: process.env.DEMO_CHECKING_TOKEN ?? 'demo_checking_token_abc123',
  savings: process.env.DEMO_SAVINGS_TOKEN ?? 'demo_savings_token_def456',
  investments: process.env.DEMO_INVESTMENTS_TOKEN ?? 'demo_investments_token_ghi789',
  bills: process.env.DEMO_BILLS_TOKEN ?? 'demo_bills_token_jkl012',
  email: process.env.DEMO_EMAIL_TOKEN ?? 'demo_email_token_mno345',
};

async function getMgmtApiToken(): Promise<string> {
  const domain = process.env.AUTH0_DOMAIN;
  const res = await fetch(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_MGMT_CLIENT_ID,
      client_secret: process.env.AUTH0_MGMT_CLIENT_SECRET,
      audience: `https://${domain}/api/v2/`,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Failed to get Management API token: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function getUserMetadata(userId: string): Promise<Record<string, unknown>> {
  const mgmtToken = await getMgmtApiToken();
  const res = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`,
    { headers: { Authorization: `Bearer ${mgmtToken}` } }
  );
  const user = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to get user metadata: ${JSON.stringify(user)}`);
  }
  return (user.app_metadata ?? {}) as Record<string, unknown>;
}

async function updateUserMetadata(userId: string, metadata: Record<string, unknown>): Promise<void> {
  const mgmtToken = await getMgmtApiToken();
  const res = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${mgmtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ app_metadata: metadata }),
    }
  );
  if (!res.ok) {
    const body = await res.json();
    throw new Error(`Failed to update user metadata: ${JSON.stringify(body)}`);
  }
}

/**
 * Fetch a stored token for a user's connected service.
 * Returns null if the service is not connected.
 */
export async function getServiceToken(userId: string, serviceId: ServiceId): Promise<string | null> {
  const metadata = await getUserMetadata(userId);
  const vault = (metadata.token_vault ?? {}) as Record<string, { token: string; connectedAt: string }>;
  return vault[serviceId]?.token ?? null;
}

/**
 * List all connected services for a user with their connection status.
 */
export async function getConnectedServices(userId: string): Promise<ConnectedService[]> {
  const metadata = await getUserMetadata(userId);
  const vault = (metadata.token_vault ?? {}) as Record<string, { token: string; connectedAt: string }>;

  return FINANCIAL_SERVICES.map((service) => {
    const entry = vault[service.id];
    return {
      ...service,
      connected: !!entry,
      connectedAt: entry?.connectedAt,
      tokenPreview: entry ? maskToken(entry.token) : undefined,
    };
  });
}

/**
 * Connect a service — stores the demo token in the user's Token Vault.
 * In production, this would complete an OAuth flow for real service tokens.
 */
export async function connectService(userId: string, serviceId: ServiceId): Promise<void> {
  const metadata = await getUserMetadata(userId);
  const vault = (metadata.token_vault ?? {}) as Record<string, unknown>;

  vault[serviceId] = {
    token: DEMO_TOKENS[serviceId],
    connectedAt: new Date().toISOString(),
  };

  await updateUserMetadata(userId, { ...metadata, token_vault: vault });
}

/**
 * Revoke a service connection — removes the token from Token Vault.
 * The agent immediately loses access to that service.
 */
export async function revokeService(userId: string, serviceId: ServiceId): Promise<void> {
  const metadata = await getUserMetadata(userId);
  const vault = (metadata.token_vault ?? {}) as Record<string, unknown>;
  delete vault[serviceId];
  await updateUserMetadata(userId, { ...metadata, token_vault: vault });
}

function maskToken(token: string): string {
  if (token.length <= 8) return '****';
  return `${token.slice(0, 8)}****${token.slice(-4)}`;
}
