import { useEffect, useState, useRef } from 'react'
import { defaultContent, fetchSiteContent, type SiteContent } from '@/services/cms'

const POLL_INTERVAL = 5000 // 5 seconds

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const lastContentRef = useRef<string>('')

  useEffect(() => {
    let isMounted = true

    // initial fetch
    ;(async () => {
      try {
        const data = await fetchSiteContent()
        const newContentStr = JSON.stringify(data)
        if (isMounted && newContentStr !== lastContentRef.current) {
          lastContentRef.current = newContentStr
          setContent(data)
        }
        setError(null)
      } catch (caughtError) {
        if (isMounted) {
          setError(caughtError instanceof Error ? caughtError : new Error('CMS content failed'))
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    })()

    // start polling
    const interval = setInterval(async () => {
      try {
        const data = await fetchSiteContent()
        const newContentStr = JSON.stringify(data)
        if (isMounted && newContentStr !== lastContentRef.current) {
          lastContentRef.current = newContentStr
          setContent(data)
        }
        // silent on error to avoid flashing – keep last good content
      } catch {
        // ignore polling errors
      }
    }, POLL_INTERVAL)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { content, isLoading, error }
}
