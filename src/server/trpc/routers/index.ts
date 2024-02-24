import { createCallerFactory, router } from '../trpc'

import { bibleRouter } from './bible'

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
const createCaller = createCallerFactory(appRouter)

// 2. create a caller using your `Context`
export const caller = createCaller({})

// // 3. use the caller to add and list posts
// const addedPost = await caller.post.add({
//   title: 'How to make server-side call in tRPC',
// });

// const postList = await caller.post.list();

// export type definition of API
export type AppRouter = typeof appRouter
