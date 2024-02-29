import { router, publicProcedure } from '../trpc'
// import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const bibleRouter = router({
  all: publicProcedure.query(({ ctx }) => ctx.books.list),
  list: publicProcedure.query(({ ctx }) => ctx.books.mlist),
  getInit: publicProcedure
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
    .query(({ input, ctx }) => ctx.books.initData(input.index)),
  getInitByParams: publicProcedure
    .input(
      z.object({
        bookName: z.string(),
        scriptName: z.string(),
        chapterId: z.number()
      })
    )
    .query(({ input, ctx }) =>
      ctx.books.getInitByParams(input.bookName, input.scriptName, input.chapterId)
    ),
  isAvailable: publicProcedure
    .input(z.object({ bookName: z.string(), scriptName: z.string(), chapterId: z.number() }))
    .query(({ input, ctx }) =>
      ctx.books.isAvailable(input.bookName, input.scriptName, input.chapterId)
    ),
  getUrlParams: publicProcedure
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
    .query(({ input, ctx }) => ctx.books.getUrlParamsByIndex(input.index)),
  getUrlParamsByBook: publicProcedure
    .input(z.object({ bookName: z.string() }))
    .query(({ input, ctx }) => ctx.books.getUrlParamsByBook(input.bookName)),
  script: router({
    list: publicProcedure
      .input(
        z.object({
          index: z.object({
            book: z.number()
          })
        })
      )
      .query(({ input, ctx }) => ctx.books.listPartsWithScripts(input.index)),
    chapter: router({
      list: publicProcedure
        .input(
          z.object({
            index: z.object({ book: z.number(), part: z.number(), script: z.number() })
          })
        )
        .query(({ input, ctx }) => ctx.books.listChapters(input.index)),
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
          .query(({ input, ctx }) => ctx.books.listVerses(input.index))
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
