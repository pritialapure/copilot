import { FileText, Loader, AlertCircle, Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { profileApi } from '../api/queries';
import Button from './Button';
import ErrorBanner from './ErrorBanner';
import Card from './Card';
import Badge from './Badge';

export default function ResumeUploadCard({ profile }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  const uploadMutation = useMutation({
    mutationFn: (file) => profileApi.uploadResume(file),
    onSuccess: () => {
      setError('');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['profile-history'] });
      queryClient.invalidateQueries({ queryKey: ['internships'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['resume-versions'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to upload resume');
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    uploadMutation.mutate(file);
  };

  const hasResume = profile?.resumeText && profile.resumeText.length > 30;

  return (
    <Card className="mb-8">
      {error && <ErrorBanner message={error} onClose={() => setError('')} variant="error" />}

      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-ink mb-1">{hasResume ? '📄 Update Resume' : '📄 Upload Resume'}</h3>
          <p className="text-sm text-ink/60">
            {hasResume
              ? 'Replace with a new version to reset the pipeline'
              : 'Get started by uploading your resume (PDF)'
            }
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-ink/50">Max 5MB</p>
          <p className="text-xs text-ink/40">PDF only</p>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className="border-2 border-dashed border-moss/30 hover:border-moss/60 bg-moss/5 hover:bg-moss/10 rounded-lg p-8 text-center transition cursor-pointer mb-6"
        onClick={() => fileInputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const file = e.dataTransfer.files?.[0];
          if (file) {
            handleFileChange({ target: { files: [file] } });
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <FileText className="w-12 h-12 text-moss/60 mx-auto mb-3" />
        <p className="text-sm font-semibold text-ink mb-1">Drop your PDF here or click to browse</p>
        <p className="text-xs text-ink/60">Supported format: PDF</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploadMutation.isPending}
        />
      </div>

      {/* Skills Display */}
      {hasResume && profile?.skills && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-sm font-black text-ink">Extracted Skills</h4>
            <Badge variant="success">{profile.skills.length}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.slice(0, 12).map((skill, idx) => (
              <Badge key={idx} variant="primary">{skill}</Badge>
            ))}
            {profile.skills.length > 12 && (
              <Badge variant="neutral">+{profile.skills.length - 12} more</Badge>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={() => fileInputRef.current?.click()}
        isLoading={uploadMutation.isPending}
        icon={uploadMutation.isPending ? undefined : Plus}
        size="lg"
        className="w-full"
      >
        {uploadMutation.isPending ? 'Uploading...' : hasResume ? 'Replace Resume' : 'Upload Resume'}
      </Button>
    </Card>
  );
}
