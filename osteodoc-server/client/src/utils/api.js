/**
 * OsteoDoc – API-Client
 * Zentraler HTTP-Client für alle API-Aufrufe.
 */

const API_BASE = '/api';

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('osteodoc_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(method, path, body = null) {
  const options = {
    method,
    headers: getHeaders(),
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Ein Fehler ist aufgetreten');
  }

  return data;
}

export const api = {
  // Auth
  login: (username, password) => request('POST', '/auth/login', { username, password }),
  getMe: () => request('GET', '/auth/me'),
  changePassword: (currentPassword, newPassword) =>
    request('POST', '/auth/change-password', { currentPassword, newPassword }),

  // Patienten
  createPatient: (data) => request('POST', '/patients', data),
  getPatients: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request('GET', `/patients${query ? `?${query}` : ''}`);
  },
  getPatient: (id) => request('GET', `/patients/${id}`),
  updatePatient: (id, data) => request('PUT', `/patients/${id}`, data),
  deletePatient: (id) => request('DELETE', `/patients/${id}`),

  // Assessments
  createAssessment: (data) => request('POST', '/assessments', data),
  getPatientAssessments: (patientId) => request('GET', `/assessments/patient/${patientId}`),
  getAssessment: (id) => request('GET', `/assessments/${id}`),
  calculateRisk: (data) => request('POST', '/assessments/calculate-risk', { data }),

  // Risikofaktoren
  getRiskFactors: (category) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return request('GET', `/risk-factors${query}`);
  },
  getRiskFactorCategories: () => request('GET', '/risk-factors/categories'),
  updateRiskFactor: (id, data) => request('PUT', `/risk-factors/${id}`, data),

  // Therapien
  getTherapies: (gruppe) => {
    const query = gruppe ? `?gruppe=${encodeURIComponent(gruppe)}` : '';
    return request('GET', `/therapies${query}`);
  },
  updateTherapy: (id, data) => request('PUT', `/therapies/${id}`, data),

  // Laborwerte
  getLaboratory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request('GET', `/laboratory${query ? `?${query}` : ''}`);
  },
  getLaboratoryCategories: () => request('GET', '/laboratory/categories'),
  updateLaboratory: (id, data) => request('PUT', `/laboratory/${id}`, data),

  // Admin
  getUsers: () => request('GET', '/admin/users'),
  createUser: (data) => request('POST', '/admin/users', data),
  updateUser: (id, data) => request('PUT', `/admin/users/${id}`, data),
  deleteUser: (id) => request('DELETE', `/admin/users/${id}`),
  getAuditLog: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request('GET', `/admin/audit-log${query ? `?${query}` : ''}`);
  },
  getStats: () => request('GET', '/admin/stats'),
};
