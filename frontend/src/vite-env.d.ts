/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Ustaw na "false", żeby wyłączyć mocki i łączyć się z prawdziwym backendem. */
  readonly VITE_USE_MOCKS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
