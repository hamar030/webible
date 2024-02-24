import YAML from 'yaml'
import fs from 'fs'
import _ from 'lodash'

// need to separate it with env
const LIST_BOOK_url: string = './data/list_book.yaml'
//const LIST_BOOK_url: string = 'https://gist.githubusercontent.com/hamar030/3ed4a54ec9f2e8e1721627714193fdcc/raw/list_book.yaml'

const dataFetch = async (url: string) => {
  //return YAML.parse(await (await (await fetch(url)).blob()).text())
  // return fetch(url)
  // .then((res) => res.blob())
  // .then((blb) => blb.text())
  // .then((txt) => {
  // return YAML.parse(txt)
  // })
  return YAML.parse(fs.readFileSync(url, 'utf8'))
}

class Books implements IBooks {
  [id: number]: IBook
  list: IBook[]

  private constructor(init: IBook[]) {
    this.list = init
  }

  /**
   *  get book from url and return it to new array of book.
   */
  public static async initialize() {
    try {
      const list = await dataFetch(LIST_BOOK_url).then((res) => res.listBook)
      const books: IBook[] = []
      for await (const [index, lst] of list.entries()) {
        const data = await dataFetch(lst.url)
        books[index] = { id: index + 1, ...lst, ...data }
      }
      /*
       * set id for each array
       */
      books.forEach((book, index) => {
        book.parts.forEach((part, pindex) => {
          books[index].parts[pindex] = { id: pindex + 1, ..._.omit(part, 'id') }
          part.scripts.forEach((script, sindex) => {
            books[index].parts[pindex].scripts[sindex] = { id: sindex + 1, ..._.omit(script, 'id') }
            script.chapters.forEach((chapter, cindex) => {
              books[index].parts[pindex].scripts[sindex].chapters[cindex] = {
                id: cindex + 1,
                ..._.omit(chapter, 'id')
              }
              chapter.verses.forEach((verse, vindex) => {
                books[index].parts[pindex].scripts[sindex].chapters[cindex].verses[vindex] = {
                  id: vindex + 1,
                  ..._.omit(verse, 'id')
                }
              })
            })
          })
        })
      })
      return new Books(books)
    } catch (error) {
      console.error('webible-init error: ' + error)
      throw Error
    }
  }

  public get mlist(): IBook[] {
    return this.list.map((book) => ({ ..._.omit(book, 'parts'), parts: [] }))
  }

  public getBook(bookId: number):IBook | null {
    return this.list.find((book) => book.id === bookId)??null
  }

  public listScript(bookId: number): IPart[]{
    const parts: IPart[] = []
    this.getBook(bookId)?.parts.forEach((part, pindex) => {
      parts[pindex] = { ..._.omit(part, 'scripts'), scripts: [] }
      part.scripts.forEach((script, index) => {
        parts[pindex].scripts[index] = { ..._.omit(script, 'chapters'), chapters: [] }
      })
    })
    return parts
  }
  public listChapter(qscript: ({id: number,name: string})): (Omit<IChapter, "verses"> | null)[] {
    return this.list.flatMap(book=>book.parts.flatMap( part=>part.scripts.find(script=>script.id===qscript.id && script.name===qscript.name)?.chapters.flatMap(chapter=>_.omit(chapter,'verses'))??null ))
  }
}

interface IBooks {
  [id: number]: IBook
  // list: IBook[]
}
interface IBook {
  id: number
  name: string
  short_name: string
  latin_name: string
  description: string
  language: string
  url: string
  parts: IPart[]
}
interface IPart {
  id: number
  name: string
  latin_name: string
  scripts: IScript[]
}
interface IScript {
  id: number
  name: string
  latin_name: string
  chapters: IChapter[]
}
interface IChapter {
  id: number
  verses: IVerse[]
}
interface IVerse {
  id: number
  pericope: string | null
  text: string
  reference: string[] | null
}

export { Books }
export type { IBook, IPart, IScript , IChapter, IVerse}
