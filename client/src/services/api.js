const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw { status: response.status, ...data };
  }

  return data;
}

export const authAPI = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

export const shipmentAPI = {
  create: (shipmentData) =>
    request('/shipments', {
      method: 'POST',
      body: JSON.stringify(shipmentData),
    }),

  getByShipmentId: (shipmentId) =>
    request(`/shipments/${encodeURIComponent(shipmentId)}`),

  update: (shipmentId, updateData) =>
    request(`/shipments/${encodeURIComponent(shipmentId)}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    }),
};
