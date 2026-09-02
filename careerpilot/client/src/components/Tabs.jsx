import { cx } from '../utils/format';

export default function Tabs({
  tabs = [],
  activeTab,
  onTabChange,
  className = ''
}) {
  return (
    <div className={className}>
      <div className="flex gap-1 border-b border-ink/10 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cx(
              'px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-[2px]',
              activeTab === tab.id
                ? 'border-moss text-moss'
                : 'border-transparent text-ink/60 hover:text-ink'
            )}
          >
            {tab.icon && <tab.icon className="w-4 h-4 inline mr-2" />}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
