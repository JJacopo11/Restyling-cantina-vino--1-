import { useAppConfig } from 'nuxt/app'

type AppConfigWithBaseUrl = {
  app?: {
    baseURL?: string
  }
}

// Prefixes a root-relative asset path with the app's baseURL (varies per deploy, e.g. GitHub Pages subpaths).
export function useAssetUrl() {
  const appConfig = useAppConfig() as AppConfigWithBaseUrl
  return (path: string) => {
    const base = appConfig.app?.baseURL ?? '/'
    const normalizedBase = base === '/' ? '/' : base.replace(/\/+$/, '/')
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${normalizedBase}${normalizedPath.replace(/^\//, '')}`
  }
}
