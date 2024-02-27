import { router, publicProcedure } from '../trpc'
// import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const bibleRouter = router({
  all: publicProcedure.query(({ ctx }) => ctx.books.list),
  list: publicProcedure.query(({ ctx }) => ctx.books.mlist),
  getInit: publicProcedure.query(({ ctx }) => ctx.books.initData),  
  script: router({
    list: publicProcedure
      .input(
        z.object({
          bookId: z.number()
        })
      )
      .query(({ input, ctx }) => ctx.books.listScript(input.bookId)),
    chapter: router({
      list: publicProcedure
        .input(
          z.object({
            index: z.object({ book: z.number(), part: z.number() , script: z.number()})
          })
        )
        .query(({ input, ctx }) => ctx.books.listChapter(input.index)),
      verse: router({
        list: publicProcedure
          .input(
            z.object({
              index: z.object({
                book: z.number(),
                part: z.number(),
                script: z.number(),
                chapter: z.number()
              })
            })
          )
          .query(({ input, ctx }) => ctx.books.listVerse(input.index))
      })
    })
  })
    
  // for refetching data 
  // ToDo: auto fetch on per day 
  // reload: publicProcedure.query(({ ctx }) => {
  //   try {
  //     books.value = Books.initialize()
  //     console.log('List book reloaded')
  //     return { msg: 'List book reloaded' }
  //   } catch (e) {
  //     console.error('List book reload error: ' + e)
  //     throw new TRPCError({
  //       code: 'INTERNAL_SERVER_ERROR',
  //       message: 'An unexpected error occurred when, please try again later.',
  //       // optional: pass the original error to retain stack trace
  //       cause: e
  //     })
  //   }
  // }),
})
