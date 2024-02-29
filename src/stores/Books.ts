import { defineStore } from 'pinia'
import type { IBook, IChapter, IScript } from '@/server/database/book.type'
// export type { IBook, IPart, IScript, IChapter, IVerse }
// import { useTrpc() } from '#imports'
/**
 * using useTrpc() on outside instance
 * @returns $useTrpc()
 */
const useTrpc = () => {
  return useNuxtApp().$trpc
}

export const useBookStore = defineStore('BooksStore', () => {
  // State
  const books = ref([{}] as IBook[])
  const selectedIndex = reactive({ book: 0, part: 0, script: 0, chapter: 0 })

  // Getter
  const listBooks = computed(() => books.value)
  const listParts = computed(() => selectedBook.value.parts)
  const listScripts = computed(() => selectedPart.value.scripts)
  const listChapters = computed(() => selectedScript.value.chapters)
  const selectedBook = computed({
    get() {
      return listBooks.value[selectedIndex.book]
    },
    set(book) {
      selectBook(book)
    }
  })
  const selectedPart = computed({
    get() {
      return listParts.value[selectedIndex.part]
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    set(part) {}
  })
  const selectedScript = computed({
    get() {
      return listScripts.value[selectedIndex.script]
    },
    set(script) {
      selectScript(script)
    }
  })
  const selectedChapter = computed({
    get() {
      return listChapters.value[selectedIndex.chapter]
    },
    async set(chapter) {
      selectChapter(chapter)
    }
  })
  const isNextAvailable = computed(() => {
    return (
      selectedIndex.chapter + 1 == listChapters.value.length &&
      selectedIndex.script + 1 == listScripts.value.length &&
      selectedIndex.part + 1 == listParts.value.length
    )
  })
  const isPrevAvailable = computed(() => {
    return selectedIndex.chapter == 0 && selectedIndex.script == 0 && selectedIndex.part == 0
  })

  // // main action
  // const isBookAvailable = async (bookName: string, scriptName: string, chapterId: number) => {
  //   const data = await useTrpc().bible.isAvailable.query({ bookName, scriptName, chapterId })
  //   if (data.available) {
  //     const { books: dBooks, index } = data
  //     books.value = dBooks
  //     selectedIndex.book = index.book
  //     selectedIndex.part = index.part
  //     selectedIndex.script = index.script
  //     selectedIndex.chapter = index.chapter
  //   }
  //   return data.available
  // }
  // todo: push history url

  // const fetchBooks = async()=>{
  //   const data = useTrpc().bible.getInit.
  // }

  const selectBook = async (book: IBook) => {
    const index = books.value.indexOf(book)
    Promise.all([
      await checkListScripts(index),
      await checkListChapters(index, 0, 0),
      await checkListVerse(index, 0, 0, 0)
    ])
    selectedIndex.book = index
    selectedIndex.part = 0
    selectedIndex.script = 0
    selectedIndex.chapter = 0
    // selectScript(selectedBook.value.parts[0].scripts[0])
  }
  const selectScript = async (script: IScript) => {
    const pindex = selectedBook.value.parts.findIndex((part) => part.scripts.includes(script))
    const sindex = selectedBook.value.parts[pindex].scripts.indexOf(script)
    Promise.all([
      await checkListChapters(selectedIndex.book, pindex, sindex),
      await checkListVerse(selectedIndex.book, pindex, sindex, 0)
    ])
    selectedIndex.part = pindex
    selectedIndex.script = sindex
    selectedIndex.chapter = 0
    // selectChapter(selectedScript.value.chapters[0])
  }
  const selectChapter = async (chapter: IChapter) => {
    const index = selectedScript.value.chapters.indexOf(chapter)
    await checkListVerse(selectedIndex.book, selectedIndex.part, selectedIndex.script, index)
    selectedIndex.chapter = index
  }
  const nextChapter = async () => {
    const { book: ib, part: ip, script: is, chapter: ic } = selectedIndex
    if (selectedIndex.chapter + 1 < listChapters.value.length) {
      await checkListVerse(ib, ip, is, ic + 1)
      selectedIndex.chapter++
    } else {
      if (selectedIndex.script + 1 < listScripts.value.length) {
        await checkListChapters(ib, ip, is + 1)
        await checkListVerse(ib, ip, is + 1, 0)
        selectedIndex.chapter = 0
        selectedIndex.script++
      } else {
        if (selectedIndex.part + 1 < listParts.value.length) {
          await checkListChapters(ib, ip + 1, 0)
          await checkListVerse(ib, ip + 1, 0, 0)
          selectedIndex.chapter = 0
          selectedIndex.script = 0
          selectedIndex.part++
        }
      }
    }
  }
  const prevChapter = async () => {
    const { book: ib, part: ip, script: is, chapter: ic } = selectedIndex
    if (selectedIndex.chapter > 0) {
      await checkListVerse(ib, ip, is, ic - 1)
      selectedIndex.chapter--
    } else {
      if (is > 0) {
        await checkListChapters(ib, ip, is - 1)
        await checkListVerse(
          ib,
          ip,
          is - 1,
          selectedPart.value.scripts[is - 1].chapters.length - 1 // chapter index value get from script index before this
        )
        selectedIndex.script--
        selectedIndex.chapter = listChapters.value.length - 1
      } else {
        if (ip > 0) {
          const indexScript = selectedBook.value.parts[ip - 1]
          const scripts = listParts.value[ip - 1].scripts
          await checkListChapters(ib, ip - 1, scripts.length - 1)
          await checkListVerse(
            ib,
            ip - 1,
            scripts.length - 1,
            scripts[indexScript.scripts.length - 1].chapters.length - 1
          )
          selectedIndex.part--
          selectedIndex.script = listScripts.value.length - 1
          selectedIndex.chapter = listChapters.value.length - 1
        }
      }
    }
  }

  // function to check list empty or not and cache it into localdb
  const checkListScripts = async (bookIndex: number) => {
    if (books.value[bookIndex].parts.length === 0) {
      books.value[bookIndex].parts = await useTrpc().bible.script.list.query({
        index: {
          book: bookIndex
        }
      })
      console.debug('downloaded: script-list')
    }
  }
  const checkListChapters = async (bookIndex: number, partIndex: number, scriptIndex: number) => {
    if (books.value[bookIndex].parts[partIndex].scripts[scriptIndex].chapters.length === 0) {
      books.value[bookIndex].parts[partIndex].scripts[scriptIndex].chapters =
        await useTrpc().bible.script.chapter.list.query({
          index: { book: bookIndex, part: partIndex, script: scriptIndex }
        })
      console.debug('downloaded: chapter-list')
    }
  }
  const checkListVerse = async (
    bookIndex: number,
    partIndex: number,
    scriptIndex: number,
    chapterIndex: number
  ) => {
    if (
      books.value[bookIndex].parts[partIndex].scripts[scriptIndex].chapters[chapterIndex].verses
        .length === 0
    ) {
      books.value[bookIndex].parts[partIndex].scripts[scriptIndex].chapters[chapterIndex].verses =
        await useTrpc().bible.script.chapter.verse.list.query({
          index: {
            book: bookIndex,
            part: partIndex,
            script: scriptIndex,
            chapter: chapterIndex
          }
        })
      console.debug('downloaded: verse-list')
    }
  }

  // auto check
  // todo: auto check before change index
  // need to change the code
  // watchEffect(() => {
  //   console.log(selectedIndex)
  // })

  return {
    // State
    books,
    selectedBook,
    selectedPart,
    selectedScript,
    selectedChapter,
    // Getter
    listBooks,
    listParts,
    listScripts,
    listChapters,
    isNextAvailable,
    isPrevAvailable,
    // Actions
    // isBookAvailable,
    selectBook,
    selectScript,
    selectChapter,
    nextChapter,
    prevChapter
  }
})

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBookStore, import.meta.hot))
}
