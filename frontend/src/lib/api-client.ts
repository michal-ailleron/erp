/**
 * Cienka warstwa nad fetch: jedno miejsce na adres bazowy, błędy i JSON.
 * Komponenty nigdy nie wywołują fetch bezpośrednio, tylko funkcje z features/*\/api.ts.
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
  // Adres bezwzględny: potrzebny, żeby ten sam kod działał w przeglądarce i w testach (jsdom).
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
      // odpowiedź bez treści JSON: zostaje komunikat domyślny
    }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const apiGet = <T>(path: string, query?: Query) => request<T>('GET', path, query)
export const apiPost = <T>(path: string, body?: unknown) => request<T>('POST', path, undefined, body)
