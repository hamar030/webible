import { type inferAsyncReturnType } from '@trpc/server'
import { books } from '../utils/books'

const data = await books()
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async () => {
  return { books: data }
}

export type Context = inferAsyncReturnType<typeof createContext>
