
const features = [
  {
    icon: '🏦',
    title: 'Checking Account',
    description: 'Monitor your balance and recent transactions. Get instant insight into daily spending.',
    service: 'Checking',
    badge: null,
  },
  {
    icon: '💰',
    title: 'Savings Account',
    description: 'Track your savings balance and progress toward financial goals.',
    service: 'Savings',
    badge: null,
  },
  {
    icon: '📈',
    title: 'Investment Portfolio',
    description: 'View positions, performance, and allocation across stocks and ETFs.',
    service: 'Investments',
    badge: 'read-only',
  },
  {
    icon: '📋',
    title: 'Bill Payment',
    description: 'View upcoming bills and pay them directly from the chat. Never miss a due date.',
    service: 'Bills',
    badge: 'write',
  },
  {
    icon: '🔍',
    title: 'Spending Analysis',
    description: 'Categorize transactions, flag anomalies, and surface actionable insights.',
    service: 'Analysis',
    badge: null,
  },
  {
    icon: '📧',
    title: 'Email Alerts',
    description: 'Receive spending alerts and payment confirmations directly in your inbox.',
    service: 'Email',
    badge: null,
  },
];

const steps = [
  { num: '01', title: 'Login with Auth0', desc: 'Secure authentication — your identity is verified before anything else.' },
  { num: '02', title: 'Connect Your Accounts', desc: 'Choose which financial services the agent can access. Each gets its own secure token.' },
  { num: '03', title: 'Ask in Plain English', desc: '"What bills are due this month?" — the agent handles the rest.' },
  { num: '04', title: 'Stay in Control', desc: 'Review every action in the audit log. Revoke access to any service instantly.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-[#1e3a5f] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-lg font-bold text-white">
              F
            </div>
            <span className="text-lg font-semibold text-white">FinEasy</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-emerald-400 bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300 sm:block">
              Powered by Auth0 Token Vault
            </span>
            <a
              href="/auth/login"
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#1e3a5f] px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Auth0 for AI Agents — Hackathon Project
          </div>
          <h1 className="mt-4 text-5xl font-bold tracking-tight text-white">
            Your AI finance agent,{' '}
            <span className="text-emerald-400">authorized to act</span>
          </h1>
          <p className="mt-6 text-lg text-blue-200">
            FinEasy uses Auth0 Token Vault to hold per-service credentials — so your AI agent
            can pay bills, monitor accounts, and analyze spending, while you stay in complete
            control of exactly what it can access and when.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="/auth/login"
              className="rounded-xl bg-emerald-500 px-6 py-3 font-medium text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
            >
              Try the Demo →
            </a>
          </div>
        </div>
      </section>

      {/* Security Callout */}
      <section className="bg-[#0f2847] px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">Security First</p>
          <h2 className="mt-3 text-3xl font-bold">The agent only does what you authorize</h2>
          <p className="mt-4 text-blue-200">
            Built on Auth0 Token Vault — your service credentials are never stored in the app.
            The agent fetches tokens at runtime, only for services you have connected, only when
            it needs them. Revoke any service with one click.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: '🔑',
                title: 'Per-Service Tokens',
                desc: 'Each financial service gets its own isolated token stored in Auth0 Token Vault',
              },
              {
                icon: '📊',
                title: 'Read vs. Write Scopes',
                desc: 'Bills service can pay on your behalf. Investments service is read-only — cannot trade or modify your portfolio.',
              },
              {
                icon: '⚡',
                title: 'Instant Revocation',
                desc: 'Disconnect any service immediately. The agent loses access in real time.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
                <div className="mb-3 text-3xl">{item.icon}</div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-blue-200">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">What FinEasy can do for you</h2>
            <p className="mt-2 text-gray-500">Connect the services you want, skip the rest</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className={`rounded-xl border p-5 transition hover:shadow-sm ${
                  f.badge === 'write'
                    ? 'border-emerald-200 hover:border-emerald-300'
                    : 'border-gray-200 hover:border-emerald-200'
                }`}
              >
                <div className="mb-3 text-3xl">{f.icon}</div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{f.title}</h3>
                  {f.badge === 'read-only' && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                      Read Only
                    </span>
                  )}
                  {f.badge === 'write' && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                      Write Scope
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-gray-500">{f.description}</p>
                <span className="mt-3 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {f.service}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1e3a5f] font-mono text-sm font-bold text-white">
                  {step.num}
                </div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo user callout */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-lg">
          <h2 className="text-3xl font-bold text-gray-900">Ready to try it?</h2>
          <p className="mt-3 text-gray-500">
            Demo user: Jordan Chen · Software Engineer, SF · Chase + Robinhood · $32K portfolio
          </p>
          <a
            href="/auth/login"
            className="mt-6 inline-block rounded-xl bg-emerald-500 px-8 py-3 font-medium text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-600"
          >
            Launch FinEasy →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-400">
        <p>
          Built for the{' '}
          <a href="https://authorizedtoact.devpost.com/" className="text-emerald-600 hover:underline">
            Auth0 Authorized to Act Hackathon
          </a>{' '}
          · Powered by Auth0 Token Vault + Claude AI + Next.js
        </p>
      </footer>
    </div>
  );
}
