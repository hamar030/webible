// import { useBookStore } from '#imports'

export default defineNuxtRouteMiddleware(async (to) => {
  const { $trpc } = useNuxtApp()
  // const useBooks = useBookStore

  const { bookName: tBN, scriptName: tSN, chapterId: tCI } = to.params
  // if (process.server) {
  // console.debug(`book: ${tBN === ''}, script: ${tSN === ''}, chapter: ${tCI === ''}`)
  if (tBN === '' || tSN === '' || tCI === '') {
    const query = { qBN: '', qSN: '', qCI: 1 }
    if (tBN === '') {
      // todo: get from last visit
      // get url name from index 0, next get index from persisted storage
      const {
        bookName: uBN,
        scriptName: uSN,
        chapterId: uCI
      } = await $trpc.bible.getUrlParams.query({
        index: { book: 0, part: 0, script: 0, chapter: 0 }
      })
      query.qBN = uBN
      query.qSN = uSN
      query.qCI = uCI
    } else {
      let data = ''
      if (tSN === '') {
        data = await $trpc.bible.getUrlParamsByBook.query({ bookName: tBN.toString() })
        if (isNil(data)) {
          abortNavigation({
            statusCode: 404,
            statusMessage: `Page not found ${to.fullPath}`,
            message: `Page not found ${to.fullPath}`
          })
        }
      }
      query.qBN = tBN.toString().toLowerCase()
      query.qSN = tSN === '' ? data : tSN.toString().toLowerCase()
      query.qCI = tCI === '' ? 1 : parseInt(tCI.toString())
    }
    return navigateTo(`/bible/${useKebabCase(query.qBN)}/${useKebabCase(query.qSN)}/${query.qCI}`)
  }
  // else {
  //if book not available
  // if (
  //   await useTrpc().bible.isAvailable.query({
  //     bookName: tBN.toString(),
  //     scriptName: tSN.toString(),
  //     chapterId: parseInt(tCI.toString())
  //   })
  // ) {
  //   // data fetching
  //   // useBookStore().
  // } else {
  //   abortNavigation({
  //     statusCode: 404,
  //     statusMessage: `Page not found ${to.fullPath}`,
  //     message: `Page not found ${to.fullPath}`
  //   })
  // }
  // }
  // }else{
  //   console.log(tBN,tSN,tCI)
  // }
})
