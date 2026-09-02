import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { analyticsApi } from '../api/queries';
import Card from '../components/Card';
import MetricCard from '../components/MetricCard';
import Badge from '../components/Badge';
import LoadingState from '../components/LoadingState';
import { formatRelativeTime } from '../utils/format';
import Breadcrumbs from '../components/Breadcrumbs';

export function Analytics() {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsApi.get
  });

  const analytics = analyticsData?.analytics || {};

  if (isLoading) return <LoadingState message="Loading analytics..." />;

  const {
    totalApplications = 0,
    interviewRate = 0,
    offerRate = 0,
    matchScoreEffectiveness = 0,
    topPerformingSkills = [],
    recommendationNote = ''
  } = analytics;

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/' },
        { label: 'Analytics' }
      ]} />

      <div>
        <h1 className="text-3xl font-black text-ink mb-1">📊 Analytics & Insights</h1>
        <p className="text-ink/60">Track your job search performance and get recommendations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Applications"
          value={totalApplications}
          color="primary"
          icon={Users}
        />
        <MetricCard
          title="Interview Rate"
          value={`${Math.round(interviewRate)}%`}
          color="info"
          icon={CheckCircle}
        />
        <MetricCard
          title="Offer Rate"
          value={`${Math.round(offerRate)}%`}
          color="success"
          icon={TrendingUp}
        />
        <MetricCard
          title="Match Score Effectiveness"
          value={`${Math.round(matchScoreEffectiveness)}`}
          color="warning"
          icon={AlertCircle}
        />
      </div>

      {/* Recommendation */}
      {recommendationNote && (
        <Card className="border-l-4 border-moss bg-moss/5">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-moss text-white">
                💡
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-ink mb-2">AI Recommendation</h3>
              <p className="text-ink/70 leading-relaxed">{recommendationNote}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Top Performing Skills */}
      {topPerformingSkills.length > 0 && (
        <Card>
          <h2 className="text-xl font-black text-ink mb-4">🏆 Top Performing Skills</h2>
          <div className="space-y-3">
            {topPerformingSkills.map((skill, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-moss/10 flex items-center justify-center">
                    <span className="text-sm font-black text-moss">{idx + 1}</span>
                  </div>
                  <div>
                    <p className="font-bold text-ink">{skill.skill}</p>
                    <p className="text-xs text-ink/60">Required by {skill.count} position{skill.count > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <Badge variant="success">{skill.count}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Export */}
      <Card className="text-center py-8">
        <p className="text-ink/60 mb-4">Export your analytics report as PDF for your records</p>
        <button className="px-6 py-3 bg-moss text-white font-bold rounded-lg hover:bg-moss/90 transition">
          📥 Export Report
        </button>
      </Card>
    </div>
  );
}
