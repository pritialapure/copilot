import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import client from '../api/client';
import { useProfile } from '../api/queries';
import { useQueryClient } from '@tanstack/react-query';
import ErrorBanner from '../components/ErrorBanner';
import LoadingState from '../components/LoadingState';

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useProfile();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [roles, setRoles] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [updatingPrefs, setUpdatingPrefs] = useState(false);

  if (isLoading) return <LoadingState message="Loading profile..." />;

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setError('');
    } else {
      setError('Please select a PDF file');
      setFile(null);
    }
  };

  const handleUploadResume = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await client.post('/profile/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Resume uploaded and parsed successfully!');
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['resumeHistory'] });
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdatePreferences = async () => {
    setUpdatingPrefs(true);
    setError('');
    setSuccess('');

    try {
      await client.patch('/profile/preferences', {
        roles: roles ? roles.split(',') : [],
        location,
        workMode,
      });
      setSuccess('Preferences updated!');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdatingPrefs(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f3]">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-[#18212f]/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-[#18212f]">Profile</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-[#18212f] hover:bg-gray-100 rounded-md text-sm font-semibold transition"
          >
            ← Back
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {error && <ErrorBanner message={error} />}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-green-800">{success}</p>
          </div>
        )}

        {/* Resume Upload */}
        <div className="bg-white rounded-lg shadow-soft p-8 border border-[#18212f]/10 mb-6">
          <h2 className="text-xl font-bold text-[#18212f] mb-4">📄 Upload Resume</h2>
          <p className="text-sm text-gray-600 mb-4">Upload your resume as a PDF. It will be parsed to extract skills, experience, and education.</p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="resume-input"
            />
            <label htmlFor="resume-input" className="cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#18212f]">
                {file ? file.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-600">PDF only, max 5MB</p>
            </label>
          </div>

          <button
            onClick={handleUploadResume}
            disabled={!file || uploading}
            className="w-full bg-[#1f7a5c] hover:bg-[#1a6450] text-white font-semibold py-2 rounded-md transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading && <Loader className="w-4 h-4 animate-spin" />}
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </div>

        {/* Current Skills */}
        {profile && profile.skills && profile.skills.length > 0 && (
          <div className="bg-white rounded-lg shadow-soft p-8 border border-[#18212f]/10 mb-6">
            <h3 className="text-lg font-bold text-[#18212f] mb-3">Extracted Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow-soft p-8 border border-[#18212f]/10">
          <h2 className="text-xl font-bold text-[#18212f] mb-4">🎯 Job Preferences</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#18212f] mb-2">Preferred Roles</label>
              <input
                type="text"
                value={roles}
                onChange={(e) => setRoles(e.target.value)}
                placeholder="e.g., Frontend Developer, Full Stack Engineer (comma-separated)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f7a5c] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#18212f] mb-2">Location Preference</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Remote, San Francisco"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f7a5c] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#18212f] mb-2">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f7a5c] focus:border-transparent"
              >
                <option value="">Select...</option>
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleUpdatePreferences}
            disabled={updatingPrefs}
            className="w-full mt-6 bg-[#1f7a5c] hover:bg-[#1a6450] text-white font-semibold py-2 rounded-md transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {updatingPrefs && <Loader className="w-4 h-4 animate-spin" />}
            {updatingPrefs ? 'Updating...' : 'Update Preferences'}
          </button>
        </div>
      </main>
    </div>
  );
}
