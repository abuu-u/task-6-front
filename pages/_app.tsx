import { CacheProvider, EmotionCache } from '@emotion/react'
import { CssBaseline, Experimental_CssVarsProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import createEmotionCache from '../components/create-emotion-cache'

const clientSideEmotionCache = createEmotionCache()

interface MyAppProperties extends AppProps {
  emotionCache?: EmotionCache
}

function MyApp(properties: MyAppProperties) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
  } = properties
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Experimental_CssVarsProvider defaultMode="system">
        <CssBaseline />
        <Component {...pageProps} />
      </Experimental_CssVarsProvider>
    </CacheProvider>
  )
}

export default MyApp
