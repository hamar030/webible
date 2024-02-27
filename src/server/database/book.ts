import YAML from 'yaml'
import fs from 'fs'
import _ from 'lodash'

// need to separate it with env
const LIST_BOOK_URL: string = '/data/list_book.yaml'
//const LIST_BOOK_URL: string = 'https://gist.githubusercontent.com/hamar030/3ed4a54ec9f2e8e1721627714193fdcc/raw/list_book.yaml'

const dataFetch = async (url: string) => {
  //return YAML.parse(await (await (await fetch(url)).blob()).text())

  // if (url.startsWith('/')) url = 'http://localhost:8888/' + url
  // return await fetch(url)
  // .then((res) => res.blob())
  // .then((blb) => blb.text())
  // .then((txt) => {
  // return YAML.parse(txt)
  // })
  if (url.startsWith('/')) url = '.' + url
  return YAML.parse(fs.readFileSync(url, 'utf8'))
}

class Books implements IBooks {
  [id: number]: IBook
  list: IBook[]

  private constructor(init: IBook[]) {
    this.list = init
  }

  // getter
  public get mlist(): IBook[] {
    return this.list.map((book) => ({ ..._.omit(book, 'parts'), parts: [] }))
  }
  /**
   * get init data
   */
  public get initData(): IBook[] {
    const index = { book: 0, part: 0, script: 0, chapter: 0 }
    const bk = this.mlist
    bk[0].parts = this.listScript(1)
    bk[0].parts[0].scripts[0].chapters = this.list[0].parts[0].scripts[0].chapters.map(
      (chapter) => ({ ..._.omit(chapter, 'verses'), verses: [] as IVerse[] })
    )
    bk[0].parts[0].scripts[0].chapters[0].verses = this.listVerse(index)
    return bk
  }
  // action

  /**
   *  get book from url and return it to new array of book.
   */
  public static async initialize() {
    try {
      const list = await dataFetch(LIST_BOOK_URL).then((data) => data.listBook)
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
  public getBook(bookId: number): IBook | null {
    return this.list.find((book) => book.id === bookId) ?? null
  }
  public listScript(bookId: number): IPart[] {
    const parts: IPart[] = []
    this.getBook(bookId)?.parts.forEach((part, pindex) => {
      parts[pindex] = { ..._.omit(part, 'scripts'), scripts: [] }
      part.scripts.forEach((script, index) => {
        parts[pindex].scripts[index] = { ..._.omit(script, 'chapters'), chapters: [] }
      })
    })
    return parts
  }
  public listChapter(index: {
    book: number
    part: number
    script: number
  }): IChapter[] {
    return this.list[index.book].parts[index.part].scripts[index.script].chapters.map((chapter) => ({ ..._.omit(chapter, 'verses'), verses: [] })) ?? null
  }
  public listVerse(index: {
    book: number
    part: number
    script: number
    chapter: number
  }): IVerse[] {
    return this.list[index.book].parts[index.part].scripts[index.script].chapters[index.chapter]
      .verses
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
  latin_name: string // need to channge to alt name
  desc: string //change this to description
  lang: string // change this to language
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
export type { IBook, IPart, IScript, IChapter, IVerse }
