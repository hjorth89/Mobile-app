import { URLSearchParams } from 'url';

export default function createService({ name, authUrl, tokenUrl, baseUrl }) {
  async function getAuthUrl({ clientId, redirectUri, scopes = [], state = '' }) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes.join(' '),
      state,
      access_type: 'offline',
    });
    return `${authUrl}?${params.toString()}`;
  }

  async function authenticate({ clientId, clientSecret, redirectUri, code, refreshToken }) {
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    });

    if (code) {
      params.set('grant_type', 'authorization_code');
      params.set('code', code);
    } else if (refreshToken) {
      params.set('grant_type', 'refresh_token');
      params.set('refresh_token', refreshToken);
    } else {
      throw new Error('code or refreshToken required');
    }

    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`[${name}] auth failed: ${res.status} ${text}`);
    }

    return res.json();
  }

  async function request(token, endpoint, { method = 'GET', params, body } = {}) {
    const url = new URL(endpoint, baseUrl);
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined) url.searchParams.set(key, params[key]);
      });
    }

    const res = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`[${name}] request failed: ${res.status} ${text}`);
    }

    if (res.status === 204) return null;
    return res.json();
  }

  function fetchData(token, endpoint, params) {
    return request(token, endpoint, { params });
  }

  function pushData(token, endpoint, body, method = 'POST') {
    return request(token, endpoint, { method, body });
  }

  return { getAuthUrl, authenticate, fetchData, pushData };
}
