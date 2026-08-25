// Prefixes a root-relative asset path with the app's baseURL (varies per deploy, e.g. GitHub Pages subpaths).
export function useAssetUrl() {
  const config = useRuntimeConfig()
  return (path: string) => {
    const base = config.app.baseURL || '/'
    const normalizedBase = base === '/' ? '/' : base.replace(/\/+$/, '/')
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${normalizedBase}${normalizedPath.replace(/^\//, '')}`
  }
}
