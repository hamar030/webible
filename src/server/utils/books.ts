import { Books } from '../database/book'
// import type { GistSimple } from "./books.type"

const data = async () => {
  const db = await Books.initialize()
  return db
}
// useStorage('webible-db').setItemRaw('books', await data())
export const books = await data()

// const GITHUB_TOKEN = <string>process.env.GITHUB_TOKEN
// export const books = defineCachedFunction(
//   async () => {
//     const books = await data()
//     return books
//   },
//   {
//     maxAge: 60 * 60 * 24, // one Day
//     name: 'webible-db',
//     getKey: () => 'books'
//   }
// )

// const dataa = cachedFunction(async () => {
//   return await $fetch<GistSimple>('https://api.github.com/gists/3ed4a54ec9f2e8e1721627714193fdcc', {
//     method: 'GET',
//     headers: {
//       Accept: 'application/vnd.github.base64+json',
//       Authorization: `Bearer ghp_${GITHUB_TOKEN}`,// change to env
//       'X-GitHub-Api-Version': '2022-11-28'
//     }
//   })
// })

// const bks = await dataa()
// console.log(bks.files)