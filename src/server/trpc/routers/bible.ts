import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { ref } from 'vue'

import { Books } from '@/server/database/book'

const books = ref(await Books.initialize())
export const bibleRouter = router({
  all: publicProcedure.query(async () => books.value.list),
  list: publicProcedure.query(async () => books.value.mlist),
  reload: publicProcedure.query(async () => {
    try {
      books.value = await Books.initialize()
      console.log('List book reloaded')
      return { msg: 'List book reloaded' }
    } catch (e) {
      console.error('List book reload error: ' + e)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred when, please try again later.',
        // optional: pass the original error to retain stack trace
        cause: e
      })
    }
  }),
  script: router({
    list: publicProcedure
      .input(
        z.object({
          bookId: z.number()
        })
      )
      .query(({ input }) => books.value.listScript(input.bookId)),
    chapter: router({
      list: publicProcedure.input(z.object({
        script: z.object({id: z.number(),name: z.string()})
      })).query(({input})=> books.value.listChapter(input.script))
    })
  })
})
