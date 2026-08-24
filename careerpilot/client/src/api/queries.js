import { useQuery } from '@tanstack/react-query';
import client from './client';

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
