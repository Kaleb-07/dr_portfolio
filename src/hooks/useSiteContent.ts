import { useEffect, useState } from 'react'
import { defaultContent, fetchSiteContent, type SiteContent } from '@/services/cms'

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent)
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
