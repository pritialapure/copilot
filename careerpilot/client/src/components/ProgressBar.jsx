import { cx } from '../utils/format';

export default function ProgressBar({
  progress = 0,
  showLabel = true,
  color = 'moss',
  className = '',
  animated = true
}) {
  const colorMap = {
    moss: 'bg-moss',
    gold: 'bg-gold',
    coral: 'bg-coral',
    emerald: 'bg-emerald-500'
  };

  return (
    <div className={cx('w-full', className)}>
      <div className="w-full h-2 bg-ink/10 rounded-full overflow-hidden">
        <div
          className={cx(
            'h-full rounded-full transition-all duration-500',
            colorMap[color],
            animated && 'animate-pulse-soft'
          )}
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
      {showLabel && (
        <p className="text-xs font-semibold text-ink/60 mt-1">
          {Math.round(progress)}% Complete
        </p>
      )}
    </div>
  );
}
