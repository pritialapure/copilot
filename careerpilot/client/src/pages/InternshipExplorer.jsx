import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Loader,
  AlertCircle,
  ExternalLink,
  Filter,
  ChevronDown
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useInternships } from '../api/queries';
import { applicationApi } from '../api/queries';
import client from '../api/client';
import LoadingState from '../components/LoadingState';
import ErrorBanner from '../components/ErrorBanner';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { cx, getMatchScoreColor, truncate } from '../utils/format';
import Breadcrumbs from '../components/Breadcrumbs';

export default function InternshipExplorer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: internships, isLoading, isError } = useInternships();

  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [applyingId, setApplyingId] = useState(null);
  const [appliedIds, setAppliedIds] = useState(() => new Set());
  const [sortBy, setSortBy] = useState('score');

  let internshipList = [];
  if (Array.isArray(internships)) {
    internshipList = internships;
  } else if (Array.isArray(internships?.internships)) {
    internshipList = internships.internships;
  } else if (Array.isArray(internships?.data)) {
    internshipList = internships.data;
  }

  const handleSync = async () => {
    setSyncing(true);
    setError('');
    try {
      await client.post('/internships/sync');
      await queryClient.invalidateQueries({ queryKey: ['internships'] });
    } catch (err) {
      setError(err.response?.data?.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const handleApply = async (internship) => {
    setError('');
    const internshipId = internship?._id;
    if (!internshipId) {
      setError('Invalid internship information.');
      return;
    }

    setApplyingId(internshipId);
    const externalWindow = window.open('about:blank', '_blank');

    try {
      await applicationApi.create({
        internshipId,
        status: 'APPLIED'
      });

      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      setAppliedIds((prev) => new Set([...prev, internshipId]));

      if (externalWindow) {
        externalWindow.opener = null;
        if (internship.applyLink) {
          externalWindow.location.href = internship.applyLink;
        } else {
          externalWindow.close();
          setError('No application link available.');
        }
      }
    } catch (err) {
      if (externalWindow) externalWindow.close();
      setError(err.response?.data?.message || 'Could not save application.');
    } finally {
      setApplyingId(null);
    }
  };

  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  const sources = [...new Set(internshipList.map(i => i.source || 'Catalog'))];

  let filtered = internshipList.filter((internship) => {
    const title = (internship?.title || '').toLowerCase();
    const company = (internship?.company || '').toLowerCase();
    const source = internship?.source || 'Catalog';

    const matchesSearch = title.includes(normalizedSearchTerm) || company.includes(normalizedSearchTerm);
    const matchesSource = sourceFilter === 'all' || source === sourceFilter;

    return matchesSearch && matchesSource;
  });

  // Sort
  if (sortBy === 'score') {
    filtered.sort((a, b) => (b.match?.score || 0) - (a.match?.score || 0));
  } else if (sortBy === 'recent') {
    filtered.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
  }

  if (isLoading) return <LoadingState message="Loading internships..." />;

  if (isError) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-coral mx-auto mb-4" />
          <h2 className="text-xl font-black mb-2">Unable to load internships</h2>
          <p className="text-ink/60 mb-6">Please try again later.</p>
          <Button onClick={() => navigate('/')} variant="primary" className="w-full">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/' },
        { label: 'Internship Explorer' }
      ]} />

      {/* Error Banner */}
      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-ink mb-1">🌐 Internship Explorer</h1>
          <p className="text-ink/60">Browse and apply to opportunities that match your skills</p>
        </div>
        <Button
          onClick={handleSync}
          isLoading={syncing}
          variant="primary"
          icon={Loader}
          size="lg"
        >
          {syncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </div>

      {/* Filters Section */}
      <Card>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-ink/50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or company..."
              className="w-full pl-10 pr-4 py-2.5 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss bg-white text-ink"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-ink/60 mb-2 block">Source</label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full px-4 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss bg-white text-ink"
              >
                <option value="all">All Sources</option>
                {sources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-ink/60 mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss bg-white text-ink"
              >
                <option value="score">Match Score (High to Low)</option>
                <option value="recent">Recently Posted</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between pt-2 border-t border-ink/10">
            <p className="text-sm font-semibold text-ink">
              Found <span className="text-moss font-black">{filtered.length}</span> internship{filtered.length !== 1 ? 's' : ''}
            </p>
            {sourceFilter !== 'all' && (
              <button
                onClick={() => setSourceFilter('all')}
                className="text-xs font-semibold text-moss hover:text-moss/80 transition"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Internship Cards */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((internship, index) => {
            const internshipId = internship?._id || internship?.id || index;
            const isApplying = applyingId === internshipId;
            const hasApplied = appliedIds.has(internshipId);
            const title = internship?.title || 'Untitled Opportunity';
            const company = internship?.company || 'Unknown Company';
            const description = internship?.description || 'No description available.';
            const skills = Array.isArray(internship?.skillsRequired) ? internship.skillsRequired : [];
            const matchScore = internship?.match?.score;

            return (
              <Card
                key={internshipId}
                hover
                className="stagger-item transition-all hover:shadow-soft-lg"
              >
                <div className="space-y-4">
                  {/* Top Section */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-ink mb-1">{title}</h3>
                      <p className="text-sm text-ink/60 font-semibold">{company}</p>
                    </div>

                    {/* Match Score Badge */}
                    {matchScore !== undefined && (
                      <div className={cx(
                        'px-4 py-2 rounded-lg font-black text-center flex-shrink-0',
                        getMatchScoreColor(matchScore)
                      )}>
                        <p className="text-xl">{matchScore}%</p>
                        <p className="text-xs font-semibold mt-1">Match</p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-ink/70 line-clamp-2">{truncate(description, 150)}</p>

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {skills.slice(0, 5).map((skill, idx) => (
                        <Badge key={idx} variant="primary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {skills.length > 5 && (
                        <Badge variant="neutral" className="text-xs">
                          +{skills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-ink/10">
                    <div className="flex items-center gap-4 text-xs text-ink/60">
                      <span>📍 {internship?.location || 'Remote'}</span>
                      <span>📅 {internship?.source || 'Catalog'}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/internships/${internshipId}`}
                        className="px-4 py-2 text-ink hover:bg-ink/10 text-sm font-semibold rounded-lg transition border border-ink/20"
                      >
                        Details
                      </Link>
                      <Button
                        onClick={() => handleApply(internship)}
                        isLoading={isApplying}
                        variant="primary"
                        size="sm"
                        icon={isApplying ? undefined : ExternalLink}
                      >
                        {isApplying ? 'Saving...' : hasApplied ? 'Applied ✓' : 'Apply'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-ink/40 mx-auto mb-4" />
          <h3 className="text-lg font-black text-ink mb-2">No internships found</h3>
          <p className="text-ink/60 mb-6">Try adjusting your search or filters</p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setSourceFilter('all');
            }}
            variant="secondary"
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
}
