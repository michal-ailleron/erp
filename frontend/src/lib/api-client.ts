/**
 * Thin layer over fetch: one place for the base URL, errors, and JSON.
 * Components never call fetch directly, only the functions from features/*\/api.ts.
 */

export const DEFAULT_PAGE_SIZE = 10

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type Query = Record<string, string | number | undefined>

async function request<T>(method: string, path: string, query?: Query, body?: unknown): Promise<T> {
  // Absolute URL: needed so the same code works in the browser and in tests (jsdom).
  const url = new URL(`/api${path}`, window.location.origin)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  }

  const response = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    let message = `Błąd serwera (${response.status}).`
    try {
      const data = (await response.json()) as { message?: string }
      if (data.message) message = data.message
    } catch {
      // response without a JSON body: the default message stays
    }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const apiGet = <T>(path: string, query?: Query) => request<T>('GET', path, query)
export const apiPost = <T>(path: string, body?: unknown) => request<T>('POST', path, undefined, body)
