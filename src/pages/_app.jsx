import { useEffect } from 'react'
import '@/styles/global.scss'
import '@/styles/customs.css'
import Layout from '@/components/layout/Layout'
import Hydration from '@/lib/Hydration'

export default function App ({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap')
  }, [])

  return (
    <Hydration>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Hydration>

  )
}
