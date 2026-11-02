/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to "false" to disable the mocks and connect to the real backend. */
  readonly VITE_USE_MOCKS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
