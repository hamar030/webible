import { type inferAsyncReturnType } from '@trpc/server'
import { Books } from '@/server/database/book'

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */

const books = await Books.initialize()
console.log('db init done')
export const createContext = async () => {
  return { books }
}

export type Context = inferAsyncReturnType<typeof createContext>
