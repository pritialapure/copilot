import { cx } from '../utils/format';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon = null,
  iconPosition = 'left',
  ...props
}) {
  const baseStyles = 'font-semibold rounded-md transition-all duration-200 flex items-center justify-center gap-2 focus-ring disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-moss text-white hover:bg-moss/90 active:scale-95',
    secondary: 'bg-white text-ink border border-ink/20 hover:bg-ink/5 active:scale-95',
    danger: 'bg-coral text-white hover:bg-coral/90 active:scale-95',
    ghost: 'text-ink hover:bg-ink/5 active:scale-95',
    gold: 'bg-gold text-white hover:bg-gold/90 active:scale-95'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
    icon: 'p-2'
  };

  return (
    <button
      className={cx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader className="w-4 h-4 animate-spin" />}
      {Icon && iconPosition === 'left' && !isLoading && <Icon className="w-4 h-4" />}
      {children}
      {Icon && iconPosition === 'right' && !isLoading && <Icon className="w-4 h-4" />}
    </button>
  );
}

function Loader({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
