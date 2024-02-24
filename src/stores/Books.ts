import type { IBook, IChapter, IPart, IScript } from '@/server/database/book'

export const useBookStore = defineStore('BooksStore', {
  state: () => ({
    listBooks: [{}] as Omit<IBook, 'parts'>[],
    listScripts: [{}] as IPart[],
    listChapter: [{}] as (Omit<IChapter, 'verses'> | null)[],

    selectedBook: {} as Omit<IBook, 'parts'>,
    selectedScript: {} as Omit<IScript, 'chapters'>,
    selectedChapter: {} as Omit<IChapter, 'verses'>
  }),
  actions: {
    async init(
      books: Omit<IBook, 'parts'>[],
      scripts: IPart[],
      chapters: (Omit<IChapter, 'verses'> | null)[]
    ) {
      // const { data: list_books } = await $client.bible.list.useQuery()
      this.listBooks = books
      this.listScripts = scripts
      this.listChapter = chapters
      this.selectedBook = books[0]
      this.selectedScript = scripts[0].scripts[0]
      this.selectedChapter = chapters[0] as Omit<IChapter, 'verses'>
    },
    async selectBook(book: Omit<IBook, 'parts'>) {
      this.selectedBook = book
      // this.listScripts = await $client.bible.script.list.query({
      //   bookId: this.selectedBook?.id ?? 1
      // })
    },
    set_listScripts(data: IPart[]) {
      this.listScripts = data
    },
    set_listChapters(data: (Omit<IChapter, 'verses'> | null)[]) {
      this.listChapter = data
    },
    selectScript(script: Omit<IScript, 'chapters'>) {
      this.selectedScript = script
    },
    selectChapter(chapter: Omit<IChapter, 'verses'>) {
      this.selectedChapter = chapter
    }
  },
  getters: {}
})

export type { IBook, IPart, IScript, IChapter, IVerse }
