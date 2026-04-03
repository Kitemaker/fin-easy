'use client';

interface Position {
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
  assetType: string;
}

interface InvestmentPortfolio {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  positions: Position[];
  allocation: { stocks: number; etfs: number; cash: number };
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function DonutChart({ allocation }: { allocation: { stocks: number; etfs: number; cash: number } }) {
  const cx = 54, cy = 54, r = 38, strokeWidth = 18;
  const circumference = 2 * Math.PI * r;

  const segments = [
    { key: 'etfs',   value: allocation.etfs,   color: '#10b981', label: 'ETFs' },
    { key: 'stocks', value: allocation.stocks, color: '#6366f1', label: 'Stocks' },
    { key: 'cash',   value: allocation.cash,   color: '#d1d5db', label: 'Cash' },
  ];

  let cumulativeDeg = 0;

  return (
    <div className="flex items-center gap-4">
      <svg width="108" height="108" viewBox="0 0 108 108" className="flex-shrink-0">
        {/* Background track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
        {segments.map((seg) => {
          const pct = seg.value / 100;
          const dash = pct * circumference;
          const gap = circumference - dash;
          const angle = -90 + cumulativeDeg;
          cumulativeDeg += pct * 360;
          if (seg.value === 0) return null;
          return (
            <circle
              key={seg.key}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeLinecap="butt"
              transform={`rotate(${angle} ${cx} ${cy})`}
            />
          );
        })}
        {/* Center text */}
        <text x={cx} y={cy - 6} textAnchor="middle" className="text-xs" fill="#374151" fontSize="11" fontWeight="600">
          Allocation
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#6b7280" fontSize="9">
          3 assets
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-col gap-1.5">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-xs text-gray-600 w-12">{seg.label}</span>
            <span className="text-xs font-semibold text-gray-800">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GainBadge({ value, pct }: { value: number; pct: number }) {
  const positive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
        positive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
      }`}
    >
      {positive ? '▲' : '▼'} {positive ? '+' : ''}{fmt(pct)}%
    </span>
  );
}

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.min(pct, 100)}%`, background: color }}
      />
    </div>
  );
}

export function InvestmentPortfolioChart({ data }: { data: InvestmentPortfolio }) {
  const { totalValue, totalGainLoss, totalGainLossPercent, positions, allocation } = data;
  const isGain = totalGainLoss >= 0;

  const assetColor = (type: string) =>
    type === 'etf' ? '#10b981' : type === 'stock' ? '#6366f1' : '#f59e0b';

  const maxValue = Math.max(...positions.map((p) => p.totalValue));

  return (
    <div className="mt-2 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)' }}
      >
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Portfolio Value</p>
          <p className="text-2xl font-bold text-gray-900">${fmt(totalValue)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Total Return</p>
          <span
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-bold ${
              isGain ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
            }`}
          >
            {isGain ? '▲' : '▼'} {isGain ? '+' : ''}${fmt(Math.abs(totalGainLoss))}
            <span className="font-normal opacity-75">({isGain ? '+' : ''}{fmt(totalGainLossPercent)}%)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr] divide-x divide-gray-100">
        {/* Left: Donut chart */}
        <div className="p-4 flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Allocation</p>
          <DonutChart allocation={allocation} />
        </div>

        {/* Right: Positions */}
        <div className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Holdings</p>
          <div className="flex flex-col gap-3">
            {positions.map((pos) => {
              const portfolioPct = (pos.totalValue / totalValue) * 100;
              const color = assetColor(pos.assetType);
              return (
                <div key={pos.symbol}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                        style={{ background: color }}
                      >
                        {pos.symbol}
                      </span>
                      <span className="text-xs text-gray-500 truncate hidden sm:block">{pos.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <GainBadge value={pos.gainLoss} pct={pos.gainLossPercent} />
                      <span className="text-xs font-semibold text-gray-700 w-16 text-right">
                        ${fmt(pos.totalValue)}
                      </span>
                    </div>
                  </div>
                  <MiniBar pct={(pos.totalValue / maxValue) * 100} color={color} />
                  <div className="flex justify-between mt-0.5">
                    <span className="text-[10px] text-gray-400">{pos.shares} shares @ ${fmt(pos.currentPrice)}</span>
                    <span className="text-[10px] text-gray-400">{portfolioPct.toFixed(1)}% of portfolio</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-2 bg-gray-50">
        <span className="text-[10px] text-gray-400">⛔ Read-only</span>
        <span className="text-[10px] text-gray-300">•</span>
        <span className="text-[10px] text-gray-400">
          {positions.length} positions · {allocation.stocks}% stocks · {allocation.etfs}% ETFs · {allocation.cash}% cash
        </span>
      </div>
    </div>
  );
}
