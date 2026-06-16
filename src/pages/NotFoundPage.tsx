import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/shared'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = '404 | Page Not Found'
  }, [])

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="font-serif text-[8rem] leading-none font-light text-teal/20 md:text-[12rem]">
          404
        </p>
        <h1 className="mt-4 font-serif text-3xl font-light text-ink md:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm font-light text-ink-mid">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8 inline-block">
          <Link to="/">
            <Button variant="primary" size="lg" className="bg-teal text-white">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
