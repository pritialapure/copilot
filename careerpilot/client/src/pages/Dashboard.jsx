import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile, useMatches } from '../api/queries';
import { authStore } from '../store/authStore';
import client from '../api/client';
import { useQueryClient } from '@tanstack/react-query';
import WorkflowGraph from '../components/WorkflowGraph';
import LoadingState from '../components/LoadingState';
import { Loader, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = authStore();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: matches, isLoading: matchesLoading } = useMatches();
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

  if (!user) {
    navigate('/login');
    return null;
  }

  if (profileLoading) return <LoadingState message="Loading dashboard..." />;

  const hasResume = profile?.resumeText && profile.resumeText.length > 0;
  const matchCount = matches?.length || 0;
  const topMatches = matches?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-[#f7f8f3]">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-[#18212f]/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-[#18212f]">CareerPilot</h1>
            <p className="text-xs text-gray-600">AI-Powered Internship CRM</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-[#18212f]">{user.name}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-soft p-6 border border-blue-200">
            <p className="text-sm text-blue-700 font-semibold mb-1">Resume Status</p>
            <p className="text-2xl font-black text-blue-900">{hasResume ? '✅ Ready' : '⏳ Pending'}</p>
            <p className="text-xs text-blue-700 mt-2">{hasResume ? 'Skills extracted' : 'Upload your resume'}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-soft p-6 border border-green-200">
            <p className="text-sm text-green-700 font-semibold mb-1">Matches Found</p>
            <p className="text-2xl font-black text-green-900">{matchCount}</p>
            <p className="text-xs text-green-700 mt-2">{matchCount > 0 ? 'Ready to explore' : 'Generate matches'}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-soft p-6 border border-purple-200">
            <p className="text-sm text-purple-700 font-semibold mb-1">Next Action</p>
            <p className="text-2xl font-black text-purple-900">{hasResume && matchCount > 0 ? '🚀' : '📝'}</p>
            <p className="text-xs text-purple-700 mt-2">{hasResume && matchCount > 0 ? 'Explore matches' : 'Start here'}</p>
          </div>
        </div>

        {/* Workflow */}
        <WorkflowGraph />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <button
            onClick={() => navigate('/profile')}
            className="bg-white rounded-lg shadow-soft p-6 border border-[#18212f]/10 hover:shadow-lg transition text-left"
          >
            <h3 className="text-lg font-bold text-[#18212f] mb-2">📄 {hasResume ? 'Update' : 'Upload'} Resume</h3>
            <p className="text-sm text-gray-600">{hasResume ? 'Replace with a new version' : 'Get started by uploading your resume'}</p>
          </button>

          <button
            onClick={hasResume ? handleGenerateMatches : () => navigate('/profile')}
            disabled={generatingMatches || !hasResume}
            className="bg-white rounded-lg shadow-soft p-6 border border-[#18212f]/10 hover:shadow-lg transition text-left disabled:opacity-50"
          >
            <h3 className="text-lg font-bold text-[#18212f] mb-2 flex items-center gap-2">
              {generatingMatches ? <Loader className="w-5 h-5 animate-spin" /> : '🎯'} Generate Matches
            </h3>
            <p className="text-sm text-gray-600">{generatingMatches ? 'Generating...' : 'Find your best-fit internships'}</p>
          </button>

          <button
            onClick={() => navigate('/internships')}
            className="bg-white rounded-lg shadow-soft p-6 border border-[#18212f]/10 hover:shadow-lg transition text-left"
          >
            <h3 className="text-lg font-bold text-[#18212f] mb-2">🌐 Explore Internships</h3>
            <p className="text-sm text-gray-600">Browse all available opportunities</p>
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="bg-white rounded-lg shadow-soft p-6 border border-[#18212f]/10 hover:shadow-lg transition text-left"
          >
            <h3 className="text-lg font-bold text-[#18212f] mb-2">⚙️ Preferences</h3>
            <p className="text-sm text-gray-600">Set role, location, and work mode</p>
          </button>
        </div>

        {/* Top Matches */}
        {topMatches.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-soft p-8 border border-[#18212f]/10">
            <h2 className="text-xl font-bold text-[#18212f] mb-4">🏆 Your Top Matches</h2>
            <div className="space-y-3">
              {topMatches.map(match => (
                <div key={match._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div>
                    <p className="font-semibold text-[#18212f]">{match.internship?.title}</p>
                    <p className="text-sm text-gray-600">{match.internship?.company}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#1f7a5c]">{match.score}%</div>
                    <p className="text-xs text-gray-600">Match</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
