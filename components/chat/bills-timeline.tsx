'use client';

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'upcoming' | 'overdue' | 'paid';
  category: string;
  autopay: boolean;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Housing:       { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e' },
  Utilities:     { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
  Subscriptions: { bg: '#fdf4ff', text: '#7e22ce', dot: '#a855f7' },
  Insurance:     { bg: '#fff7ed', text: '#c2410c', dot: '#f97316' },
  Internet:      { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
  default:       { bg: '#f8fafc', text: '#475569', dot: '#94a3b8' },
};

function categoryStyle(cat: string) {
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.default;
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

function urgencyLabel(days: number, status: string) {
  if (status === 'paid')    return { label: 'Paid',     cls: 'bg-gray-100 text-gray-500' };
  if (status === 'overdue') return { label: 'Overdue',  cls: 'bg-red-100 text-red-600' };
  if (days === 0)           return { label: 'Due today',cls: 'bg-red-100 text-red-600' };
  if (days <= 3)            return { label: `${days}d`,  cls: 'bg-red-50 text-red-500' };
  if (days <= 7)            return { label: `${days}d`,  cls: 'bg-amber-50 text-amber-600' };
  return { label: `${days}d`, cls: 'bg-gray-100 text-gray-500' };
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function BillsTimeline({ bills }: { bills: Bill[] }) {
  const sorted = [...bills].sort((a, b) => {
    // overdue first, then by date
    if (a.status === 'overdue' && b.status !== 'overdue') return -1;
    if (b.status === 'overdue' && a.status !== 'overdue') return 1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const total    = sorted.reduce((s, b) => s + (b.status !== 'paid' ? b.amount : 0), 0);
  const overdue  = sorted.filter((b) => b.status === 'overdue').length;
  const autopay  = sorted.filter((b) => b.autopay && b.status !== 'paid').length;
  const upcoming = sorted.filter((b) => b.status === 'upcoming').length;

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Total Due</p>
          <p className="text-xl font-bold text-gray-900">${fmt(total)}</p>
        </div>
        <div className="flex gap-3 text-center">
          {overdue > 0 && (
            <div>
              <p className="text-lg font-bold text-red-600">{overdue}</p>
              <p className="text-[10px] text-gray-400">Overdue</p>
            </div>
          )}
          <div>
            <p className="text-lg font-bold text-gray-800">{upcoming}</p>
            <p className="text-[10px] text-gray-400">Upcoming</p>
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-600">{autopay}</p>
            <p className="text-[10px] text-gray-400">Autopay</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative px-4 py-3">
        {/* Vertical line */}
        <div className="absolute left-[27px] top-3 bottom-3 w-px bg-gray-100" />

        <div className="flex flex-col gap-0">
          {sorted.map((bill, i) => {
            const days  = daysUntil(bill.dueDate);
            const urg   = urgencyLabel(days, bill.status);
            const style = categoryStyle(bill.category);
            const isPaid    = bill.status === 'paid';
            const isOverdue = bill.status === 'overdue';

            return (
              <div key={bill.id} className={`relative flex items-start gap-3 py-2.5 ${i !== sorted.length - 1 ? '' : ''}`}>

                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white"
                    style={{
                      background: isPaid ? '#f1f5f9' : isOverdue ? '#fef2f2' : style.bg,
                      boxShadow: `0 0 0 2px ${isPaid ? '#e2e8f0' : isOverdue ? '#fca5a5' : style.dot}`,
                    }}
                  >
                    {isPaid ? (
                      <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : isOverdue ? (
                      <svg className="h-3.5 w-3.5 text-red-500" viewBox="0 0 16 16" fill="none">
                        <path d="M8 5v4M8 11h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <div className="h-2 w-2 rounded-full" style={{ background: style.dot }} />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className={`flex flex-1 items-center justify-between gap-3 rounded-lg px-3 py-2 ${
                  isPaid    ? 'bg-gray-50 opacity-60' :
                  isOverdue ? 'bg-red-50 border border-red-100' :
                  'bg-white border border-gray-100'
                }`}>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold ${isPaid ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {bill.name}
                      </span>
                      {bill.autopay && !isPaid && (
                        <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-600 border border-emerald-100">
                          Autopay
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span
                        className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                        style={{ background: style.bg, color: style.text }}
                      >
                        {bill.category}
                      </span>
                      <span className="text-[10px] text-gray-400">{fmtDate(bill.dueDate)}</span>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${urg.cls}`}>
                      {urg.label}
                    </span>
                    <span className={`text-sm font-bold tabular-nums ${isPaid ? 'text-gray-400' : isOverdue ? 'text-red-700' : 'text-gray-800'}`}>
                      ${fmt(bill.amount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">
          {sorted.length} bill{sorted.length !== 1 ? 's' : ''} · ask FinEasy to pay any bill for you
        </span>
        <span className="text-[10px] text-amber-600 font-medium">
          💳 Payments require confirmation
        </span>
      </div>
    </div>
  );
}
