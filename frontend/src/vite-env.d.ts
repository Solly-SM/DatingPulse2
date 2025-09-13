/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_DEVELOPMENT_MODE: string;
  // Add more environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
