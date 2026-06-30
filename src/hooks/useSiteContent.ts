import { useEffect, useState, useRef } from 'react'
import { defaultContent, fetchSiteContent, type SiteContent } from '@/services/cms'

const CACHE_KEY = 'cms_site_content'

function loadCachedContent(): SiteContent {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) return JSON.parse(cached)
  } catch {}
  return defaultContent
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(loadCachedContent)
  const [isLoading, setIsLoading] = useState(false)  // immediately ready
  const [error, setError] = useState<Error | null>(null)
  const lastContentRef = useRef<string>(JSON.stringify(loadCachedContent()))

  useEffect(() => {
    let isMounted = true

    async function refresh() {
      try {
        const data = await fetchSiteContent()
        const newContentStr = JSON.stringify(data)
        if (isMounted && newContentStr !== lastContentRef.current) {
          lastContentRef.current = newContentStr
          setContent(data)
          localStorage.setItem(CACHE_KEY, newContentStr)
        }
        setError(null)
      } catch (caughtError) {
        if (isMounted) {
          setError(caughtError instanceof Error ? caughtError : new Error('CMS content failed'))
        }
      }
    }

    refresh() // initial fetch – user already sees cached (or fallback) content
    const interval = setInterval(refresh, 5000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return { content, isLoading, error }
}
