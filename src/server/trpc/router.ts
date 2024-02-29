import { createCallerFactory, router } from './trpc'
import { bibleRouter } from './routers/bible'

export const appRouter = router({
  // hello: publicProcedure
  //   .input(
  //     z.object({
  //       text: z.string().nullish()
  //     })
  //   )
  //   .query(({ input }) => {
  //     return {
  //       greeting: `hello ${input?.text ?? 'world'}`
  //     }
  //   }),
  bible: bibleRouter
})

// 1. create a caller-function for your router
export const createCaller = createCallerFactory(appRouter)

// export const appHelpers = createServerSideHelpers({
//   router: appRouter,
//   ctx: await createContext(),
// });

// export type definition of API
export type AppRouter = typeof appRouter
