import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';
import { cx } from '../utils/format';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info
};

const colorMap = {
  success: 'bg-emerald-100 border-emerald-300 text-emerald-700',
  error: 'bg-coral/10 border-coral/30 text-coral',
  info: 'bg-blue-100 border-blue-300 text-blue-700'
};

export default function Toast({
  message,
  type = 'info',
  duration = 4000,
  onClose
}) {
  const Icon = iconMap[type] || Info;

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={cx(
      'flex items-center gap-3 px-4 py-3 rounded-lg border animate-slide-in',
      colorMap[type]
    )}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-semibold flex-1">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:opacity-70 transition"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
