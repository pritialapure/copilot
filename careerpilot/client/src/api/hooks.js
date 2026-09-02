import { useQuery } from '@tanstack/react-query';
import {
  authApi,
  profileApi,
  internshipApi,
  matchApi,
  applicationApi,
  skillGapApi,
  notificationApi,
  analyticsApi
} from './queries';

// Auth Hooks
export const useCurrentUser = () =>
  useQuery({
    queryKey: ['user'],
    queryFn: authApi.getCurrentUser,
    staleTime: 5 * 60 * 1000
  });

// Profile Hooks
export const useProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.get,
    staleTime: 2 * 60 * 1000
  });

export const useProfileHistory = () =>
  useQuery({
    queryKey: ['profile-history'],
    queryFn: profileApi.history
  });

// Internship Hooks
export const useInternships = () =>
  useQuery({
    queryKey: ['internships'],
    queryFn: internshipApi.list,
    staleTime: 3 * 60 * 1000
  });

export const useInternship = (id) =>
  useQuery({
    queryKey: ['internship', id],
    queryFn: () => internshipApi.get(id),
    enabled: !!id
  });

// Match Hooks
export const useMatches = () =>
  useQuery({
    queryKey: ['matches'],
    queryFn: matchApi.list,
    staleTime: 3 * 60 * 1000
  });

// Application Hooks
export const useApplications = () =>
  useQuery({
    queryKey: ['applications'],
    queryFn: applicationApi.list,
    staleTime: 2 * 60 * 1000
  });

// Skill Gap Hooks
export const useSkillGap = (internshipId) =>
  useQuery({
    queryKey: ['skill-gap', internshipId],
    queryFn: () => skillGapApi.get(internshipId),
    enabled: !!internshipId
  });

// Notification Hooks
export const useNotifications = () =>
  useQuery({
    queryKey: ['notifications'],
    queryFn: notificationApi.list,
    refetchInterval: 30 * 1000 // Refetch every 30 seconds
  });

// Analytics Hooks
export const useAnalytics = () =>
  useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsApi.get,
    staleTime: 5 * 60 * 1000
  });

export * from './queries';
