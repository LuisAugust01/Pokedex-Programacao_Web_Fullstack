const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export async function apiFetch(path, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    let message = data.error || data.message || 'Erro na requisição';
    if (!message && data.errors && Array.isArray(data.errors)) {
      message = data.errors.map((e) => e.msg || e.message || JSON.stringify(e)).join('; ');
    }
    throw new Error(message);
  }
  return res.json();
}

export { API_BASE_URL };
