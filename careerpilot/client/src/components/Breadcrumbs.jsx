import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cx } from '../utils/format';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="flex items-center gap-2 mb-6" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4 text-ink/40" />}
          {item.href ? (
            <Link
              to={item.href}
              className="text-sm font-semibold text-moss hover:text-moss/80 transition"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cx(
              'text-sm font-semibold',
              index === items.length - 1 ? 'text-ink' : 'text-ink/60'
            )}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
