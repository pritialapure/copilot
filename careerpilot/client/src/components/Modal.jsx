import { X } from 'lucide-react';
import { useEffect } from 'react';
import { cx } from '../utils/format';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  size = 'md',
  className = ''
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={cx(
          'bg-white rounded-lg shadow-soft-lg w-full animate-slide-in',
          sizes[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ink/10">
          <h2 className="text-lg font-black text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-ink/10 rounded-md transition"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-ink/60" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-ink/10 p-6 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
