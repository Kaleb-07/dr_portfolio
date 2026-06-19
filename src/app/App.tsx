import { Providers } from '@/app/providers'
import { AppRouter } from '@/app/router'
import { Layout } from '@/components/layout/Layout'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { ChatWidget } from '@/components/chatbot/ChatWidget'

export default function App() {
  return (
    <Providers>
      <ScrollToTop />
      <Layout>
        <AppRouter />
      </Layout>
      <ChatWidget />
    </Providers>
  )
}
