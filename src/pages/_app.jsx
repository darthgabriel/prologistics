import { useEffect } from 'react'
import '@/styles/global.scss'
import '@/styles/customs.css'
import Layout from '@/components/layout/Layout'
import Hydration from '@/lib/Hydration'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

export default function App ({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap')
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Hydration>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydration>
    </QueryClientProvider>
  )
}
