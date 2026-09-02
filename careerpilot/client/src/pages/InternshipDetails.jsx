import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Download, Eye, ThumbsUp, Loader, AlertCircle } from 'lucide-react';
import client from '../api/client';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';
import ErrorBanner from '../components/ErrorBanner';
import { cx, formatDate, truncate } from '../utils/format';
import Breadcrumbs from '../components/Breadcrumbs';
import ProgressBar from '../components/ProgressBar';

export function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [generatingResume, setGeneratingResume] = useState(false);
  const [approvingResume, setApprovingResume] = useState(false);

  const { data: internships, isLoading: internshipsLoading } = useQuery({
    queryKey: ['internships'],
    queryFn: async () => {
      const res = await client.get('/internships');
      return res.data.internships || [];
    }
  });

  const { data: resumeVersions, isLoading: versionsLoading } = useQuery({
    queryKey: ['resume-versions'],
    queryFn: async () => {
      const res = await client.get('/application-materials');
      return res.data.resumeVersions || [];
    }
  });

  const { data: skillGap, isLoading: skillGapLoading } = useQuery({
    queryKey: ['skill-gap', id],
    queryFn: async () => {
      try {
        const res = await client.get(`/skill-gaps/${id}`);
        return res.data.skillGap;
      } catch (err) {
        return null;
      }
    },
    enabled: !!id
  });

  const internship = internships?.find((i) => i._id === id);
  const resumeVersion = resumeVersions?.find((v) => v.internshipId === id);

  const handleDownloadPdf = async () => {
    if (!resumeVersion) return;
    setDownloadingPdf(true);
    try {
      const response = await client.get(`/application-materials/${resumeVersion._id}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `careerpilot-${internship?.company?.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download PDF');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleGenerateResume = async () => {
    setGeneratingResume(true);
    try {
      await client.post('/application-materials/generate', { internshipId: id });
      // Invalidate cache
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate resume');
    } finally {
      setGeneratingResume(false);
    }
  };

  const handleApproveResume = async () => {
    if (!resumeVersion) return;
    setApprovingResume(true);
    try {
      await client.post(`/application-materials/approve`, { resumeVersionId: resumeVersion._id });
    } catch (err) {
      setError('Failed to approve resume');
    } finally {
      setApprovingResume(false);
    }
  };

  if (internshipsLoading || versionsLoading) return <LoadingState message="Loading internship details..." />;

  if (!internship) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-coral mx-auto mb-4" />
          <h2 className="text-xl font-black mb-2">Internship not found</h2>
          <p className="text-ink/60 mb-6">The internship you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/internships')} variant="primary" className="w-full">
            Back to Explorer
          </Button>
        </Card>
      </div>
    );
  }

  const matchedSkills = internship.match?.matchedSkills || [];
  const missingSkills = internship.match?.missingSkills || [];
  const matchScore = internship.match?.score || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/' },
        { label: 'Internships', href: '/internships' },
        { label: internship.title }
      ]} />

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      {/* Header Card */}
      <Card>
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex-1">
            <p className="text-sm font-semibold text-moss mb-2">📌 {internship.company}</p>
            <h1 className="text-3xl font-black text-ink mb-2">{internship.title}</h1>
            <p className="text-ink/60 max-w-2xl">{truncate(internship.description, 200)}</p>
          </div>
          <div className={cx(
            'px-6 py-4 rounded-lg font-black text-center flex-shrink-0',
            matchScore >= 80 ? 'bg-emerald-100 text-emerald-700' :
            matchScore >= 60 ? 'bg-blue-100 text-blue-700' :
            'bg-amber-100 text-amber-700'
          )}>
            <p className="text-3xl">{matchScore}%</p>
            <p className="text-xs font-semibold mt-1">Match Score</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-ink/10">
          <div>
            <p className="text-xs font-bold uppercase text-ink/60 mb-1">Location</p>
            <p className="font-semibold text-ink">{internship.location || 'Remote'}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-ink/60 mb-1">Source</p>
            <p className="font-semibold text-ink">{internship.source || 'Catalog'}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-ink/60 mb-1">Posted</p>
            <p className="font-semibold text-ink text-sm">{formatDate(internship.postedDate)}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-ink/60 mb-1">Deadline</p>
            <p className="font-semibold text-ink text-sm">{formatDate(internship.deadline)}</p>
          </div>
        </div>
      </Card>

      {/* Skills Match */}
      <Card>
        <h2 className="text-xl font-black text-ink mb-4">📊 Skills Match</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
              <p className="font-bold text-ink">Matched Skills ({matchedSkills.length})</p>
            </div>
            {matchedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill, idx) => (
                  <Badge key={idx} variant="success">{skill}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink/60">No matched skills yet</p>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-coral"></div>
              <p className="font-bold text-ink">Missing Skills ({missingSkills.length})</p>
            </div>
            {missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill, idx) => (
                  <Badge key={idx} variant="danger">{skill}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink/60">All required skills covered!</p>
            )}
          </div>
        </div>
      </Card>

      {/* Skill Gaps */}
      {skillGap && (
        <Card>
          <h2 className="text-xl font-black text-ink mb-4">🎯 Skill Development Plan</h2>
          <div className="space-y-4">
            {skillGap.priorities?.map((priority, idx) => (
              <div key={idx} className="border border-ink/10 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-bold text-ink">{priority.skill}</p>
                  <Badge variant={priority.priority === 'High' ? 'danger' : 'warning'}>
                    {priority.priority} Priority
                  </Badge>
                </div>
                <p className="text-sm text-ink/60 mb-3">{priority.suggestedAction}</p>
                <div className="bg-ink/5 rounded p-3 text-xs text-ink/70">
                  <p className="font-semibold mb-1">Mini Project:</p>
                  <p>{priority.miniProject}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Resume Preparation */}
      <Card>
        <h2 className="text-xl font-black text-ink mb-4">📄 Resume Preparation</h2>
        {resumeVersion ? (
          <div className="space-y-4">
            <div className="bg-moss/10 border border-moss/30 rounded-lg p-4">
              <p className="text-sm font-semibold text-moss mb-3">✅ Version Generated</p>
              <p className="text-sm text-ink/70 mb-4">Your resume has been tailored for this position.</p>
              {resumeVersion.changeSummary && (
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase text-ink/60 mb-2">Changes Made:</p>
                  <ul className="text-xs text-ink/70 space-y-1 ml-4 list-disc">
                    {resumeVersion.changeSummary.slice(0, 3).map((change, idx) => (
                      <li key={idx}>{change}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={handleDownloadPdf}
                  isLoading={downloadingPdf}
                  variant="primary"
                  size="sm"
                  icon={Download}
                >
                  Download PDF
                </Button>
                <Button
                  onClick={() => window.open(internship.applyLink, '_blank')}
                  variant="gold"
                  size="sm"
                >
                  Apply with Resume
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-ink/5 border border-ink/20 rounded-lg p-4">
            <p className="text-sm text-ink/70 mb-4">Generate a tailored resume for this position.</p>
            <Button
              onClick={handleGenerateResume}
              isLoading={generatingResume}
              variant="primary"
            >
              Generate Tailored Resume
            </Button>
          </div>
        )}
      </Card>

      {/* Description */}
      <Card>
        <h2 className="text-xl font-black text-ink mb-4">📋 Full Description</h2>
        <p className="text-ink/70 whitespace-pre-wrap leading-relaxed">{internship.description}</p>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 sticky bottom-6 flex-wrap justify-center">
        <Button
          onClick={() => navigate('/internships')}
          variant="secondary"
          size="lg"
        >
          ← Back
        </Button>
        <Button
          onClick={() => window.open(internship.applyLink, '_blank')}
          variant="primary"
          size="lg"
          icon={ExternalLink}
        >
          Apply on Company Site
        </Button>
      </div>
    </div>
  );
}

function ExternalLink(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}
