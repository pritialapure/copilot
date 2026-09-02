import { useQuery } from '@tanstack/react-query';
import client from './client';

// ==================== AUTH API ====================

export const authApi = {
  register: (data) =>
    client.post('/auth/register', data).then((r) => r.data),

  login: (data) =>
    client.post('/auth/login', data).then((r) => r.data),

  getCurrentUser: () =>
    client.get('/auth/me').then((r) => r.data),
};


// ==================== PROFILE API ====================

export const profileApi = {
  get: () =>
    client.get('/profile').then((r) => r.data),

  history: () =>
    client.get('/profile/history').then((r) => r.data),

  uploadResume: (file) => {
    const formData = new FormData();

    formData.append('resume', file);

    return client.post(
      '/profile/upload-resume',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    ).then((r) => r.data);
  },

  updatePreferences: (preferences) =>
    client
      .patch('/profile/preferences', preferences)
      .then((r) => r.data),
};


// ==================== INTERNSHIP API ====================

export const internshipApi = {
  list: () =>
    client.get('/internships').then((r) => r.data),

  get: (id) =>
    client.get(`/internships/${id}`).then((r) => r.data),

  sync: () =>
    client.post('/internships/sync').then((r) => r.data),
};


// ==================== MATCH API ====================

export const matchApi = {
  list: () =>
    client.get('/matches').then((r) => r.data),

  generate: () =>
    client.post('/matches/generate').then((r) => r.data),
};


// ==================== APPLICATION API ====================

export const applicationApi = {
  list: () =>
    client.get('/applications').then((r) => r.data),

  create: (data) =>
    client.post('/applications', data).then((r) => r.data),

  update: (id, data) =>
    client.patch(`/applications/${id}`, data).then((r) => r.data),

  remove: (id) =>
    client.delete(`/applications/${id}`).then((r) => r.data),
};


// ==================== SKILL GAP API ====================

export const skillGapApi = {
  get: (internshipId) =>
    client
      .get(`/skill-gaps/${internshipId}`)
      .then((r) => r.data),
};


// ==================== NOTIFICATION API ====================

export const notificationApi = {
  list: () =>
    client.get('/notifications').then((r) => r.data),

  read: (id) =>
    client
      .post(`/notifications/${id}/read`)
      .then((r) => r.data),
};


// ==================== ANALYTICS API ====================

export const analyticsApi = {
  get: () =>
    client.get('/analytics').then((r) => r.data),
};


// =====================================================
// REACT QUERY HOOKS
// =====================================================


// -------------------- INTERNSHIPS --------------------

export const useInternships = () => {
  return useQuery({
    queryKey: ['internships'],

    queryFn: async () => {
      const data = await internshipApi.list();

      // Handles multiple possible backend response formats
      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data?.internships)) {
        return data.internships;
      }

      if (Array.isArray(data?.data)) {
        return data.data;
      }

      return [];
    },
  });
};


// -------------------- APPLICATIONS --------------------

export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],

    queryFn: async () => {
      const data = await applicationApi.list();

      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data?.applications)) {
        return data.applications;
      }

      if (Array.isArray(data?.data)) {
        return data.data;
      }

      return [];
    },
  });
};


// -------------------- MATCHES --------------------

export const useMatches = () => {
  return useQuery({
    queryKey: ['matches'],

    queryFn: async () => {
      const data = await matchApi.list();

      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data?.matches)) {
        return data.matches;
      }

      if (Array.isArray(data?.data)) {
        return data.data;
      }

      return [];
    },
  });
};


// -------------------- PROFILE --------------------

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],

    queryFn: async () => {
      return await profileApi.get();
    },
  });
};


// -------------------- NOTIFICATIONS --------------------

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],

    queryFn: async () => {
      const data = await notificationApi.list();

      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data?.notifications)) {
        return data.notifications;
      }

      if (Array.isArray(data?.data)) {
        return data.data;
      }

      return [];
    },
  });
};


// -------------------- ANALYTICS --------------------

export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],

    queryFn: async () => {
      return await analyticsApi.get();
    },
  });
};


export default client;