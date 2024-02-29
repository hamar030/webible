import { Books } from '../database/book'

export const data = async () => {
  const data = await Books.initialize()
  if (data === undefined) throw new Error('something wrong with webible-init')
  return data
}

export const books = defineCachedFunction(
  async () => {
    const dataa = await data()
    return dataa
  },
  {
    maxAge: 60 * 60 * 24, // one Day
    name: 'webible-db',
    getKey: () => 'books'
  }
)
