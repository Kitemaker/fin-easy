/**
 * FinEasy brand assets — logo mark, wordmark, avatar, and service icons.
 * All pure SVG, no image files needed.
 */

interface SvgProps {
  className?: string;
  size?: number;
}

/** Ascending bar-chart logo mark (20×20 viewBox) */
function LogoMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1"  y="13" width="4" height="7" rx="1"   fill="white" fillOpacity="0.65" />
      <rect x="8"  y="8"  width="4" height="12" rx="1"  fill="white" fillOpacity="0.85" />
      <rect x="15" y="2"  width="4" height="18" rx="1"  fill="white" />
      <path d="M3 13 L10 8 L17 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.45" />
    </svg>
  );
}

/** Full nav logo: gradient square + wordmark */
export function FinEasyLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim   = size === 'sm' ? 32 : size === 'lg' ? 44 : 36;
  const mark  = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;
  const text  = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg';
  const round = size === 'sm' ? 'rounded-lg' : 'rounded-xl';

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex flex-shrink-0 items-center justify-center ${round}`}
        style={{
          width: dim, height: dim,
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          boxShadow: '0 2px 8px rgba(109,40,217,0.35)',
        }}
      >
        <LogoMark size={mark} />
      </div>
      <span className={`font-bold tracking-tight text-gray-900 ${text}`}>FinEasy</span>
    </div>
  );
}

/** Small circular avatar used in chat message bubbles */
export function FinEasyAvatar({ size = 24 }: { size?: number }) {
  const mark = Math.round(size * 0.55);
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-full"
      style={{
        width: size, height: size,
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        boxShadow: '0 1px 4px rgba(109,40,217,0.3)',
      }}
    >
      <LogoMark size={mark} />
    </div>
  );
}

/* ─── Service / feature SVG icons ─── */

export function IconBank({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 10h18M5 10V6l7-3 7 3v4M9 10v11M15 10v11M9 21h6" />
    </svg>
  );
}

export function IconPiggyBank({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 9a7 7 0 1 0-13.6 2.3A4 4 0 0 0 6 18h10a4 4 0 0 0 .6-6.7" />
      <path d="M19 9h2l-1.5 3" />
      <path d="M9 13h.01M13 13h.01" />
      <path d="M10 17v2M14 17v2" />
    </svg>
  );
}

export function IconTrendUp({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

export function IconReceipt({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
      <path d="M16 8H8M16 12H8M12 16H8" />
    </svg>
  );
}

export function IconSearch({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M8 11h6M11 8v6" />
    </svg>
  );
}

export function IconMail({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

/** Map a serviceId → its SVG icon component */
export function ServiceIcon({ serviceId, className }: { serviceId: string; className?: string }) {
  switch (serviceId) {
    case 'checking': return <IconBank className={className} />;
    case 'savings':  return <IconPiggyBank className={className} />;
    case 'investments': return <IconTrendUp className={className} />;
    case 'bills':    return <IconReceipt className={className} />;
    case 'email':    return <IconMail className={className} />;
    default:         return <IconSearch className={className} />;
  }
}
