import { cx } from '../utils/format';

export default function Card({
  children,
  className = '',
  hover = false,
  ...props
}) {
  return (
    <div
      className={cx(
        'bg-white rounded-lg shadow-soft border border-ink/10 p-6',
        hover && 'hover:shadow-soft-lg transition-shadow cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
