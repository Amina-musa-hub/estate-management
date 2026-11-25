const API_URL = 'http://localhost:5000';

export async function apiGet<T>(path: string): Promise<T | null> {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
