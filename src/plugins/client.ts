import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import type { AppRouter } from '~/server/trpc/router'

// error when on netlify
// const getBaseUrl = () => {
//   if (typeof window !== 'undefined')
//     // browser should use relative path
//     return ''
//   if (process.env.VERCEL_URL)
//     // reference for vercel.com
//     return `https://${process.env.VERCEL_URL}`
//   if (process.env.RENDER_INTERNAL_HOSTNAME)
//     // reference for render.com
//     return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
//   // assume localhost
//   // return `http://localhost:${process.env.PORT ?? 3000}`
//   return useRequestURL().host
// }

export default defineNuxtPlugin(() => {
  /**
   * createTRPCNuxtClient adds a `useQuery` composable
   * built on top of `useAsyncData`.
   */
  const trpc = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        // url: `${getBaseUrl()}/api/trpc`
        url: '/api/trpc/'
      })
    ]
  })

  return {
    provide: {
      trpc
    }
  }
})
