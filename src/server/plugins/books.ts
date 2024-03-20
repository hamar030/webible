
import { books } from '../utils/books'
import { Books } from '../database/book'

export default defineNitroPlugin(async () => {
  console.log('Webible Nitro Plugins')

  // console.log(await books.getKeys())
  // console.log(books.mlist)
  // first init
  if(books instanceof Books) console.log('ready')
})