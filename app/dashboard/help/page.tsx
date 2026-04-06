import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="min-h-full overflow-y-auto bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* Back link */}
        <div>
          <Link href="/dashboard" className="text-sm text-emerald-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">How to use FinEasy</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your AI-powered finance agent — here&apos;s everything you need to get started.
          </p>
        </div>

        {/* Getting Started */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Getting started</h2>

          {[
            {
              num: '01',
              title: 'Create an account or log in',
              body: 'Click "Get started" on the home page. You will be redirected to Auth0\'s Universal Login — sign up with your email or log in with an existing account. Auth0 handles all authentication securely.',
              tip: null,
            },
            {
              num: '02',
              title: 'Land on your dashboard',
              body: 'After logging in you are taken straight to your personal dashboard. Your session is secured by Auth0 — no passwords are stored in FinEasy.',
              tip: null,
            },
            {
              num: '03',
              title: 'Connect your financial services',
              body: 'Open the left sidebar and click Connect next to each service you want FinEasy to access. Each service gets its own secure token stored in Auth0 Token Vault — the agent can only use services you have explicitly authorised.',
              tip: 'You can revoke any service at any time. FinEasy immediately loses access.',
            },
            {
              num: '04',
              title: 'Ask in plain English',
              body: 'Type your question or request in the chat box at the bottom. FinEasy understands natural language — no special commands needed.',
              tip: null,
            },
            {
              num: '05',
              title: 'Review what the agent does',
              body: 'Every tool call FinEasy makes is recorded in the Audit Log at the bottom of the sidebar. You can see which service was accessed, which token was used, and whether it succeeded.',
              tip: null,
            },
          ].map((step) => (
            <div key={step.num} className="flex gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1e3a5f] font-mono text-sm font-bold text-white">
                {step.num}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{step.body}</p>
                {step.tip && (
                  <p className="mt-2 text-xs text-emerald-600">💡 {step.tip}</p>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Example Questions */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Example questions to ask</h2>
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 divide-y divide-gray-100">
            {[
              { prompt: "What's my checking account balance and recent transactions?", note: 'Reads your checking account balance and fetches recent transactions' },
              { prompt: 'Analyze my spending this month', note: 'Categorizes transactions and flags unusual spending' },
              { prompt: "What bills do I have coming up?", note: 'Lists upcoming bills with due dates and amounts' },
              { prompt: 'Show me my investment portfolio', note: 'Reads positions, performance, and allocation (read-only)' },
              { prompt: 'Pay my Netflix bill', note: 'Uses write scope to pay the specified bill — shows confirmation number' },
              { prompt: 'Send me a spending summary email', note: 'Sends a spending summary to your email address' },
            ].map((item) => (
              <div key={item.prompt} className="px-5 py-3.5">
                <p className="text-sm font-medium text-gray-800">&ldquo;{item.prompt}&rdquo;</p>
                <p className="mt-0.5 text-xs text-gray-400">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Available Services */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Available services</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { icon: '🏦', name: 'Checking Account', desc: 'Balance, available funds, and recent transactions from your checking account.' },
              { icon: '💰', name: 'Savings Account', desc: 'Savings balance and progress toward financial goals.' },
              { icon: '📈', name: 'Investment Portfolio', desc: 'Positions, performance, and allocation across stocks and ETFs. Read-only.' },
              { icon: '📋', name: 'Bills', desc: 'View upcoming bills and pay them on your behalf. Write-enabled.' },
              { icon: '📧', name: 'Email Alerts', desc: 'Spending alerts and payment confirmations sent to your inbox.' },
            ].map((s) => (
              <div key={s.name} className="flex gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Read vs. Write Scopes */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Read vs. Write Scopes</h2>
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 divide-y divide-gray-100">
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Read</span>
                <p className="text-sm font-semibold text-gray-800">Checking, Savings, Investments, Email</p>
              </div>
              <p className="text-xs text-gray-500">
                Read-only services can view and retrieve your data, but cannot take any actions on your behalf.
                The investments service in particular <strong>cannot execute trades or modify your portfolio</strong> — it can only read positions and performance data.
              </p>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Write</span>
                <p className="text-sm font-semibold text-gray-800">Bills</p>
              </div>
              <p className="text-xs text-gray-500">
                The bills service has write scope — FinEasy can pay bills on your behalf when you ask it to.
                You will always see the tool call in the audit log before and after the payment is made.
                Revoke the bills service at any time to remove this capability immediately.
              </p>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="rounded-xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
          <h2 className="font-semibold text-emerald-900">🔒 How your data stays secure</h2>
          <ul className="mt-3 space-y-2 text-sm text-emerald-800">
            <li>• Service tokens are stored in <strong>Auth0 Token Vault</strong> — never in the app or the browser.</li>
            <li>• The agent fetches a token only at the moment it needs to call a service.</li>
            <li>• Revoking a service removes its token instantly — the agent cannot access it again until you reconnect.</li>
            <li>• Every action is logged in the Audit Log so you always know what was accessed.</li>
            <li>• The investments service is strictly read-only — it cannot trade or modify your portfolio under any circumstances.</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
