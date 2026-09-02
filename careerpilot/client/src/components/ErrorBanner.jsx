import { AlertCircle, X } from 'lucide-react';
import { cx } from '../utils/format';

export default function ErrorBanner({
  message,
  onClose,
  variant = 'error',
  dismissible = true
}) {
  const variants = {
    error: 'bg-coral/10 border-coral/30 text-coral',
    warning: 'bg-gold/15 border-gold/30 text-gold',
    info: 'bg-blue-100 border-blue-300 text-blue-700'
  };

  return (
    <div className={cx(
      'animate-fade-in rounded-lg border p-4 flex items-start gap-3 mb-6',
      variants[variant]
    )}>
      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-semibold">{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={onClose}
          className="text-current hover:opacity-70 transition ml-auto"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
