import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/queries';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Field from '../components/Field';
import LoadingState from '../components/LoadingState';
import ResumeUploadCard from '../components/ResumeUploadCard';
import ErrorBanner from '../components/ErrorBanner';
import Modal from '../components/Modal';
import { formatDate, truncate } from '../utils/format';
import Breadcrumbs from '../components/Breadcrumbs';
import { Edit2, Trash2, Download, Eye } from 'lucide-react';

export default function Profile() {
  const queryClient = useQueryClient();
  const [editingPreferences, setEditingPreferences] = useState(false);
  const [error, setError] = useState('');
  const [preferences, setPreferences] = useState({
    roles: [],
    location: '',
    workMode: '',
    stipendRange: ''
  });
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.get,
    onSuccess: (data) => {
      if (data?.profile?.preferences) {
        setPreferences(data.profile.preferences);
      }
    }
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['profile-history'],
    queryFn: profileApi.history
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (newPrefs) => profileApi.updatePreferences(newPrefs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['internships'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      setEditingPreferences(false);
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to update preferences');
    }
  });

  const profile = profileData?.profile;
  const history = historyData?.history || [];

  if (profileLoading) return <LoadingState message="Loading profile..." />;

  const hasResume = profile?.resumeText && profile.resumeText.length > 30;

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/' },
        { label: 'Profile' }
      ]} />

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      <div>
        <h1 className="text-3xl font-black text-ink mb-1">👤 Profile</h1>
        <p className="text-ink/60">Manage your resume, skills, and preferences</p>
      </div>

      {/* Resume Upload */}
      <ResumeUploadCard profile={profile} />

      {/* Skills Section */}
      {hasResume && profile?.skills && (
        <Card>
          <h2 className="text-xl font-black text-ink mb-4">📋 Extracted Skills</h2>
          <div className="mb-4">
            <Badge variant="success" className="mb-4">{profile.skills.length} Skills Found</Badge>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <Badge key={idx} variant="primary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <p className="text-xs text-ink/50 mt-4">These skills were automatically extracted from your resume.</p>
        </Card>
      )}

      {/* Projects Section */}
      {hasResume && profile?.projects && profile.projects.length > 0 && (
        <Card>
          <h2 className="text-xl font-black text-ink mb-4">🛠️ Projects</h2>
          <div className="space-y-3">
            {profile.projects.map((project, idx) => (
              <div key={idx} className="p-3 bg-ink/5 rounded-lg border border-ink/10">
                <p className="font-bold text-ink">{project}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Experience Section */}
      {hasResume && profile?.experience && profile.experience.length > 0 && (
        <Card>
          <h2 className="text-xl font-black text-ink mb-4">💼 Experience</h2>
          <div className="space-y-3">
            {profile.experience.map((exp, idx) => (
              <div key={idx} className="p-3 bg-ink/5 rounded-lg border border-ink/10">
                <p className="font-bold text-ink">{exp}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Education Section */}
      {hasResume && profile?.education && profile.education.length > 0 && (
        <Card>
          <h2 className="text-xl font-black text-ink mb-4">🎓 Education</h2>
          <div className="space-y-3">
            {profile.education.map((edu, idx) => (
              <div key={idx} className="p-3 bg-ink/5 rounded-lg border border-ink/10">
                <p className="font-bold text-ink">{edu}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Preferences Section */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-ink">⚙️ Preferences</h2>
          <Button
            onClick={() => setEditingPreferences(!editingPreferences)}
            variant={editingPreferences ? 'secondary' : 'primary'}
            size="sm"
            icon={Edit2}
          >
            {editingPreferences ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {editingPreferences ? (
          <div className="space-y-4">
            <Field
              label="Preferred Roles (comma-separated)"
              placeholder="e.g., Frontend, Full Stack, Backend"
              value={preferences.roles?.join(', ') || ''}
              onChange={(e) => setPreferences({
                ...preferences,
                roles: e.target.value.split(',').map(r => r.trim()).filter(Boolean)
              })}
            />
            <Field
              label="Preferred Location"
              placeholder="e.g., San Francisco, Remote, India"
              value={preferences.location || ''}
              onChange={(e) => setPreferences({
                ...preferences,
                location: e.target.value
              })}
            />
            <div>
              <label className="text-sm font-semibold text-ink mb-2 block">Work Mode</label>
              <div className="flex gap-3">
                {['On-site', 'Remote', 'Hybrid'].map((mode) => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="workMode"
                      value={mode}
                      checked={preferences.workMode === mode}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        workMode: e.target.value
                      })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-ink">{mode}</span>
                  </label>
                ))}
              </div>
            </div>
            <Field
              label="Stipend Range (optional)"
              placeholder="e.g., 50000-100000"
              value={preferences.stipendRange || ''}
              onChange={(e) => setPreferences({
                ...preferences,
                stipendRange: e.target.value
              })}
            />
            <Button
              onClick={() => updatePreferencesMutation.mutate(preferences)}
              isLoading={updatePreferencesMutation.isPending}
              variant="primary"
              className="w-full"
            >
              Save Preferences
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold uppercase text-ink/60 mb-2">Preferred Roles</p>
              <div className="flex flex-wrap gap-2">
                {preferences.roles?.length > 0 ? (
                  preferences.roles.map((role, idx) => (
                    <Badge key={idx} variant="primary">{role}</Badge>
                  ))
                ) : (
                  <p className="text-sm text-ink/60">Not set</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-ink/60 mb-2">Preferred Location</p>
              <p className="font-semibold text-ink">{preferences.location || 'Not set'}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-ink/60 mb-2">Work Mode</p>
              <p className="font-semibold text-ink">{preferences.workMode || 'Not set'}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-ink/60 mb-2">Stipend Range</p>
              <p className="font-semibold text-ink">{preferences.stipendRange || 'Not set'}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Resume History */}
      {history.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-ink">📜 Resume History</h2>
            <Button
              onClick={() => setShowHistoryModal(true)}
              variant="secondary"
              size="sm"
            >
              View All ({history.length})
            </Button>
          </div>
          <div className="space-y-3">
            {history.slice(0, 3).map((resume, idx) => (
              <div key={idx} className="p-4 border border-ink/10 rounded-lg hover:bg-ink/5 transition">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-ink">{resume.label}</p>
                    <p className="text-xs text-ink/60">Replaced on {formatDate(resume.supersededAt)}</p>
                  </div>
                  <Badge variant="neutral">{resume.matchCount} matches</Badge>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {resume.skills?.slice(0, 5).map((skill, sidx) => (
                    <Badge key={sidx} variant="primary" className="text-xs">{skill}</Badge>
                  ))}
                  {resume.skills?.length > 5 && (
                    <Badge variant="neutral" className="text-xs">+{resume.skills.length - 5}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* History Modal */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Resume History"
        size="lg"
      >
        {historyLoading ? (
          <LoadingState message="Loading history..." />
        ) : history.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((resume, idx) => (
              <div key={idx} className="p-4 border border-ink/10 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-ink">{resume.label}</p>
                    <p className="text-xs text-ink/60">Replaced on {formatDate(resume.supersededAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-ink">{resume.matchCount} matches</p>
                    <p className="text-xs text-ink/60">{resume.highMatchCount} high match</p>
                  </div>
                </div>
                <p className="text-sm text-ink/70 mb-3">{resume.summary}</p>
                <div className="flex flex-wrap gap-1">
                  {resume.skills?.slice(0, 8).map((skill, sidx) => (
                    <Badge key={sidx} variant="primary" className="text-xs">{skill}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-ink/60">No resume history found</p>
        )}
      </Modal>
    </div>
  );
}
