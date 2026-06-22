import { Providers } from '@/app/providers'
import { AppRouter } from '@/app/router'
import { Layout } from '@/components/layout/Layout'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { ChatWidget } from '@/components/chatbot/ChatWidget'
import { useLocation } from 'react-router-dom'

function AppShell() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <>
        <ScrollToTop />
        <AppRouter />
      </>
    )
  }

  return (
    <>
      <ScrollToTop />
      <Layout>
        <AppRouter />
      </Layout>
      <ChatWidget />
    </>
  )
}

export default function App() {
  return (
    <Providers>
      <AppShell />
    </Providers>
  )
}
