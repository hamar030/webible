// import dotenv from 'dotenv'
import process from 'process'
import fs from 'fs'
import YAML from 'yaml'
import _ from 'lodash'
// import { throws } from 'assert'
import type { IBooks, IBook, IPart, IScript, IChapter, IVerse, TIndex } from './book.type'
// dotenv.config()

const LIST_BOOK_URL = <string>process.env.LIST_BOOK_URL
const GITHUB_TOKEN = <string>process.env.GITHUB_TOKEN
// todo:
// use cached function
// and use github api maybe, for faster fetching
const dataLoad = async (url: string) => {
  if (process.env.NODE_ENV === 'production') {
    console.debug(`fetch from : ${url}`)
    return await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.base64+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
      .then((res) => res.blob())
      .then((blb) => blb.text())
      .then((txt) => {
        return YAML.parse(txt)
      })
  } else {
    console.debug(`load file : ${url}`)
    if (url.startsWith('/')) url = `.${url}`
    return YAML.parse(fs.readFileSync(url, 'utf8'))
  }
}

class Books implements IBooks {
  [id: number]: IBook
  list: IBook[]

  private constructor(init: IBook[]) {
    this.list = init
  }

  // getter
  public get mlist(): IBook[] {
    return this.list.map((book) => ({ ..._.omit(book, 'parts'), parts: [] as IPart[] }))
  }
  // action

  /**
   *  get book from url and return it to new array of book.
   */
  public static initialize = async () => {
    // todo: yaml schema?
    console.time('webible-init')
    console.group()
    console.log('webible-init: start')
    try {
      if (LIST_BOOK_URL === undefined) throw new Error('Cant get url from .env')
      console.log(`webible-init: fetching data from ${LIST_BOOK_URL}`)
      // console.group()
      const list = await dataLoad(LIST_BOOK_URL).then((data) => data.books)
      const books: IBook[] = []

      for await (const [index, lst] of list.entries()) {
        const data = await dataLoad(lst.url)
        books[index] = { id: index + 1, ...lst, ...data }
      }
      // console.groupEnd()

      console.log('webible-init: data fetched, next to processing data')

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
      console.log('webible-init: complete')
      console.timeEnd('webible-init')
      console.groupEnd()
      return new Books(books)
    } catch (error) {
      throw Error('webible-init error: ' + error)
    }
  }
  //get name from url then to index
  public isAvailable = (bookName: string, scriptName: string, chapterId: number) => {
    const index = this.getIndexByUrlParams(bookName, scriptName, chapterId)
    if (index.book >= 0 && index.part >= 0 && index.script >= 0 && index.chapter >= 0) {
      // const books = this.initData(index)
      return true
    } else {
      // reason include maybe?
      return false
    }
  }
  public initData = (index: TIndex) => {
    const { book: bIn, part: pIn, script: sIn, chapter: cIn } = index
    const books = this.mlist
    // filling the selected part with scripts without chapter
    books[bIn].parts = this.listPartsWithScripts(_.pick(index, 'book'))
    // filling the selected chapters without verses
    books[bIn].parts[pIn].scripts[sIn].chapters = this.listChapters(_.omit(index, 'chapterIndex'))
    // filling the selected verses
    books[bIn].parts[pIn].scripts[sIn].chapters[cIn].verses = this.listVerses(index)
    return books
  }
  public getInitByParams = (bookName: string, scriptName: string, chapterId: number) => {
    const index = this.getIndexByUrlParams(bookName, scriptName, chapterId)
    return { books: this.initData(index), index: index }
  }

  // get index and return url name
  public getUrlParamsByIndex = (index: TIndex) => {
    const bookName = this.list[index.book].short_name
    const scriptName = this.list[index.book].parts[index.part].scripts[index.script].name
    const chapterId =
      this.list[index.book].parts[index.part].scripts[index.script].chapters[index.chapter].id
    return { bookName, scriptName, chapterId }
  }
  public getUrlParamsByBook = (bookName: string) => {
    return _.camelCase(
      this.list.find((book) => _.camelCase(book.short_name) === _.camelCase(bookName))?.parts[0]
        .scripts[0].name
    )
  }
  public getIndexByUrlParams = (bookName: string, scriptName: string, chapterId: number) => {
    const index = { book: -1, part: -1, script: -1, chapter: -1 }
    const check = (in1: string, in2: string) => {
      // console.log(
      //   _.camelCase(in1) + '===' + _.camelCase(in2),
      //   _.camelCase(in1) === _.camelCase(in2)
      // )
      return _.camelCase(in1) === _.camelCase(in2)
    }
    index.book = this.list.findIndex(
      (book) => check(book.short_name, bookName)
      // || check(book.name, bookName) ||
      // check(book.alt_name, bookName)
    )
    if (index.book >= 0) {
      index.part = this.list[index.book].parts.findIndex((part) =>
        part.scripts.find(
          (script) => check(script.name, scriptName)
          // || check(script.alt_name, scriptName)
        )
      )
      if (index.part >= 0) {
        index.script = this.list[index.book].parts[index.part].scripts.findIndex(
          (script) => check(script.name, scriptName)
          // || check(script.alt_name, scriptName)
        )
        if (index.script >= 0) {
          index.chapter = this.list[index.book].parts[index.part].scripts[
            index.script
          ].chapters.findIndex((chap) => chap.id === chapterId)
        }
      }
    }
    return index
  }

  public findBookById(bookId: number): IBook | null {
    return this.list.find((book) => book.id === bookId) ?? null
  }

  public listParts = (index: Pick<TIndex, 'book'>): IPart[] => {
    return this.list[index.book].parts.map((part) => ({
      ..._.omit(part, 'scripts'),
      scripts: [] as IScript[]
    }))
  }
  public listScripts = (index: { book: number; part: number }): IScript[] => {
    return this.list[index.book].parts[index.part].scripts.map((script) => ({
      ..._.omit(script, 'chapters'),
      chapters: [] as IChapter[]
    }))
  }
  public listChapters(index: Omit<TIndex, 'chapter'>): IChapter[] {
    return (
      this.list[index.book].parts[index.part].scripts[index.script].chapters.map((chapter) => ({
        ..._.omit(chapter, 'verses'),
        verses: []
      })) ?? null
    )
  }
  public listVerses(index: TIndex): IVerse[] {
    return this.list[index.book].parts[index.part].scripts[index.script].chapters[index.chapter]
      .verses
  }

  public listPartsWithScripts(index: Pick<TIndex, 'book'>): IPart[] {
    const parts: IPart[] = []
    this.list[index.book].parts.forEach((part, pindex) => {
      parts[pindex] = { ..._.omit(part, 'scripts'), scripts: [] }
      part.scripts.forEach((script, index) => {
        parts[pindex].scripts[index] = { ..._.omit(script, 'chapters'), chapters: [] }
      })
    })
    return parts
  }

  // public nextChapter(index: TIndex){

  // }
  // public prevChapter(index: TIndex){

  // }
}

export { Books }
