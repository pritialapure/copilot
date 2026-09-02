import { cx } from '../utils/format';

export default function MetricCard({
  title,
  value,
  icon: Icon = null,
  color = 'primary',
  trend = null,
  trendLabel = null
}) {
  const colorSchemes = {
    primary: 'from-moss/20 to-moss/10 border-moss/30',
    success: 'from-emerald-100 to-emerald-50 border-emerald-200',
    warning: 'from-gold/20 to-gold/10 border-gold/30',
    danger: 'from-coral/20 to-coral/10 border-coral/30',
    info: 'from-blue-100 to-blue-50 border-blue-200'
  };

  const textColors = {
    primary: 'text-moss',
    success: 'text-emerald-700',
    warning: 'text-gold',
    danger: 'text-coral',
    info: 'text-blue-700'
  };

  return (
    <div className={cx(
      'bg-gradient-to-br rounded-lg shadow-soft p-6 border animate-fade-in',
      colorSchemes[color]
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cx('text-sm font-semibold mb-1', textColors[color])}>
            {title}
          </p>
          <p className={cx('text-3xl font-black', textColors[color])}>
            {value}
          </p>
          {trendLabel && (
            <p className={cx('text-xs mt-2 font-semibold', trend > 0 ? 'text-emerald-600' : 'text-coral')}>
              {trend > 0 ? '↑' : '↓'} {trendLabel}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cx('p-3 rounded-lg', `${textColors[color]}/10`)}>
            <Icon className={cx('w-6 h-6', textColors[color])} />
          </div>
        )}
      </div>
    </div>
  );
}
