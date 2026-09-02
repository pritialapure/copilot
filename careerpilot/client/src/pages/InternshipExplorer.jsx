import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Loader,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { useInternships } from '../api/queries';
import { applicationApi } from '../api/queries';
import client from '../api/client';

import LoadingState from '../components/LoadingState';
import ErrorBanner from '../components/ErrorBanner';

export default function InternshipExplorer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: internships,
    isLoading,
    isError,
  } = useInternships();

  const [searchTerm, setSearchTerm] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [applyingId, setApplyingId] = useState(null);
  const [appliedIds, setAppliedIds] = useState(() => new Set());

  /*
   * --------------------------------------------------
   * ENSURE INTERNSHIPS IS ALWAYS AN ARRAY
   * --------------------------------------------------
   */

  let internshipList = [];

  if (Array.isArray(internships)) {
    internshipList = internships;
  } else if (Array.isArray(internships?.internships)) {
    internshipList = internships.internships;
  } else if (Array.isArray(internships?.data)) {
    internshipList = internships.data;
  } else if (Array.isArray(internships?.opportunities)) {
    internshipList = internships.opportunities;
  }

  /*
   * --------------------------------------------------
   * SYNC INTERNSHIPS
   * --------------------------------------------------
   */

  const handleSync = async () => {
    setSyncing(true);
    setError('');

    try {
      await client.post('/internships/sync');

      await queryClient.invalidateQueries({
        queryKey: ['internships'],
      });
    } catch (err) {
      console.error('Sync error:', err);

      setError(
        err.response?.data?.message ||
        err.message ||
        'Sync failed'
      );
    } finally {
      setSyncing(false);
    }
  };

  /*
   * --------------------------------------------------
   * APPLY TO INTERNSHIP
   * --------------------------------------------------
   */

  const handleApply = async (internship) => {
    setError('');

    const internshipId = internship?._id;

    if (!internshipId) {
      setError('Invalid internship information.');
      return;
    }

    setApplyingId(internshipId);

    const externalWindow = window.open(
      'about:blank',
      '_blank'
    );

    try {
      await applicationApi.create({
        internshipId,
        status: 'APPLIED',
      });

      queryClient.invalidateQueries({
        queryKey: ['applications'],
      });

      queryClient.invalidateQueries({
        queryKey: ['analytics'],
      });

      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });

      setAppliedIds((previousIds) => {
        const newIds = new Set(previousIds);

        newIds.add(internshipId);

        return newIds;
      });

      if (externalWindow) {
        externalWindow.opener = null;

        if (internship.applyLink) {
          externalWindow.location.href =
            internship.applyLink;
        } else {
          externalWindow.close();

          setError(
            'No application link is available for this opportunity.'
          );
        }
      }
    } catch (err) {
      console.error('Application error:', err);

      if (externalWindow) {
        externalWindow.close();
      }

      setError(
        err.response?.data?.message ||
        err.message ||
        'Could not save this application. Please try again.'
      );
    } finally {
      setApplyingId(null);
    }
  };

  /*
   * --------------------------------------------------
   * FILTER INTERNSHIPS SAFELY
   * --------------------------------------------------
   */

  const normalizedSearchTerm =
    searchTerm.toLowerCase().trim();

  const filtered = internshipList.filter((internship) => {
    const title = (
      internship?.title ||
      internship?.role ||
      ''
    ).toLowerCase();

    const company = (
      internship?.company ||
      ''
    ).toLowerCase();

    return (
      title.includes(normalizedSearchTerm) ||
      company.includes(normalizedSearchTerm)
    );
  });

  /*
   * --------------------------------------------------
   * LOADING STATE
   * --------------------------------------------------
   */

  if (isLoading) {
    return (
      <LoadingState message="Loading internships..." />
    );
  }

  /*
   * --------------------------------------------------
   * ERROR STATE
   * --------------------------------------------------
   */

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f7f8f3] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-soft text-center max-w-md">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />

          <h2 className="text-xl font-bold mb-2">
            Unable to load internships
          </h2>

          <p className="text-gray-600">
            Please try again later.
          </p>

          <button
            onClick={() => navigate('/')}
            className="mt-6 px-5 py-2 bg-[#1f7a5c] text-white rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8f3]">

      {/* HEADER */}

      <header className="bg-white shadow-soft border-b border-[#18212f]/10 sticky top-0 z-10">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1 className="text-2xl font-black text-[#18212f]">
            Internship Explorer
          </h1>

          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-[#18212f] hover:bg-gray-100 rounded-md text-sm font-semibold transition"
          >
            ← Back
          </button>

        </div>

      </header>


      {/* MAIN CONTENT */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ERROR MESSAGE */}

        {error && (
          <ErrorBanner
            message={error}
            onClose={() => setError('')}
          />
        )}


        {/* SEARCH AND SYNC */}

        <div className="bg-white rounded-lg shadow-soft p-6 border border-[#18212f]/10 mb-6">

          <div className="flex gap-3 mb-4">

            {/* SEARCH */}

            <div className="flex-1 relative">

              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search by title or company..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f7a5c] focus:border-transparent"
              />

            </div>


            {/* SYNC BUTTON */}

            <button
              onClick={handleSync}
              disabled={syncing}
              className="px-6 py-2 bg-[#1f7a5c] hover:bg-[#1a6450] text-white font-semibold rounded-md transition disabled:opacity-50 flex items-center gap-2"
            >

              {syncing && (
                <Loader className="w-4 h-4 animate-spin" />
              )}

              {syncing
                ? 'Syncing...'
                : 'Sync Now'}

            </button>

          </div>


          <p className="text-xs text-gray-600">

            Found {filtered.length} internship(s)

          </p>

        </div>


        {/* INTERNSHIP CARDS */}

        <div className="space-y-4">

          {filtered.map((internship, index) => {

            const internshipId =
              internship?._id ||
              internship?.id ||
              index;

            const isApplying =
              applyingId === internshipId;

            const hasApplied =
              appliedIds.has(internshipId);

            /*
             * Support both:
             *
             * title → normal backend data
             * role → AI extracted Gmail data
             */

            const internshipTitle =
              internship?.title ||
              internship?.role ||
              'Untitled Opportunity';

            const company =
              internship?.company ||
              'Unknown Company';

            const description =
              internship?.description ||
              'No description available.';

            const skills =
              Array.isArray(
                internship?.skillsRequired
              )
                ? internship.skillsRequired
                : [];

            return (

              <div
                key={internshipId}
                className="bg-white rounded-lg shadow-soft p-6 border border-[#18212f]/10 hover:shadow-lg transition"
              >

                {/* TOP SECTION */}

                <div className="flex justify-between items-start mb-3">

                  <div className="flex-1">

                    <h3 className="text-lg font-bold text-[#18212f]">

                      {internshipTitle}

                    </h3>

                    <p className="text-sm text-gray-600">

                      {company}

                    </p>

                  </div>


                  {/* MATCH SCORE */}

                  {internship?.match?.score !== undefined && (

                    <div className="text-right">

                      <div className="text-3xl font-black text-[#1f7a5c]">

                        {internship.match.score}%

                      </div>

                      <p className="text-xs text-gray-600">

                        Match Score

                      </p>

                    </div>

                  )}

                </div>


                {/* DESCRIPTION */}

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">

                  {description}

                </p>


                {/* SKILLS */}

                {skills.length > 0 && (

                  <div className="flex flex-wrap gap-2 mb-3">

                    {skills
                      .slice(0, 3)
                      .map((skill, skillIndex) => (

                        <span
                          key={`${skill}-${skillIndex}`}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                        >

                          {skill}

                        </span>

                      ))}


                    {skills.length > 3 && (

                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">

                        +{skills.length - 3} more

                      </span>

                    )}

                  </div>

                )}


                {/* LOCATION AND SOURCE */}

                <div className="flex justify-between items-center">

                  <div className="text-xs text-gray-600">

                    <p>

                      📍 {internship?.location || 'Remote'}

                    </p>

                    <p>

                      📅 {internship?.source || 'Catalog'}

                    </p>

                  </div>


                  {/* BUTTONS */}

                  <div className="flex items-center gap-2">

                    <Link
                      to={`/internships/${internshipId}`}
                      className="px-4 py-2 text-[#18212f] hover:bg-gray-100 text-sm font-semibold rounded-md transition border border-[#18212f]/15"
                    >

                      Details

                    </Link>


                    <button
                      onClick={() =>
                        handleApply(internship)
                      }
                      disabled={isApplying}
                      className="px-4 py-2 bg-[#1f7a5c] hover:bg-[#1a6450] text-white text-sm font-semibold rounded-md transition disabled:opacity-50 flex items-center gap-2"
                    >

                      {isApplying && (

                        <Loader className="w-4 h-4 animate-spin" />

                      )}

                      {!isApplying && (

                        <ExternalLink className="w-4 h-4" />

                      )}

                      {isApplying
                        ? 'Saving...'
                        : hasApplied
                          ? 'Applied ✓ Open Again'
                          : 'View & Apply →'}

                    </button>

                  </div>

                </div>

              </div>

            );

          })}

        </div>


        {/* EMPTY STATE */}

        {filtered.length === 0 && (

          <div className="text-center py-12">

            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />

            <p className="text-gray-600">

              No internships found matching your search.

            </p>

          </div>

        )}

      </main>

    </div>
  );
}