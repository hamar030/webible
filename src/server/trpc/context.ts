import { type inferAsyncReturnType } from '@trpc/server'
import { books } from '../utils/books'

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async () => {
  return { books }
  // return {}
}

export type Context = inferAsyncReturnType<typeof createContext>
