import { cx } from '../utils/format';

export default function Badge({
  children,
  variant = 'primary',
  className = ''
}) {
  const variants = {
    primary: 'bg-moss/10 text-moss',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-gold/15 text-gold',
    danger: 'bg-coral/10 text-coral',
    info: 'bg-blue-100 text-blue-700',
    neutral: 'bg-ink/10 text-ink'
  };

  return (
    <span className={cx(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
