const API = process.env.NEXT_PUBLIC_API_URL || 'https://au-shop-latest-backend.arishusm12an.workers.dev';

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.error || 'Admin login failed');
  }

  return data;
}

export async function adminVerify(code: string) {
  const res = await fetch(`${API}/api/admin/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.error || 'Invalid verification code');
  }

  return data;
}
