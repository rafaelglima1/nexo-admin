const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function request(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Erro ${res.status}`);
  }

  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getDashboard: () => request('/api/admin/dashboard'),

  getUsers: (page = 1, search?: string) => {
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set('search', search);
    return request(`/api/admin/users?${params}`);
  },

  getUser: (id: string) => request(`/api/admin/users/${id}`),

  banUser: (id: string, reason?: string) =>
    request(`/api/admin/users/${id}/ban`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  unbanUser: (id: string) =>
    request(`/api/admin/users/${id}/unban`, { method: 'POST' }),

  setRole: (id: string, role: string) =>
    request(`/api/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),

  getReports: (page = 1, status?: string) => {
    const params = new URLSearchParams({ page: String(page) });
    if (status) params.set('status', status);
    return request(`/api/admin/reports?${params}`);
  },

  updateReportStatus: (id: string, status: string) =>
    request(`/api/admin/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getCommunities: (page = 1, search?: string) => {
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set('search', search);
    return request(`/api/admin/communities?${params}`);
  },

  deleteCommunity: (id: string) =>
    request(`/api/admin/communities/${id}`, { method: 'DELETE' }),

  getRooms: (page = 1, live?: boolean) => {
    const params = new URLSearchParams({ page: String(page) });
    if (live !== undefined) params.set('live', String(live));
    return request(`/api/admin/rooms?${params}`);
  },

  endRoom: (id: string) =>
    request(`/api/admin/rooms/${id}/end`, { method: 'POST' }),

  getEvents: (page = 1) =>
    request(`/api/admin/events?page=${page}`),

  deleteEvent: (id: string) =>
    request(`/api/admin/events/${id}`, { method: 'DELETE' }),
};
