import { useNavigate } from 'react-router-dom';
import {
  useProfile,
  useMatches,
  useInternships,
  useApplications,
} from '../api/queries';

import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import WorkflowGraph from '../components/WorkflowGraph';
import LoadingState from '../components/LoadingState';
import Button from '../components/Button';
import Card from '../components/Card';
import MetricCard from '../components/MetricCard';
import ProgressBar from '../components/ProgressBar';
import client from '../api/client';
import { useQueryClient } from '@tanstack/react-query';

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useProfile();

  const {
    data: matches = [],
    isLoading: matchesLoading,
  } = useMatches();

  const {
    data: internships = [],
    isLoading: internshipsLoading,
  } = useInternships();

  const {
    data: applications = [],
    isLoading: applicationsLoading,
  } = useApplications();

  const [generatingMatches, setGeneratingMatches] = useState(false);

  const handleGenerateMatches = async () => {
    setGeneratingMatches(true);

    try {
      await client.post('/matches/generate');

      await queryClient.invalidateQueries({
        queryKey: ['matches'],
      });
    } catch (err) {
      console.error('Error generating matches:', err);
    } finally {
      setGeneratingMatches(false);
    }
  };

  // Show loading while dashboard data is loading
  if (
    profileLoading ||
    matchesLoading ||
    internshipsLoading ||
    applicationsLoading
  ) {
    return <LoadingState message="Loading dashboard..." />;
  }

  // Prevent white screen if profile request fails
  if (profileError) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-600">
          Unable to load dashboard
        </h2>

        <p className="text-gray-600 mt-2">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  // Ensure every value is an array
  const safeMatches = Array.isArray(matches) ? matches : [];

  const safeInternships = Array.isArray(internships)
    ? internships
    : [];

  const safeApplications = Array.isArray(applications)
    ? applications
    : [];

  // Resume check
  const hasResume =
    typeof profile?.resumeText === 'string' &&
    profile.resumeText.length > 30;

  // Matches
  const matchCount = safeMatches.length;

  const topMatches = safeMatches.slice(0, 3);

  // Applications
  const appliedCount = safeApplications.filter(
    (app) => app?.status === 'APPLIED'
  ).length;

  // Progress calculation
  const totalSteps = 8;

  let activeSteps = 0;

  if (hasResume) activeSteps++;

  if (safeInternships.length > 0) activeSteps++;

  if (matchCount > 0) activeSteps++;

  if (appliedCount > 0) activeSteps++;

  const progressPercent =
    (activeSteps / totalSteps) * 100;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-black text-ink">
          Welcome back{user?.name ? `, ${user.name}` : ''} 👋
        </h1>

        <p className="text-sm text-ink/60 mt-1">
          Here's an overview of your internship journey.
        </p>
      </div>

      {/* Progress Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">

          <div>
            <h2 className="text-2xl font-black text-ink mb-1">
              Your Journey
            </h2>

            <p className="text-sm text-ink/60">
              Track your progress through the CareerPilot pipeline
            </p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-black text-moss">
              {Math.round(progressPercent)}%
            </p>

            <p className="text-xs font-semibold text-ink/60">
              complete
            </p>
          </div>

        </div>

        <ProgressBar
          progress={progressPercent}
          color="moss"
        />
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
          value={safeInternships.length}
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

      {/* Workflow */}

      <WorkflowGraph
        activeStages={Array.from(
          { length: activeSteps },
          (_, i) => i + 1
        )}
      />

      {/* Quick Actions */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Resume */}

        <Card hover className="flex flex-col justify-between">

          <div className="mb-4">

            <h3 className="text-lg font-black text-ink mb-2">
              📄 {hasResume ? 'Update' : 'Upload'} Resume
            </h3>

            <p className="text-sm text-ink/60">

              {hasResume
                ? 'Replace with a new version to update your profile'
                : 'Get started by uploading your resume'}

            </p>

          </div>

          <Button
            onClick={() => navigate('/profile')}
            variant="primary"
            size="md"
            className="w-full"
          >
            {hasResume
              ? 'Update Resume'
              : 'Upload Resume'}
          </Button>

        </Card>


        {/* Matches */}

        <Card hover className="flex flex-col justify-between">

          <div className="mb-4">

            <h3 className="text-lg font-black text-ink mb-2">
              🎯 {matchCount > 0
                ? 'View Matches'
                : 'Generate Matches'}
            </h3>

            <p className="text-sm text-ink/60">

              {matchCount > 0
                ? `You have ${matchCount} matches. Find your best-fit internships.`
                : 'Find internships based on your resume.'}

            </p>

          </div>

          <Button
            onClick={
              matchCount > 0
                ? () => navigate('/matches')
                : hasResume
                  ? handleGenerateMatches
                  : () => navigate('/profile')
            }
            isLoading={generatingMatches}
            variant={
              matchCount > 0
                ? 'secondary'
                : 'primary'
            }
            size="md"
            className="w-full"
            disabled={generatingMatches}
          >

            {generatingMatches
              ? 'Generating...'
              : matchCount > 0
                ? 'View All Matches'
                : hasResume
                  ? 'Generate Matches'
                  : 'Upload Resume First'}

          </Button>

        </Card>


        {/* Explore */}

        <Card hover className="flex flex-col justify-between">

          <div className="mb-4">

            <h3 className="text-lg font-black text-ink mb-2">
              🌐 Explore Internships
            </h3>

            <p className="text-sm text-ink/60">
              Browse all available internship opportunities.
            </p>

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


        {/* Preferences */}

        <Card hover className="flex flex-col justify-between">

          <div className="mb-4">

            <h3 className="text-lg font-black text-ink mb-2">
              ⚙️ Preferences
            </h3>

            <p className="text-sm text-ink/60">
              Set roles, location, and work mode preferences.
            </p>

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


      {/* Top Matches */}

      {topMatches.length > 0 && (

        <Card>

          <div className="flex items-center justify-between mb-4">

            <div>

              <h3 className="text-xl font-black text-ink mb-1">
                🏆 Top Matches for You
              </h3>

              <p className="text-sm text-ink/60">
                Your best-fit internships based on your profile
              </p>

            </div>

            <Button
              onClick={() => navigate('/matches')}
              variant="ghost"
              size="sm"
            >
              View All →
            </Button>

          </div>


          <div className="space-y-3">

            {topMatches.map((match, index) => (

              <div
                key={match?._id || index}
                className="flex items-center justify-between p-4 bg-ink/5 rounded-lg hover:bg-ink/10 transition cursor-pointer stagger-item"
                onClick={() => {
                  if (match?.internshipId) {
                    navigate(
                      `/internships/${match.internshipId}`
                    );
                  }
                }}
              >

                <div className="flex-1">

                  <p className="font-bold text-ink">

                    {match?.internship?.title ||
                      'Internship'}

                  </p>

                  <p className="text-sm text-ink/60">

                    {match?.internship?.company ||
                      'Company not available'}

                  </p>

                </div>


                <div className="text-right">

                  <div
                    className={cx(

                      'text-2xl font-black px-3 py-2 rounded-lg',

                      match?.score >= 80
                        ? 'bg-emerald-100 text-emerald-700'
                        : match?.score >= 60
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'

                    )}
                  >

                    {match?.score ?? 0}%

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


/* =====================
   ICON COMPONENTS
===================== */

function FileCheck(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}


function Globe(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3"
      />
    </svg>
  );
}


function Target(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}


function CheckCircle(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}


function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}
