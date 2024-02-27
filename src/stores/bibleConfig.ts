import { defineStore } from 'pinia'

export const useBibleConfigStore = defineStore({
  id: 'BibleConfigStore',
  state: () => ({ 
    readWide: false,
    verseNumber: true,
    verseInline: false,
    pericope: true
  }),
  actions: {
    toogleWide(){this.readWide = !this.readWide},
    toogleVerseNumber(){this.verseNumber = !this.verseNumber},
    toogleVerseInline(){this.verseInline = !this.verseInline},
    tooglePericope(){this.pericope = !this.pericope}

  },
  // get:{},
})
