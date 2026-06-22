import { useEffect, useState } from 'react'
import { fetchSiteContent, type SiteContent } from '@/services/cms'

let cachedContent: SiteContent | null = null
let pendingContent: Promise<SiteContent> | null = null

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(cachedContent)
  const [isLoading, setIsLoading] = useState(!cachedContent)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    if (!pendingContent) {
      pendingContent = fetchSiteContent().then((data) => {
        cachedContent = data
        return data
      })
    }

    pendingContent
      .then((data) => {
        if (isMounted) {
          setContent(data)
          setError(null)
        }
      })
      .catch((caughtError) => {
        if (isMounted) {
          setError(caughtError instanceof Error ? caughtError : new Error('CMS content failed'))
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { content, isLoading, error }
}
