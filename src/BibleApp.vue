<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  ChevronUpDownIcon,
  ChevronDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/solid'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption
} from '@headlessui/vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { Switch } from '@headlessui/vue'

import { BookList, Book } from './lib/book'

const defaultList = new Book({
  id: 0,
  Name: 'Loading...',
  shortName: 'Loading...',
  latinName: 'Loading...',
  Description: 'Loading...',
  Language: 'en',
  Url: '-',
  Parts: [
    {
      id: 0,
      Name: 'Loading...',
      latinName: 'Loading...',
      Scripts: [
        {
          id: 0,
          Name: 'Loading...',
          latinName: 'loading...',
          Chapters: [
            { id: 0, Verses: [{ id: 0, Text: 'Loading...', Pericope: null, Reference: [] }] }
          ]
        }
      ]
    }
  ]
})
const listBook = ref([defaultList])
const searchQuery = ref('')

const selected = ref({ Book: 0, Part: 0, Script: 0, Chapter: 0, Verse: 0 })
const config = ref({ verseNumber: true, verseInline: false, Pericope: true, readWide: false })

const currentBook = computed(() => {
  return listBook.value[selected.value.Book]
})
const currentPart = computed(() => {
  return currentBook.value.Parts[selected.value.Part]
})
const currentScript = computed(() => {
  return currentPart.value.Scripts[selected.value.Script]
})
const currentChapter = computed(() => {
  return currentScript.value.Chapters[selected.value.Chapter]
})

const filteredBook = computed(() =>
  searchQuery.value === ''
    ? listBook.value
    : listBook.value.filter((book) => {
        return book.Name.toLowerCase()
          .replace(/\s+/g, '')
          .includes(searchQuery.value.toLowerCase().replace(/\s+/g, ''))
      })
)
/* eslint-disable-next-line*/
// const filteredPart = computed(() =>
//   searchQuery.value === ''
//     ? currentBook.value.Parts
//     : currentBook.value.Parts.filter((part) => {
//         return part.Name.toLowerCase()
//           .replace(/\s+/g, '')
//           .includes(searchQuery.value.toLowerCase().replace(/\s+/g, ''))
//       })
// )

const filteredScript = computed(() =>
  searchQuery.value === ''
    ? currentBook.value.Parts.map((part) => {
        return part.Scripts
      })
    : currentBook.value.Parts.map((part) => {
        return part.Scripts.filter((script) => {
          return script.Name.toLowerCase()
            .replace(/\s+/g, '')
            .includes(searchQuery.value.toLowerCase().replace(/\s+/g, ''))
        })
      })
)

const filteredChapter = computed(() =>
  searchQuery.value === ''
    ? currentScript.value.Chapters
    : currentScript.value.Chapters.filter((chapter) => {
        return (chapter.id + 1)
          .toString()
          .match(new RegExp('^' + searchQuery.value.replace(/(\/)|(\\)|(\s+)/g, '')))
      })
)

const filteredVerse = computed(() => {
  // todo: return verses per pericope as paragraph
  // so [[paragraph with pericope][and another paragraph with pericope]]
  return currentChapter.value.Verses.filter((verse) => {
    return verse
  })
})

// really really hard coded to get this things ^_^
// need help, data is not convinient,
// need to change all data structure
const selectedScript = ref(currentPart.value.Scripts[selected.value.Script])
function getIndexOfScript(val: { id: number; Name: string; latinName: string; Chapters: [] }) {
  for (const part of currentBook.value.Parts) {
    let indexPart = currentBook.value.Parts.indexOf(part)
    let indexScript = part.Scripts.indexOf(val)
    if (indexScript >= 0) {
      selected.value.Part = indexPart
      selected.value.Script = indexScript
    }
  }
  checkData()
}

const nextButtonDisable = computed(() => {
  return (
    selected.value.Chapter + 1 == currentScript.value.Chapters.length &&
    selected.value.Script + 1 == currentPart.value.Scripts.length &&
    selected.value.Part + 1 == currentBook.value.Parts.length
  )
})
const prevButtonDisable = computed(() => {
  return selected.value.Chapter == 0 && selected.value.Script == 0 && selected.value.Part == 0
})

function nextCurrentChapter() {
  if (selected.value.Chapter + 1 < currentScript.value.Chapters.length) {
    selected.value.Chapter++
  } else {
    if (selected.value.Script + 1 < currentPart.value.Scripts.length) {
      selected.value.Chapter = 0
      selected.value.Script++
    } else {
      if (selected.value.Part + 1 < currentBook.value.Parts.length) {
        selected.value.Script = 0
        selected.value.Part++
      }
    }
  }
}
function prevCurrentChapter() {
  if (selected.value.Chapter > 0) {
    selected.value.Chapter--
  } else {
    if (selected.value.Script > 0) {
      selected.value.Script--
      selected.value.Chapter = currentScript.value.Chapters.length - 1
    } else {
      if (selected.value.Part > 0) {
        selected.value.Part--
        selected.value.Script = currentPart.value.Scripts.length - 1
        selected.value.Chapter = currentScript.value.Chapters.length - 1
      }
    }
  }
}
function checkData() {
  selected.value.Book = selected.value.Book >= listBook.value.length ? 0 : selected.value.Book
  selected.value.Part =
    selected.value.Part >= currentBook.value.Parts.length ? 0 : selected.value.Part
  selected.value.Script =
    selected.value.Script >= currentPart.value.Scripts.length ? 0 : selected.value.Script
  selected.value.Chapter =
    selected.value.Chapter >= currentScript.value.Chapters.length ? 0 : selected.value.Chapter
  selected.value.Verse =
    selected.value.Verse >= currentChapter.value.Verses.length ? 0 : selected.value.Verse
}
onMounted(async () => {
  const list = await BookList.initialize()
  listBook.value = list?.Books ?? [defaultList]
  let localSelected = localStorage.getItem('selected')
  let localConfig = localStorage.getItem('config')
  if (localSelected == null) {
    localStorage.setItem('selected', JSON.stringify(selected.value))
  } else {
    selected.value = JSON.parse(localSelected)
    checkData()
    localStorage.setItem('selected', JSON.stringify(selected.value))
  }
  watch(selected.value, (val) => {
    localStorage.setItem('selected', JSON.stringify(val))
  })

  if (localConfig == null) {
    localStorage.setItem('config', JSON.stringify(config.value))
  } else {
    config.value = JSON.parse(localConfig)
  }
  watch(config.value, (val) => {
    localStorage.setItem('config', JSON.stringify(val))
  })

  // console.log(currentBook.value.Name)
  // console.log(listBook.value)
})
</script>
<template>
  <div class="w-full">
    <div id="bibleMenuBar" class="sticky top-0 z-10">
      <div
        class="absolute inset-0 h-full w-full bg-white/70 backdrop-blur-[25px] dark:bg-slate-900/70"
      ></div>
      <!--  /** menu **/ -->
      <div class="relative flex flex-row">
        <div class="flex flex-row md:flex-1">
          <div class="flex w-full flex-row md:min-w-60">
            <span v-show="false" class="mr-2 mt-2 min-w-32 self-center">Book Version:</span>
            <div class="w-full">
              <Combobox v-model="selected.Book" text-gray-900 @update:model-value="checkData">
                <div class="relative mt-2">
                  <ComboboxInput
                    class="w-full rounded-sm border-none bg-transparent py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 ring-blue-500 focus:outline-none focus:ring-1 dark:text-gray-100"
                    :display-value="() => currentBook.Name"
                    @change="searchQuery = $event.target.value"
                  />
                  <span
                    v-show="currentBook.latinName != null"
                    class="absolute inset-y-0 right-0 inline-flex items-center pr-8 text-sm text-gray-400"
                    >{{ currentBook.latinName }}</span
                  >
                  <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </ComboboxButton>
                  <Transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-out"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                    @after-leave="searchQuery = ''"
                  >
                    <ComboboxOptions
                      class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white/10 p-1 text-base shadow-lg ring-1 ring-black/5 backdrop-blur-sm focus:outline-none dark:bg-slate-900/10 sm:text-sm"
                    >
                      <div
                        v-if="filteredBook.length === 0 && searchQuery !== ''"
                        class="relative cursor-default select-none px-4 py-2 text-gray-700"
                      >
                        Nothing found.
                      </div>
                      <ComboboxOption
                        v-for="(book, index) in filteredBook"
                        :key="index"
                        v-slot="{ active, selected }"
                        :value="book.id"
                        class="relative"
                      >
                        <li
                          class="rounded-md p-2"
                          :class="[
                            active
                              ? 'bg-blue-500 text-white'
                              : 'bg-transparent text-gray-900 dark:text-white'
                          ]"
                        >
                          {{ book.Name }}
                          <span
                            v-show="book.latinName != null"
                            text-gray-900
                            :class="[active ? 'text-gray-200' : 'text-gray-400']"
                          >
                            | {{ book.latinName }}</span
                          >
                          <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                            <CheckIcon v-show="selected" class="h4 w-4" />
                          </span>
                        </li>
                      </ComboboxOption>
                    </ComboboxOptions>
                  </Transition>
                </div>
              </Combobox>
            </div>
          </div>
          <div class="md:show sr-only flex w-full flex-row p-1 md:min-w-60">
            <span v-show="false" class="mr-2 mt-2 min-w-32 self-center">Book Part: </span>
            <div class="w-full">
              <div class="relative mt-2">
                <input
                  disabled
                  type="text"
                  :value="currentPart.Name"
                  class="w-full rounded-sm border-none bg-transparent py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 ring-blue-500 focus:outline-none focus:ring-1 dark:text-gray-100"
                />
                <span
                  v-show="currentPart.latinName != null"
                  class="absolute inset-y-0 right-0 flex items-center pr-8 text-sm text-gray-400"
                  :class="{ 'text-gray-200': false, 'text-gray-400': !false }"
                >
                  {{ currentPart.latinName }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row">
          <div class="flex w-full flex-row p-1 md:min-w-60">
            <span class="sr-only mr-2 mt-2 min-w-32 self-center">Script: </span>
            <div class="w-full">
              <Combobox
                v-model="selectedScript"
                @update:model-value="(value) => getIndexOfScript(value)"
              >
                <div class="relative mt-2">
                  <ComboboxInput
                    class="w-full rounded-sm border-none bg-transparent py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 ring-blue-500 focus:outline-none focus:ring-1 dark:text-gray-100"
                    :display-value="() => currentScript.Name"
                    @change="searchQuery = $event.target.value"
                  />
                  <span
                    v-if="currentScript.latinName != null"
                    class="absolute inset-y-0 right-0 flex items-center pr-8 text-sm text-gray-400"
                    >{{ currentScript.latinName }}</span
                  >
                  <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </ComboboxButton>
                  <Transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-out"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                    @after-leave="searchQuery = ''"
                  >
                    <ComboboxOptions
                      class="absolute z-[1] mt-1 max-h-60 w-full origin-top-right divide-y divide-gray-100 overflow-auto rounded-md bg-white/10 text-base shadow-lg ring-1 ring-black/5 backdrop-blur-sm focus:outline-none dark:bg-slate-900/10 sm:text-sm"
                    >
                      <div
                        v-if="filteredScript.flat().length === 0 && searchQuery !== ''"
                        class="relative cursor-default select-none px-4 py-2 text-gray-700"
                      >
                        Nothing found.
                      </div>
                      <ComboboxOptions
                        v-for="(part, part_index) in filteredScript"
                        :key="part_index"
                        as="div"
                        :class="
                          filteredScript.flat().length === 0 && searchQuery !== '' ? '' : 'p-1'
                        "
                      >
                        <div v-if="part.length !== 0" class="p-2 text-gray-400">
                          <span>{{ currentBook.Parts[part_index].Name }}</span>
                          <span v-show="currentBook.Parts[part_index].latinName != null">
                            | {{ currentBook.Parts[part_index].latinName }}</span
                          >
                        </div>
                        <ComboboxOption
                          v-for="(script, index) in part"
                          :key="part_index + '.' + index"
                          v-slot="{ active, selected }"
                          :value="script"
                          class="relative"
                        >
                          <li
                            class="rounded-md p-2"
                            :class="[
                              active
                                ? 'bg-blue-500 text-white'
                                : 'bg-transparent text-gray-900 dark:text-white'
                            ]"
                          >
                            {{ script.Name }}
                            <span
                              v-show="script.latinName != null"
                              text-gray-900
                              :class="[active ? 'text-gray-200' : 'text-gray-400']"
                            >
                              | {{ script.latinName }}</span
                            >
                            <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                              <CheckIcon v-show="selected" class="h4 w-4" />
                            </span>
                          </li>
                        </ComboboxOption>
                      </ComboboxOptions>
                    </ComboboxOptions>
                  </Transition>
                </div>
              </Combobox>
            </div>
          </div>
          <div class="flex min-w-28 grow-0 flex-row p-1">
            <span class="sr-only mr-2 mt-2 min-w-32 self-center">Chapter: </span>
            <div class="w-full">
              <Combobox v-model.numbers="selected.Chapter" @update:model-value="checkData">
                <div class="relative mt-2">
                  <ComboboxInput
                    class="w-full rounded-sm border-none bg-transparent py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 ring-blue-500 focus:outline-none focus:ring-1 dark:text-gray-100"
                    :display-value="() => (currentChapter.id + 1).toString()"
                    @change="searchQuery = $event.target.value"
                  />
                  <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </ComboboxButton>
                  <Transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-out"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                    @after-leave="searchQuery = ''"
                  >
                    <ComboboxOptions
                      class="absolute z-[1] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white/10 p-1 text-base shadow-lg ring-1 ring-black/5 backdrop-blur-sm focus:outline-none dark:bg-slate-900/10 sm:text-sm"
                    >
                      <div
                        v-if="filteredChapter.length === 0 && searchQuery !== ''"
                        class="relative cursor-default select-none px-2 py-2 text-gray-700"
                      >
                        Nothing found.
                      </div>
                      <ComboboxOption
                        v-for="(chapter, index) in filteredChapter"
                        :key="index"
                        v-slot="{ active, selected }"
                        :value="chapter.id"
                        class="relative"
                      >
                        <li
                          class="rounded-md p-2"
                          :class="{
                            'bg-blue-500 text-white': active,
                            'bg-transparent text-gray-900 dark:text-white': !active
                          }"
                        >
                          {{ chapter.id + 1 }}
                          <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                            <CheckIcon v-show="selected" class="h4 w-4" />
                          </span>
                        </li>
                      </ComboboxOption>
                    </ComboboxOptions>
                  </Transition>
                </div>
              </Combobox>
            </div>
          </div>
        </div>
      </div>
      <!--  /** menu config **/ -->
      <div class="relative">
        <div class="flex flex-row items-center justify-between p-1 text-xs">
          <div class="flex flex-1 flex-row">
            <div class="text-left">
              <button
                class="inline-flex w-full justify-center rounded-md px-4 py-2 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                :disabled="prevButtonDisable"
                @click="prevCurrentChapter"
              >
                <ChevronLeftIcon class="-ml-1 mr-2 h-4 w-4" />Previous
              </button>
            </div>
            <Menu as="div" class="relative inline-block text-left">
              <div>
                <MenuButton
                  class="inline-flex w-full justify-center rounded-md px-4 py-2 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                >
                  Options
                  <ChevronDownIcon class="-mr-1 ml-2 h-4 w-4" aria-hidden="true" />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems
                  class="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white/10 shadow-lg ring-1 ring-black/5 backdrop-blur focus:outline-none dark:bg-slate-900/10"
                >
                  <div class="p-1">
                    <MenuItem v-slot="{ active }" class="relative">
                      <Switch
                        v-slot="{ checked }"
                        v-model="config.verseNumber"
                        :class="[
                          active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white',
                          'group text-sm'
                        ]"
                        class="flex w-full items-center rounded-md p-2"
                      >
                        Show Verse Number
                        <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                          <CheckIcon v-show="checked" class="h4 w-4" />
                        </span>
                      </Switch>
                    </MenuItem>
                    <MenuItem v-slot="{ active }" class="relative">
                      <Switch
                        v-slot="{ checked }"
                        v-model="config.verseInline"
                        :class="[
                          active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white',
                          'group text-sm'
                        ]"
                        class="flex w-full items-center rounded-md p-2"
                        >Show Verse Inline
                        <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                          <CheckIcon v-show="checked" class="h4 w-4" />
                        </span>
                      </Switch>
                    </MenuItem>
                  </div>
                  <div class="p-1">
                    <MenuItem v-slot="{ active }" class="relative">
                      <Switch
                        v-slot="{ checked }"
                        v-model="config.Pericope"
                        :class="[
                          active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white',
                          'group text-sm'
                        ]"
                        class="flex w-full items-center rounded-md p-2"
                        >Show Pericope
                        <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                          <CheckIcon v-show="checked" class="h4 w-4" />
                        </span>
                      </Switch>
                    </MenuItem>
                  </div>
                  <div class="p-1">
                    <MenuItem v-slot="{ active }" class="relative">
                      <Switch
                        v-slot="{ checked }"
                        v-model="config.readWide"
                        :class="[
                          active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white',
                          'group text-sm'
                        ]"
                        class="flex w-full items-center rounded-md p-2"
                        >Wide Reading
                        <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                          <CheckIcon v-show="checked" class="h4 w-4" />
                        </span>
                      </Switch>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
          <div class="text-left">
            <button
              class="inline-flex w-full justify-center rounded-md px-4 py-2 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
              :disabled="nextButtonDisable"
              @click="nextCurrentChapter"
            >
              Next
              <ChevronRightIcon class="-mr-1 ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="py-5">
      <hr />
    </div>
    <!--  /** content **/ -->
    <div class="flex justify-center">
      <article
        class="prose w-full font-display dark:prose-invert"
        :class="config.readWide ? 'max-w-none' : ''"
      >
        <p>
          <span v-for="(verse, index) in filteredVerse" :key="index">
            <br v-if="verse.Pericope != null && index != 0" />
            <h3 v-if="verse.Pericope != null && config.Pericope">{{ verse.Pericope }}</h3>
            <span
              :class="{
                block: !config.verseInline,
                'mx-1': config.verseInline,
                'mt-6': index == 0 && (verse.Pericope == null || !config.Pericope)
              }"
            >
              <sup v-show="config.verseNumber" class="text-xs font-bold"
                >{{ verse.id + 1 }}&nbsp;</sup
              >
              <span>{{ verse.Text }}</span>
            </span>
          </span>
        </p>
      </article>
    </div>
    <div>
      <div class="py-5">
        <hr />
        <div class="pt-5 text-xs">
          Remember: Reading from Torah Scroll or Origin Scripture is more better than this.
        </div>
      </div>
    </div>
  </div>
</template>
