export function formatDate(dateString) {
  if (!dateString) return 'Not set';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Invalid date';
  }
}

export function formatDateWithTime(dateString) {
  if (!dateString) return 'Not set';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Invalid date';
  }
}

export function formatRelativeTime(dateString) {
  if (!dateString) return 'Never';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return 'Invalid date';
  }
}

export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function getMatchScoreColor(score) {
  if (score >= 80) return 'bg-emerald-100 text-emerald-700';
  if (score >= 60) return 'bg-blue-100 text-blue-700';
  if (score >= 40) return 'bg-gold/15 text-gold';
  return 'bg-coral/10 text-coral';
}

export function getMatchScoreBgColor(score) {
  if (score >= 80) return 'bg-emerald-50';
  if (score >= 60) return 'bg-blue-50';
  if (score >= 40) return 'bg-amber-50';
  return 'bg-red-50';
}

export function getStatusColor(status) {
  const colors = {
    SAVED: 'bg-ink/10 text-ink',
    PREPARING: 'bg-gold/15 text-gold',
    APPLIED: 'bg-moss/10 text-moss',
    INTERVIEW: 'bg-blue-100 text-blue-700',
    OFFER: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-coral/10 text-coral'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function truncate(str, maxLength = 100) {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}
