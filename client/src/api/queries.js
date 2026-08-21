import { api } from "./client";

// Each group below still needs to be wired to the API. The stubs resolve with the
// empty response shape the screens expect so the app renders while unimplemented.

export const authApi = {
  // TODO: POST /auth/register, POST /auth/login, GET /auth/me.
  register: () => Promise.resolve({ user: null, profile: null, token: null }),
  login: () => Promise.resolve({ user: null, token: null }),
  me: () => Promise.resolve({ user: null })
};

export const profileApi = {
  // TODO: GET /profile, GET /profile/history, POST /profile/upload-resume (multipart
  // TODO: "resume" field), PATCH /profile/preferences.
  get: () => Promise.resolve({ profile: null }),
  history: () => Promise.resolve({ history: [] }),
  uploadResume: () => Promise.resolve({ profile: null, summary: "", pipelineReset: false }),
  updatePreferences: () => Promise.resolve({ profile: null })
};

export const internshipApi = {
  // TODO: GET /internships, POST /internships/sync.
  list: () => Promise.resolve({ internships: [] }),
  sync: () => Promise.resolve({ count: 0, internships: [] })
};

export const matchApi = {
  // TODO: POST /matches/generate, GET /matches.
  generate: () => Promise.resolve({ matches: [] }),
  list: () => Promise.resolve({ matches: [] })
};

export const skillGapApi = {
  // TODO: GET /skill-gaps/:internshipId.
  get: () => Promise.resolve({ skillGap: null })
};

export const materialApi = {
  // TODO: GET /application-materials, POST /application-materials/generate,
  // TODO: POST /application-materials/approve, GET /application-materials/:id/pdf as a
  // TODO: blob, and open that blob in a new tab.
  list: () => Promise.resolve({ resumeVersions: [] }),
  generate: () => Promise.resolve({ resumeVersion: null }),
  approve: () => Promise.resolve({ resumeVersion: null }),
  downloadPdf: () => Promise.resolve(new Blob()),
  openPdf: async () => {}
};

export const applicationApi = {
  // TODO: POST /applications, GET /applications, PATCH /applications/:id,
  // TODO: DELETE /applications/:id.
  create: () => Promise.resolve({ application: null }),
  list: () => Promise.resolve({ applications: [] }),
  update: () => Promise.resolve({ application: null }),
  remove: () => Promise.resolve({ success: false })
};

export const notificationApi = {
  // TODO: GET /notifications, PATCH /notifications/:id/read.
  list: () => Promise.resolve({ notifications: [] }),
  read: () => Promise.resolve({ notification: null })
};

export const analyticsApi = {
  // TODO: GET /analytics.
  get: () => Promise.resolve({ analytics: null })
};
