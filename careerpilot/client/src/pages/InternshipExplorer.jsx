import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader, AlertCircle } from 'lucide-react';
import { useInternships } from '../api/queries';
import client from '../api/client';
import { useQueryClient } from '@tanstack/react-query';
import LoadingState from '../components/LoadingState';
import ErrorBanner from '../components/ErrorBanner';

export default function InternshipExplorer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: internships, isLoading } = useInternships();
  const [searchTerm, setSearchTerm] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');

  const handleSync = async () => {
    setSyncing(true);
    setError('');

    try {
      await client.post('/internships/sync');
      queryClient.invalidateQueries({ queryKey: ['internships'] });
    } catch (err) {
      setError(err.response?.data?.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const filtered = internships?.filter(i =>
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.company.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return <LoadingState message="Loading internships..." />;

  return (
    <div className="min-h-screen bg-[#f7f8f3]">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-[#18212f]/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-[#18212f]">Internship Explorer</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-[#18212f] hover:bg-gray-100 rounded-md text-sm font-semibold transition"
          >
            ← Back
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && <ErrorBanner message={error} />}

        {/* Search & Sync */}
        <div className="bg-white rounded-lg shadow-soft p-6 border border-[#18212f]/10 mb-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or company..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f7a5c] focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="px-6 py-2 bg-[#1f7a5c] hover:bg-[#1a6450] text-white font-semibold rounded-md transition disabled:opacity-50 flex items-center gap-2"
            >
              {syncing && <Loader className="w-4 h-4 animate-spin" />}
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
          <p className="text-xs text-gray-600">Found {filtered.length} internship(s)</p>
        </div>

        {/* Internship Cards */}
        <div className="space-y-4">
          {filtered.map(internship => (
            <div key={internship._id} className="bg-white rounded-lg shadow-soft p-6 border border-[#18212f]/10 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#18212f]">{internship.title}</h3>
                  <p className="text-sm text-gray-600">{internship.company}</p>
                </div>
                {internship.match && (
                  <div className="text-right">
                    <div className="text-3xl font-black text-[#1f7a5c]">{internship.match.score}%</div>
                    <p className="text-xs text-gray-600">Match Score</p>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-700 mb-3 line-clamp-2">{internship.description}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {internship.skillsRequired?.slice(0, 3).map(skill => (
                  <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                    {skill}
                  </span>
                ))}
                {internship.skillsRequired?.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                    +{internship.skillsRequired.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-600">
                  <p>📍 {internship.location || 'Remote'}</p>
                  <p>📅 {internship.source || 'Catalog'}</p>
                </div>
                <a
                  href={internship.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#1f7a5c] hover:bg-[#1a6450] text-white text-sm font-semibold rounded-md transition"
                >
                  View & Apply →
                </a>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No internships found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}
