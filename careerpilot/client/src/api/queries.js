import { useQuery } from '@tanstack/react-query';
import client from './client';

export const profileApi = {
  get: () => client.get('/profile').then((r) => r.data),
  history: () => client.get('/profile/history').then((r) => r.data),
  uploadResume: (file) => { const form = new FormData(); form.append('resume', file); return client.post('/profile/upload-resume', form).then((r) => r.data); },
  updatePreferences: (payload) => client.patch('/profile/preferences', payload).then((r) => r.data)
};
export const internshipApi = { list: () => client.get('/internships').then((r) => r.data), sync: () => client.post('/internships/sync').then((r) => r.data) };
export const skillGapApi = { get: (id) => client.get(`/skill-gap/${id}`).then((r) => r.data) };
export const applicationApi = { list: () => client.get('/applications').then((r) => r.data), create: (payload) => client.post('/applications', payload).then((r) => r.data), update: (id, payload) => client.patch(`/applications/${id}`, payload).then((r) => r.data), remove: (id) => client.delete(`/applications/${id}`).then((r) => r.data) };
export const notificationApi = { list: () => client.get('/notifications').then((r) => r.data), read: (id) => client.patch(`/notifications/${id}/read`).then((r) => r.data) };
export const analyticsApi = { get: () => client.get('/analytics').then((r) => r.data) };
export const materialApi = { list: () => client.get('/application-materials').then((r) => r.data), generate: (internshipId) => client.post('/application-materials/generate', { internshipId }).then((r) => r.data), approve: (resumeVersionId) => client.post('/application-materials/approve', { resumeVersionId }).then((r) => r.data), openPdf: async (id) => { const result = await client.get(`/application-materials/${id}/pdf`, { responseType: 'blob' }); const url = URL.createObjectURL(result.data); window.open(url, '_blank', 'noopener,noreferrer'); setTimeout(() => URL.revokeObjectURL(url), 60000); } };

// Profile queries
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await client.get('/profile');
      return res.data.profile;
    },
  });
};

export const useResumeHistory = () => {
  return useQuery({
    queryKey: ['resumeHistory'],
    queryFn: async () => {
      const res = await client.get('/profile/history');
      return res.data.history;
    },
  });
};

// Internship queries
export const useInternships = () => {
  return useQuery({
    queryKey: ['internships'],
    queryFn: async () => {
      const res = await client.get('/internships');
      return res.data.internships;
    },
  });
};

// Match queries
export const useMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const res = await client.get('/matches');
      return res.data.matches;
    },
  });
};

export const useGenerateMatches = () => {
  return useQuery({
    queryKey: ['generateMatches'],
    queryFn: async () => {
      const res = await client.post('/matches/generate');
      return res.data.matches;
    },
    enabled: false,
  });
};

// Skill gap query
export const useSkillGap = (internshipId) => {
  return useQuery({
    queryKey: ['skillGap', internshipId],
    queryFn: async () => {
      const res = await client.get(`/skill-gap/${internshipId}`);
      return res.data.skillGap;
    },
    enabled: !!internshipId,
  });
};

export default {
  useProfile,
  useResumeHistory,
  useInternships,
  useMatches,
  useGenerateMatches,
  useSkillGap,
};
