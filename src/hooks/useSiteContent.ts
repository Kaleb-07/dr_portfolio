import { useEffect, useState } from 'react'
import { fetchSiteContent, type SiteContent } from '@/services/cms'

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    fetchSiteContent()
      .then((data) => {
        if (!isMounted) return
        setContent(data)
        setError(null)
      })
      .catch((caughtError) => {
        if (!isMounted) return
        setError(caughtError instanceof Error ? caughtError : new Error('CMS content failed'))
      })
      .finally(() => {
        if (!isMounted) return
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { content, isLoading, error }
}
