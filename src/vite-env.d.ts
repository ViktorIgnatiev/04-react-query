/// <reference types="vite/client" />

// Для CSS модулів
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

// Для змінних оточення
interface ImportMetaEnv {
  readonly VITE_TMDB_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}