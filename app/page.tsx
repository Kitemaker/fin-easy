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
  { num: '01', title: 'Login with Auth0', desc: 'Secure authentication — identity verified before anything else.' },
  { num: '02', title: 'Connect Your Accounts', desc: 'Grant access per service. Each gets its own isolated token.' },
  { num: '03', title: 'Ask in Plain English', desc: '"What bills are due this month?" — FinEasy handles the rest.' },
  { num: '04', title: 'Stay in Control', desc: 'Audit every action. Revoke any service instantly.' },
];

const stats = [
  { value: '$32K', label: 'Demo portfolio' },
  { value: '5', label: 'Connected services' },
  { value: '7', label: 'Agent tools' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8fafc', color: '#0f172a' }}>

      {/* Nav */}
      <nav className="border-b px-6 py-4" style={{ borderColor: '#e2e8f0', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
              F
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ color: '#0f172a' }}>FinEasy</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full px-3 py-1 text-xs font-medium sm:block" style={{ background: '#f3f0ff', border: '1px solid #c4b5fd', color: '#7c3aed' }}>
              Powered by Auth0 Token Vault
            </span>
            <a
              href="/auth/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        {/* Grid background */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2" style={{ width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm" style={{ background: '#f3f0ff', border: '1px solid #c4b5fd', color: '#7c3aed' }}>
            <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: '#8b5cf6' }} />
            Auth0 for AI Agents — Hackathon Project
          </div>

          <h1 className="mt-4 text-6xl font-bold tracking-tight" style={{ color: '#0f172a' }}>
            Finance, on{' '}
            <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              your terms
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: '#475569' }}>
            FinEasy is an AI agent that monitors your accounts, analyzes spending, and pays bills
            — backed by <strong style={{ color: '#0f172a' }}>Auth0 Token Vault</strong> so every service
            operates with its own isolated, revocable token.
          </p>

          {/* Stats row */}
          <div className="mt-10 flex items-center justify-center gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#0f172a' }}>{s.value}</div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href="/auth/login"
              className="rounded-xl px-7 py-3.5 font-semibold text-white transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', boxShadow: '0 4px 24px rgba(139,92,246,0.25)' }}
            >
              Try the Demo →
            </a>
            <a
              href="#how-it-works"
              className="rounded-xl px-7 py-3.5 font-semibold transition hover:opacity-80"
              style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#475569', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Ticker bar */}
      <div className="border-y px-6 py-3" style={{ borderColor: '#e2e8f0', background: '#f1f5f9' }}>
        <div className="mx-auto flex max-w-6xl items-center gap-8 overflow-x-auto font-mono text-xs">
          {[
            { label: 'CHECKING', value: '$4,247.83', change: '+$6,500', up: true },
            { label: 'SAVINGS', value: '$18,500.00', change: '+$500', up: true },
            { label: 'PORTFOLIO', value: '$32,450.00', change: '+15.34%', up: true },
            { label: 'BILLS DUE', value: '$2,573.47', change: '5 pending', up: null },
            { label: 'SPENDING', value: '$3,201.10', change: 'this month', up: null },
          ].map((t) => (
            <div key={t.label} className="flex shrink-0 items-center gap-2">
              <span style={{ color: '#94a3b8' }}>{t.label}</span>
              <span className="font-semibold" style={{ color: '#0f172a' }}>{t.value}</span>
              <span style={{ color: t.up === true ? '#059669' : t.up === false ? '#dc2626' : '#64748b' }}>{t.change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security Callout */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-3 text-center text-xs font-semibold uppercase tracking-widest" style={{ color: '#8b5cf6' }}>Security Model</div>
          <h2 className="mb-4 text-center text-3xl font-bold" style={{ color: '#0f172a' }}>The agent only does what you authorize</h2>
          <p className="mb-12 text-center text-sm" style={{ color: '#64748b' }}>
            Built on Auth0 Token Vault — credentials never touch the app. Tokens are fetched at runtime, per service, per action.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: '🔑', title: 'Per-Service Tokens', desc: 'Each financial service gets its own isolated token — a breach of one never exposes the others.', accent: '#8b5cf6', bg: '#f3f0ff', border: '#c4b5fd' },
              { icon: '📊', title: 'Read vs. Write Scopes', desc: 'Bills service has write scope to pay on your behalf. Investments is read-only — the agent cannot trade.', accent: '#d97706', bg: '#fffbeb', border: '#fcd34d' },
              { icon: '⚡', title: 'Instant Revocation', desc: 'One click removes a service token from the vault. The agent loses access in real time.', accent: '#059669', bg: '#ecfdf5', border: '#6ee7b7' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-xl" style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                  {item.icon}
                </div>
                <h3 className="mb-2 font-semibold" style={{ color: '#0f172a' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16" style={{ background: '#f1f5f9' }}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold" style={{ color: '#0f172a' }}>What FinEasy can do</h2>
            <p className="mt-2 text-sm" style={{ color: '#64748b' }}>Connect only the services you trust</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl p-5 transition-all"
                style={{
                  background: f.badge === 'write' ? '#fffbeb' : '#ffffff',
                  border: f.badge === 'write' ? '1px solid #fcd34d' : '1px solid #e2e8f0',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                <div className="mb-3 text-3xl">{f.icon}</div>
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="font-semibold" style={{ color: '#0f172a' }}>{f.title}</h3>
                  {f.badge === 'read-only' && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#ede9fe', color: '#6d28d9' }}>
                      Read Only
                    </span>
                  )}
                  {f.badge === 'write' && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#fef3c7', color: '#b45309' }}>
                      Write Scope
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{f.description}</p>
                <span className="mt-3 inline-block rounded-full px-2 py-0.5 text-xs" style={{ background: '#f1f5f9', color: '#94a3b8' }}>
                  {f.service}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-20" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold" style={{ color: '#0f172a' }}>How it works</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+24px)] top-6 hidden h-px w-[calc(100%-48px)] lg:block" style={{ background: 'linear-gradient(90deg, #c4b5fd, transparent)' }} />
                )}
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl font-mono text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                  {step.num}
                </div>
                <h3 className="mb-1.5 font-semibold" style={{ color: '#0f172a' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-lg">
          <div className="mb-3 font-mono text-xs" style={{ color: '#94a3b8' }}>DEMO USER</div>
          <div className="mb-2 text-2xl font-bold" style={{ color: '#0f172a' }}>Jordan Chen</div>
          <div className="mb-1 text-sm" style={{ color: '#475569' }}>Software Engineer · San Francisco</div>
          <div className="mb-8 text-sm" style={{ color: '#94a3b8' }}>Chase Checking + Savings · Robinhood $32K portfolio · 5 monthly bills</div>
          <a
            href="/auth/login"
            className="inline-block rounded-xl px-10 py-4 font-semibold text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', boxShadow: '0 4px 24px rgba(139,92,246,0.25)' }}
          >
            Launch FinEasy →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-sm" style={{ borderTop: '1px solid #e2e8f0', background: '#f8fafc', color: '#94a3b8' }}>
        <p>
          Built for the{' '}
          <a href="https://authorizedtoact.devpost.com/" className="hover:underline" style={{ color: '#8b5cf6' }}>
            Auth0 Authorized to Act Hackathon
          </a>{' '}
          · Powered by Auth0 Token Vault + OpenAI + Next.js
        </p>
      </footer>
    </div>
  );
}
