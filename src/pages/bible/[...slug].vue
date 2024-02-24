<template>
  <div class="text-nowrap">
    list book:
    <ul class="list-disc">
      <li
        v-for="book in useBook.listBooks"
        :key="book.id"
      >
        <button @click="selectBook(book)">{{ book }}</button>
      </li>
    </ul>
    <hr />
    list parts:
    <ul class="list-disc">
      <li
        v-for="part in useBook.listScripts"
        :key="part.id"
      >
        {{ part.name }}
        list scripts:
        <ul class="list-disc">
          <li
            v-for="script in part.scripts"
            :key="script.id"
          >
            <button @click="selectScript(script)">{{ script }}</button>
          </li>
        </ul>
      </li>
    </ul>
    <hr />
    list chapters:
    <ul>
      <li
        v-for="chapter in useBook.listChapter"
        :key="chapter?.id"
      >
        <button v-if="chapter!=null" @click="selectChapter(chapter)">{{ chapter }}</button>
      </li>
    </ul>
    <hr />
    <p>
      selected book: {{ useBook.selectedBook }}
      <br />
      selected script: {{ useBook.selectedScript }}
      <br />
      selected chapter: {{ useBook.selectedChapter }}
    </p>
  </div>
</template>

<script async setup lang="ts">
// import {
//   ChevronUpDownIcon,
//   ChevronDownIcon,
//   CheckIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon
// } from '@heroicons/vue/24/solid'

import { useNuxtApp } from '#imports'
import { definePageMeta } from '#imports'
import { useBookStore } from '#imports'
import { ref, watch } from 'vue'
import type { IBook, IPart, IScript, IChapter } from '@/stores/Books'
definePageMeta({
  title: 'Webible - Bible',
  layout: 'reading'
})

const { $client } = useNuxtApp()
const useBook = useBookStore()

Promise.all([
  await $client.bible.list.query(),
  await $client.bible.script.list.query({ bookId: 1 }),
  await $client.bible.script.chapter.list.query({ script: { id: 1, name: 'Script Name' } })
]).then((data) => {
  useBook.init(data[0], data[1], data[2])
})
// need to change
const selectBook = async (book: Omit<IBook, 'parts'>) => {
  const scripts = await $client.bible.script.list.query({ bookId: book.id })
  const chapters = await $client.bible.script.chapter.list.query({
    script: {
      id: scripts[0].scripts[0].id,
      name: scripts[0].scripts[0].name
    }
  })
  useBook.selectBook(book)
  useBook.set_listScripts(scripts)
  useBook.set_listChapters(chapters)
  useBook.selectScript(scripts[0].scripts[0])
  useBook.selectChapter(chapters[0] as Omit<IChapter, 'verses'> )
}
const selectScript = async (script: IScript) => {
  const chapters = await $client.bible.script.chapter.list.query({
    script: { id: script.id, name: script.name }
  })
  useBook.selectScript(script)
  useBook.set_listChapters(chapters)
  useBook.selectChapter(chapters[0] as Omit<IChapter, 'verses'> )
}
const selectChapter = async (chapter: Omit<IChapter, 'verses'> | null) => {
  useBook.selectedChapter = chapter as Omit<IChapter, 'verses'>
}
// const a = ref(useBook.selectedBook)
// watch(a, async (book) => {

// })
</script>

<style scoped></style>
