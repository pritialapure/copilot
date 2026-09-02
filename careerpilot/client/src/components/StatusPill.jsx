import { cx } from '../utils/format';
import { getStatusColor } from '../utils/format';

export default function StatusPill({ status, className = '' }) {
  const statusLabels = {
    SAVED: '📌 Saved',
    PREPARING: '✍️ Preparing',
    APPLIED: '✅ Applied',
    INTERVIEW: '🎯 Interview',
    OFFER: '🎉 Offer',
    REJECTED: '❌ Rejected'
  };

  return (
    <span className={cx(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
      getStatusColor(status),
      className
    )}>
      {statusLabels[status] || status}
    </span>
  );
}
