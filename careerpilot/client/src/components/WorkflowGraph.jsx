import { BarChart3, BookOpen, Zap, FileText, Globe, Target, TrendingUp, CheckCircle } from 'lucide-react';
import { cx } from '../utils/format';
import Card from './Card';

const stages = [
  { step: 1, label: 'Upload Resume', icon: FileText, color: 'moss' },
  { step: 2, label: 'Parse Skills', icon: Zap, color: 'gold' },
  { step: 3, label: 'Discover Jobs', icon: Globe, color: 'moss' },
  { step: 4, label: 'Match Score', icon: Target, color: 'gold' },
  { step: 5, label: 'Analyze Gaps', icon: BarChart3, color: 'moss' },
  { step: 6, label: 'Create Plan', icon: BookOpen, color: 'gold' },
  { step: 7, label: 'Apply Ready', icon: CheckCircle, color: 'moss' },
  { step: 8, label: 'Track Progress', icon: TrendingUp, color: 'gold' }
];

export default function WorkflowGraph({ activeStages = [] }) {
  const activeCount = activeStages.length;

  const getStageStatus = (step) => {
    if (activeStages.includes(step)) return 'active';
    if (step < Math.min(...(activeStages.length > 0 ? activeStages : [1]))) return 'completed';
    return 'waiting';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-moss text-white ring-2 ring-moss/30 ring-offset-2';
      case 'completed':
        return 'bg-emerald-600 text-white';
      case 'waiting':
        return 'bg-ink/10 text-ink/50';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <Card className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-ink mb-2">Pipeline Progress</h2>
          <p className="text-sm text-ink/60">AI-powered internship journey automation</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-moss">{activeCount}</p>
          <p className="text-xs font-semibold text-ink/60">of 8 active</p>
        </div>
      </div>

      {/* Desktop: Horizontal */}
      <div className="hidden lg:block">
        <div className="flex items-end justify-between gap-2">
          {stages.map((stage, idx) => {
            const status = getStageStatus(stage.step);
            const Icon = stage.icon;
            return (
              <div key={stage.step} className="flex-1">
                <div className="flex flex-col items-center">
                  <div className={cx(
                    'w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-2 transition-all duration-300',
                    getStatusColor(status),
                    status === 'active' && 'animate-pulse-soft'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-ink text-center h-8 flex items-center justify-center">
                    {stage.label}
                  </p>
                  <p className="text-[10px] text-ink/40 font-semibold">Step {stage.step}</p>
                </div>
                {idx < stages.length - 1 && (
                  <div className={cx(
                    'flex-1 h-1 mx-1 mt-8 rounded-full transition-all duration-500',
                    status === 'completed' ? 'bg-emerald-600' : 'bg-ink/10'
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Vertical */}
      <div className="lg:hidden space-y-3">
        {stages.map((stage) => {
          const status = getStageStatus(stage.step);
          const Icon = stage.icon;
          return (
            <div key={stage.step} className="flex items-center gap-3">
              <div className={cx(
                'w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 transition-all duration-300',
                getStatusColor(status),
                status === 'active' && 'animate-pulse-soft'
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-ink">{stage.label}</p>
                <p className="text-xs text-ink/40 font-semibold">Step {stage.step}</p>
              </div>
              <div className={cx(
                'text-xs font-black px-2 py-1 rounded',
                status === 'active' && 'bg-moss text-white animate-bounce-gentle',
                status === 'completed' && 'bg-emerald-600 text-white',
                status === 'waiting' && 'bg-ink/10 text-ink/50'
              )}>
                {status === 'active' ? '●' : status === 'completed' ? '✓' : '○'}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
