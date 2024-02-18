import YAML from 'yaml'

// need to separate it with env
//const LIST_BOOK_URL: string = '/data/list_book.yaml'
const LIST_BOOK_URL: string = 'https://gist.githubusercontent.com/hamar030/3ed4a54ec9f2e8e1721627714193fdcc/raw/list_book.yaml'

async function dataFetch(url: string) {
  //return YAML.parse(await (await (await fetch(url)).blob()).text())
  return fetch(url)
    .then((res) => res.blob())
    .then((blb) => blb.text())
    .then((txt) => {
      return YAML.parse(txt)
    })
}

interface IBookList {
  Books: IBook[]
}

interface IBook {
  id: number
  Name: string
  shortName: string
  latinName: string
  Description: string
  Language: string
  Url: string
  Parts: IPart[]
}
interface IPart {
  id: number
  Name: string
  latinName: string
  Scripts: IScript[]
}
interface IScript {
  id: number
  Name: string
  latinName: string
  Chapters: IChapter[]
}
interface IChapter {
  id: number
  Verses: IVerse[]
}
interface IVerse {
  id: number
  Pericope: string | null
  Text: string
  Reference: string[] | null
}

export class BookList implements IBookList {
  Books: IBook[]

  private constructor(init: IBook[]) {
    this.Books = init
  }

  public static async initialize() {
    try {
      const list = await dataFetch(LIST_BOOK_URL).then((res) => {
        return res.listBook
      })
      const listBook: IBook[] = []
      for (const [index, book] of list.entries()) {
        const data = await dataFetch(book.url)
        listBook[index] = {
          id: index,
          Name: data.name,
          shortName: data.short_name,
          latinName: data.latin_name,
          Description: data.desc,
          Language: data.lang,
          Url: book.url,
          Parts: []
        }
        data.parts.forEach(
          (part: { name: string; latin_name: string; scripts: [] }, pindex: number) => {
            listBook[index].Parts[pindex] = {
              id: pindex,
              Name: part.name,
              latinName: part.latin_name,
              Scripts: []
            }
            part.scripts.forEach(
              (script: { name: string; latin_name: string; chapters: [] }, sindex: number) => {
                listBook[index].Parts[pindex].Scripts[sindex] = {
                  id: sindex,
                  Name: script.name,
                  latinName: script.latin_name,
                  Chapters: []
                }
                script.chapters.forEach((chapter: { verses: [] }, cindex: number) => {
                  listBook[index].Parts[pindex].Scripts[sindex].Chapters[cindex] = {
                    id: cindex,
                    Verses: []
                  }
                  chapter.verses.forEach(
                    (
                      verse: { pericope: string | null; text: string; references: [] | null },
                      vindex: number
                    ) => {
                      listBook[index].Parts[pindex].Scripts[sindex].Chapters[cindex].Verses[
                        vindex
                      ] = {
                        id: vindex,
                        Pericope: verse.pericope,
                        Text: verse.text,
                        Reference: verse.references
                      }
                    }
                  )
                })
              }
            )
          }
        )
      }
      return new BookList(listBook)
    } catch (error) {
      console.error('webible init: ' + error)
    }
  }
}

export class Book implements IBook {
  id: number
  Name: string
  shortName: string
  latinName: string
  Description: string
  Language: string
  Url: string
  Parts: IPart[]

  constructor(data: IBook) {
    this.id = data.id
    this.Name = data.Name
    this.shortName = data.shortName
    this.latinName = data.latinName
    this.Description = data.Description
    this.Language = data.Language
    this.Url = data.Url
    this.Parts = data.Parts
  }

  //Name
  // getCurrent() {
  //   return ''
  // }

  // static async initialize(dataUrl: string) {
  //   try {
  //     const data: IBookList = YAML.parse(
  //       await (await (await fetch(dataUrl)).blob()).text()
  //     ).book_list
  //     return new Book(data)

  //     // if (localStorage.getItem('webibleCurrentData') == null) {
  //     //   localStorage.setItem('webibleCurrentData', JSON.stringify(currentData))
  //     // } else {
  //     //   const localData = JSON.parse(localStorage.getItem('webibleCurrentData'))
  //     //   currentData.book = localData.book
  //     //   currentData.part = localData.part
  //     //   currentData.script = localData.script
  //     //   currentData.chapter = localData.chapter
  //     //   currentData.verses = localData.verses
  //     // }
  //   } catch (error) {
  //     console.error('bookInit: ' + error)
  //   }
  // }
}
