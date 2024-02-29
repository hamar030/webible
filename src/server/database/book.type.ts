interface IBooks {
  [id: number]: IBook
  // list: IBook[]
}
interface IBook {
  id: number
  name: string
  short_name: string
  alt_name: string
  description: string
  language: string
  url: string
  parts: IPart[]
}
interface IPart {
  id: number
  name: string
  alt_name: string
  scripts: IScript[]
}
interface IScript {
  id: number
  name: string
  alt_name: string
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

type TIndex = { book: number; part: number; script: number; chapter: number }

export type { IBooks, IBook, IPart, IScript, IChapter, IVerse, TIndex }
