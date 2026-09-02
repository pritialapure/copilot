import { cx } from '../utils/format';

export default function Field({
  label,
  type = 'text',
  placeholder,
  error,
  required = false,
  className = '',
  icon: Icon = null,
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-ink mb-2">
          {label}
          {required && <span className="text-coral ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 w-4 h-4 text-ink/50" />}
        <input
          type={type}
          placeholder={placeholder}
          className={cx(
            'w-full px-4 py-2 rounded-md border transition-all',
            Icon ? 'pl-10' : '',
            error
              ? 'border-coral/50 bg-coral/5 text-coral focus:border-coral focus:ring-coral/20'
              : 'border-ink/20 bg-white text-ink focus:border-moss focus:ring-moss/20',
            'focus:outline-none focus:ring-2',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-xs font-semibold text-coral">{error}</p>
      )}
    </div>
  );
}
