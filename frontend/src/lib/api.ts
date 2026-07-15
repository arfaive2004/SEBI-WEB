// Base URL of the BrokerVerse backend (FastAPI). Set NEXT_PUBLIC_API_URL in
// your Vercel project settings to point at the deployed backend.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

const TOKEN_KEY = 'brokerverse_token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TOKEN_KEY)
}

type ApiFetchOptions = Omit<RequestInit, 'body'> & { body?: BodyInit | Record<string, unknown> | null }

/**
 * Thin fetch wrapper that points at the BrokerVerse API, automatically
 * attaches the bearer token (if the user is logged in), and JSON-encodes
 * plain object bodies while leaving FormData untouched.
 */
export async function apiFetch(path: string, options: ApiFetchOptions = {}) {
  const token = getToken()
  const headers = new Headers(options.headers)

  let body = options.body as BodyInit | null | undefined

  if (body && !(body instanceof FormData) && typeof body === 'object') {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(body)
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: body as BodyInit | null | undefined,
  })

  return response
}

export async function apiJson<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const response = await apiFetch(path, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = (data && (data.detail || data.message)) || `Request failed (${response.status})`
    throw new Error(typeof message === 'string' ? message : 'Request failed')
  }
  return data as T
}
