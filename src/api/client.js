const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiBaseUrl = API_BASE_URL;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export async function ensureCsrfCookie() {
  await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
  });
}

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  const method = String(options.method || 'GET').toUpperCase();
  const needsCsrf = !['GET', 'HEAD', 'OPTIONS'].includes(method);

  const headers = new Headers(options.headers || {});
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (!headers.has('X-Requested-With')) headers.set('X-Requested-With', 'XMLHttpRequest');

  const xsrfToken = getCookie('XSRF-TOKEN');
  if (needsCsrf && !xsrfToken) {
    await ensureCsrfCookie();
  }

  const xsrfTokenAfter = getCookie('XSRF-TOKEN');
  if (xsrfTokenAfter && !headers.has('X-XSRF-TOKEN')) {
    headers.set('X-XSRF-TOKEN', decodeURIComponent(xsrfTokenAfter));
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData && options.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const doFetch = async () => {
    return fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
  };

  let res = await doFetch();

  if (res.status === 419 && needsCsrf) {
    await ensureCsrfCookie();
    const xsrfTokenRetry = getCookie('XSRF-TOKEN');
    if (xsrfTokenRetry && !headers.has('X-XSRF-TOKEN')) {
      headers.set('X-XSRF-TOKEN', decodeURIComponent(xsrfTokenRetry));
    }
    res = await doFetch();
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      (payload && typeof payload === 'object' && (payload.message || payload.error)) ||
      (typeof payload === 'string' ? payload : 'Request failed');
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}
