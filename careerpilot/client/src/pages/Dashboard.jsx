import { useNavigate } from 'react-router-dom';
import { useProfile, useMatches, useInternships, useApplications } from '../api/queries';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import { Sparkles, TrendingUp, Users } from 'lucide-react';
import WorkflowGraph from '../components/WorkflowGraph';
import LoadingState from '../components/LoadingState';
import Button from '../components/Button';
import Card from '../components/Card';
import MetricCard from '../components/MetricCard';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import client from '../api/client';
import { useQueryClient } from '@tanstack/react-query';

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: matches, isLoading: matchesLoading } = useMatches();
  const { data: internshipsData, isLoading: internshipsLoading } = useInternships();
  const { data: applicationsData } = useApplications();
  const [generatingMatches, setGeneratingMatches] = useState(false);

  const handleGenerateMatches = async () => {
    setGeneratingMatches(true);
    try {
      await client.post('/matches/generate');
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    } catch (err) {
      console.error('Error generating matches:', err);
    } finally {
      setGeneratingMatches(false);
    }
  };

  if (profileLoading) return <LoadingState message="Loading dashboard..." />;

  const hasResume = profile?.resumeText && profile.resumeText.length > 30;
  const matchCount = matches?.length || 0;
  const topMatches = matches?.slice(0, 3) || [];
  const internships = Array.isArray(internshipsData) ? internshipsData : internshipsData?.internships || [];
  const applications = applicationsData?.applications || [];
  const appliedCount = applications.filter(app => app.status === 'APPLIED').length;
  
  // Calculate progress
  const totalSteps = 8;
  let activeSteps = 0;
  if (hasResume) activeSteps++;
  if (internships.length > 0) activeSteps++;
  if (matchCount > 0) activeSteps++;
  const progressPercent = (activeSteps / totalSteps) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black text-ink mb-1">Your Journey</h2>
            <p className="text-sm text-ink/60">Track your progress through the CareerPilot pipeline</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-moss">{Math.round(progressPercent)}%</p>
            <p className="text-xs font-semibold text-ink/60">complete</p>
          </div>
        </div>
        <ProgressBar progress={progressPercent} color="moss" />
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Resume Status"
          value={hasResume ? '✓' : '–'}
          color={hasResume ? 'success' : 'info'}
          icon={FileCheck}
        />
        <MetricCard
          title="Internships Found"
          value={internships.length}
          color="info"
          icon={Globe}
        />
        <MetricCard
          title="Matches Generated"
          value={matchCount}
          color={matchCount > 0 ? 'success' : 'warning'}
          icon={Target}
        />
        <MetricCard
          title="Applications Sent"
          value={appliedCount}
          color="primary"
          icon={CheckCircle}
        />
      </div>

      {/* Workflow Graph */}
      <WorkflowGraph activeStages={Array.from({ length: activeSteps }, (_, i) => i + 1)} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card hover className="flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-black text-ink mb-2">📄 {hasResume ? 'Update' : 'Upload'} Resume</h3>
            <p className="text-sm text-ink/60">
              {hasResume
                ? 'Replace with a new version to reset pipeline'
                : 'Get started by uploading your resume'
              }
            </p>
          </div>
          <Button
            onClick={() => navigate('/profile')}
            variant="primary"
            size="md"
            className="w-full"
          >
            {hasResume ? 'Update Resume' : 'Upload Resume'}
          </Button>
        </Card>

        <Card hover className="flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-black text-ink mb-2">🎯 {matchCount > 0 ? 'View' : 'Generate'} Matches</h3>
            <p className="text-sm text-ink/60">
              {matchCount > 0
                ? `You have ${matchCount} matches. Find your best-fit internships`
                : 'Find your best-fit internships based on your resume'
              }
            </p>
          </div>
          <Button
            onClick={hasResume ? handleGenerateMatches : () => navigate('/profile')}
            isLoading={generatingMatches}
            variant={matchCount > 0 ? 'secondary' : 'primary'}
            size="md"
            className="w-full"
            disabled={generatingMatches || !hasResume}
          >
            {generatingMatches ? 'Generating...' : matchCount > 0 ? 'View All Matches' : 'Generate Matches'}
          </Button>
        </Card>

        <Card hover className="flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-black text-ink mb-2">🌐 Explore Internships</h3>
            <p className="text-sm text-ink/60">Browse all available opportunities and opportunities</p>
          </div>
          <Button
            onClick={() => navigate('/internships')}
            variant="secondary"
            size="md"
            className="w-full"
          >
            Start Exploring
          </Button>
        </Card>

        <Card hover className="flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-black text-ink mb-2">⚙️ Preferences</h3>
            <p className="text-sm text-ink/60">Set roles, location, and work mode preferences</p>
          </div>
          <Button
            onClick={() => navigate('/profile')}
            variant="secondary"
            size="md"
            className="w-full"
          >
            Edit Preferences
          </Button>
        </Card>
      </div>

      {/* Top Matches Section */}
      {topMatches.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-black text-ink mb-1">🏆 Top Matches for You</h3>
              <p className="text-sm text-ink/60">Your best-fit internships based on your resume</p>
            </div>
            <Button
              onClick={() => navigate('/internships')}
              variant="ghost"
              size="sm"
            >
              View All →
            </Button>
          </div>
          <div className="space-y-3">
            {topMatches.map((match, idx) => (
              <div
                key={match._id}
                className="flex items-center justify-between p-4 bg-ink/5 rounded-lg hover:bg-ink/10 transition cursor-pointer stagger-item"
                onClick={() => navigate(`/internships/${match.internshipId}`)}
              >
                <div className="flex-1">
                  <p className="font-bold text-ink">{match.internship?.title}</p>
                  <p className="text-sm text-ink/60">{match.internship?.company}</p>
                </div>
                <div className="text-right">
                  <div className={cx(
                    'text-2xl font-black px-3 py-2 rounded-lg',
                    match.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                    match.score >= 60 ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  )}>
                    {match.score}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function FileCheck(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function Globe(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 0C5.088 3 3 5.088 3 12s2.088 9 5 9m0 0c1.657 0 3-4.03 3-9s-1.343-9-3-9" />
    </svg>
  );
}

function Target(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function CheckCircle(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}
