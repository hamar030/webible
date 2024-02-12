<script setup lang="ts">
import YAML from 'yaml'
import { ref, reactive, computed, onMounted } from 'vue'
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
//import { Swiper, SwiperSlide, useSwiper } from 'swiper/vue'
//import { Navigation, Pagination, Scrollbar, A11y, Virtual, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/scrollbar'
import 'swiper/css/mousewheel'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/virtual'

/**************** data url  ****************/
/* example data url */
//const data_url = "https://gist.githubusercontent.com/hamar030/3ed4a54ec9f2e8e1721627714193fdcc/raw/example_data.yaml"
//const data_url = "/data/example_data.yaml"
/* bible list data url */
//const data_url = "https://gist.githubusercontent.com/hamar030/3ed4a54ec9f2e8e1721627714193fdcc/raw/list-bible.yaml"
//const data_url = "https://gist.githubusercontent.com/hamar030/3ed4a54ec9f2e8e1721627714193fdcc/raw/id-ilt3.yaml"
const data_url = '/data/id-ilt3.yaml'
//const data_url = '/data/he-mhb.yaml'
//const data_url = "/data/list-bible.yaml"

/**************** data proccess  ****************/

const showVerseNumber = ref(true)
const showVerseInline = ref(false)
const showPericope = ref(true)
const articleInWide = ref(false)
const query = ref('')
//const sliderModules = [Pagination, Navigation, Virtual, Mousewheel, Scrollbar]

const dataBook = reactive({
  book_list: [
    {
      name: 'Book Name',
      short_name: 'Short Name',
      latin_name: 'Latin Name',
      desc: 'Description',
      lang: 'en',
      url: 'url',
      parts: [
        {
          name: 'Part Name',
          latin_name: 'Part Latin Name',
          scripts: [
            {
              name: 'Script Name',
              latin_name: 'Script Latin Name',
              chapters: [
                {
                  verses: [
                    {
                      text: 'verse text',
                      pericope: 'Verse Pericope',
                      reference: ['Verse reference 1']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
})

const currentData = reactive({
  book: 0,
  part: 0,
  script: 0,
  chapter: 0,
  verses: 0
})

const currentBook = computed(() => {
  return dataBook.book_list[currentData.book]
})
const currentPart = computed(() => {
  return currentBook.value.parts[currentData.part]
})
const currentScript = computed(() => {
  return currentPart.value.scripts[currentData.script]
})
const currentChapter = computed(() => {
  return currentScript.value.chapters[currentData.chapter]
})

const filteredBook = computed(() =>
  query.value === ''
    ? dataBook.book_list
    : dataBook.book_list.filter((book) => {
      return book.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.value.toLowerCase().replace(/\s+/g, ''))
    })
)
const filteredPart = computed(() =>
  query.value === ''
    ? currentBook.value.parts
    : currentBook.value.parts.filter((part) => {
      return part.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.value.toLowerCase().replace(/\s+/g, ''))
    })
)

const filteredScript = computed(() =>
  query.value === ''
    ? currentBook.value.parts.map((part) => {
      return part.scripts
    })
    : currentBook.value.parts.map((part) => {
      return part.scripts.filter((script) => {
        return script.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
      })
    })
)

const filteredChapter = computed(() =>
  query.value === ''
    ? currentScript.value.chapters.map((chapter) => {
      return currentScript.value.chapters.indexOf(chapter)
    })
    : currentScript.value.chapters
      .map((chapter) => {
        return currentScript.value.chapters.indexOf(chapter)
      })
      .filter((indexof) => {
        return (indexof + 1).toString()
          .match(new RegExp('^' + (query.value.replace(/(\/)|(\\)|(\s+)/g, '')))
          )
      })
)
const filteredVerse = computed(() => {
  // todo: return verses per pericope as paragraph
  // so [[paragraph with pericope][and another paragraph with pericope]]
  return currentChapter.value.verses.filter((verse) => {
    return verse
  })
})

// really really hard coded to get this things ^_^
// need help, data is not convinient,
// need to change all data structure
const selectedScript = ref(currentPart.value.scripts[currentData.script])
function getIndexOfScript(val) {
  for (const part of currentBook.value.parts) {
    let indexPart = currentBook.value.parts.indexOf(part)
    let indexScript = part.scripts.indexOf(val)
    if (indexScript >= 0) {
      currentData.part = indexPart
      currentData.script = indexScript
    }
  }
  checkData()
}

async function getBibledata() {
  // todo: need to change data structure
  try {
    dataBook.book_list = ref(
      YAML.parse(await (await (await fetch(data_url)).blob()).text()).book_list
    )
    if (localStorage.getItem('webibleCurrentData') == null) {
      localStorage.setItem('webibleCurrentData', JSON.stringify(currentData))
    } else {
      let localData = JSON.parse(localStorage.getItem('webibleCurrentData'))
      currentData.book = localData.book
      currentData.part = localData.part
      currentData.script = localData.script
      currentData.chapter = localData.chapter
      currentData.verses = localData.verses
    }
  } catch (error) {
    console.error('Bible Data: ' + error)
  }
}

function checkData() {
  currentData.book = currentData.book >= dataBook.book_list.length ? 0 : currentData.book
    ; (currentData.part = currentData.part >= currentBook.value.parts.length ? 0 : currentData.part),
      (currentData.script =
        currentData.script >= currentPart.value.scripts.length ? 0 : currentData.script),
      (currentData.chapter =
        currentData.chapter >= currentScript.value.chapters.length ? 0 : currentData.chapter),
      (currentData.verses =
        currentData.verses >= currentChapter.value.verses.length ? 0 : currentData.verses)
  localStorage.setItem('webibleCurrentData', JSON.stringify(currentData))
}

const nextButtonDisable = computed(() => {
  return (
    currentData.chapter + 1 == currentScript.value.chapters.length &&
    currentData.script + 1 == currentPart.value.scripts.length &&
    currentData.part + 1 == currentBook.value.parts.length
  )
})
const prevButtonDisable = computed(() => {
  return currentData.chapter == 0 && currentData.script == 0 && currentData.part == 0
})

function nextCurrentChapter() {
  if (currentData.chapter + 1 < currentScript.value.chapters.length) {
    currentData.chapter++
  } else {
    if (currentData.script + 1 < currentPart.value.scripts.length) {
      currentData.chapter = 0
      currentData.script++
    } else {
      if (currentData.part + 1 < currentBook.value.parts.length) {
        currentData.script = 0
        currentData.part++
      }
    }
    //dataSlides.value.push(currentPart.value.chapters.float())
  }
  checkData()
  //swiperRef.slideTo(currentData.chapter,'250')
}
function prevCurrentChapter() {
  if (currentData.chapter > 0) {
    currentData.chapter--
  } else {
    if (currentData.script > 0) {
      currentData.script--
      currentData.chapter = currentScript.value.chapters.length - 1
    } else {
      if (currentData.part > 0) {
        currentData.part--
        currentData.script = currentPart.value.scripts.length - 1
        currentData.chapter = currentScript.value.chapters.length - 1
      }
    }
  }
  checkData()
  //swiperRef.slideTo(currentData.chapter,'250')
}
function setCurrentChapter() {
  checkData()
  //swiperRef.slideTo(currentData.chapter, '250')
}

//    /**************** swipper slide  ****************/
//    const dataSlides = ref([])
//    //const dataSlides = ref(Array.from({ length: 7 }).map((_, index) => index - 3));
//    let swiperRef = null;
//
//    const setSwiperRef = (swiper) => {
//      swiperRef = swiper;
//    };
//    const slideTo = (index) => {
//      swiperRef.slideTo(index - 1, 0);
//    };
//    const slideAppend = () => {
//slides.value = [...slides.value, 'Slide ' + ++appendNumber];
//      dataSlides.value.push(dataSlides.value[dataSlides.value.length - 1] + 1)
//      dataSlides.value.push(dataSlides.value[dataSlides.value.length - 1] + 1)
//      dataSlides.value.push(dataSlides.value[dataSlides.value.length - 1] + 1)
//      dataSlides.value.shift()
//      dataSlides.value.shift()
//      dataSlides.value.shift()
//      swiperRef.update()
//      swiperRef.slideTo(1, 0, false)
//      //swiperRef.slideNext(250)
//      swiperRef.update()
//      swiperRef.slideNext(250)
//    };
//    const slidePrepend = () => {
//      /*
//      slides.value = [
//        `Slide ${prependNumber - 2}`,
//        `Slide ${prependNumber - 1}`,
//        ...slides.value,
//      ];
//      prependNumber -= 2;
//      swiperRef.slideTo(swiperRef.activeIndex + 2, 0);
//      */
//      dataSlides.value.unshift(dataSlides.value[0] - 1)
//      dataSlides.value.unshift(dataSlides.value[0] - 1)
//      dataSlides.value.unshift(dataSlides.value[0] - 1)
//      dataSlides.value.pop()
//      dataSlides.value.pop()
//      dataSlides.value.pop()
//      swiperRef.update()
//      swiperRef.slideTo(4, 0, false)
//      swiperRef.update()
//      swiperRef.slidePrev(250)
//    }
//    const prevChapter = computed(() => { return currentScript.value.chapters[currentData.chapter - 1] })
//    const nextChapter = computed(() => { return currentScript.value.chapters[currentData.chapter + 1] })

/**************** async data function  ****************/
; (async function () {
  await getBibledata()
  await checkData()

  //    //dataSlides.value=getCurrentSlides
  //    //dataSlides.value = [currentChapter]
  //    dataSlides.value = currentScript.value.chapters
  //    //for(let i=0;i<1000;i++){
  //    //dataSlides.value.push(currentScript.value.chapters[0])
  //    //}
  //    if (currentData.chapter > 0) {
  //      //   dataSlides.value.unshift(currentScript.value.chapters[currentData.chapter-1])
  //    }
  //    if (currentData.chapter < currentScript.value.chapters.length) {
  //      //   dataSlides.value.push(currentScript.value.chapters[currentData.chapter+1])
  //    }
  //    swiperRef.slideTo(currentData.chapter, 0, false)
})()

/**************** on Mounted ****************/
onMounted(() => {
  window.onscroll = () => { }

  //swiperRef.slideTo(currentData.chapter, 0, false)
  //  swiperRef.on('slideChange', (event) => {
  //    //    currentData.chapter = event.activeIndex
  //
  //    //swiperRef.on('reachBeginning', (event) => {
  //    if (event.isBeginning) {
  //      //slidePrepend()
  //    }
  //
  //    //swiperRef.on('reachEnd', (event) => {
  //    if (event.isEnd) {
  //      // slideAppend()
  //    }
  //
  //    if (event.isLocked) {
  //      swiperRef.update()
  //      swiperRef.update()
  //    }

  //console.log(dataSlides.value.flat())
  //console.log('index: ' + event.realIndex + ', Active: ' + event.activeIndex)
  //  })
})
</script>

<template>
  <div class="w-full">
    <div id="bibleMenuBar" class="sticky top-0 z-10">
      <div class="absolute w-full h-full inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-[25px]">
      </div>
      <!--  /** menu **/ -->
      <div class="relative flex flex-row">
        <div class="flex flex-row md:flex-1">
          <div class="flex w-full flex-row md:min-w-60">
            <span v-show="false" class="mr-2 mt-2 min-w-32 self-center">Book Version:</span>
            <div class="w-full">
              <Combobox v-model="currentData.book" text-gray-900 @update:model-value="checkData()">
                <div class="relative mt-2">
                  <ComboboxInput
                    class="w-full rounded-sm border-none bg-transparent py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 ring-blue-500 focus:outline-none focus:ring-1 dark:text-gray-100"
                    :display-value="(book) => currentBook.name" @change="query = $event.target.value" />
                  <span
v-show="currentBook.latin_name != null"
                    class="absolute inset-y-0 right-0 inline-flex items-center pr-8 text-sm text-gray-400">{{
                      currentBook.latin_name }}</span>
                  <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </ComboboxButton>
                  <Transition
enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-out"
                    leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0"
                    @after-leave="query = ''">
                    <ComboboxOptions
                      class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white/10 p-1 text-base shadow-lg ring-1 ring-black/5 backdrop-blur-sm focus:outline-none dark:bg-slate-900/10 sm:text-sm">
                      <div
v-if="filteredBook.length === 0 && query !== ''"
                        class="relative cursor-default select-none px-4 py-2 text-gray-700">
                        Nothing found.
                      </div>
                      <ComboboxOption
v-for="(book, index) in filteredBook" :key="index" v-slot="{ active, selected }"
                        :value="index" class="relative">
                        <li
class="rounded-md p-2" :class="[
                          active
                            ? 'bg-blue-500 text-white'
                            : 'bg-transparent text-gray-900 dark:text-white'
                        ]">
                          {{ book.name }}
                          <span
v-show="book.latin_name != null" text-gray-900
                            :class="[active ? 'text-gray-200' : 'text-gray-400']">
                            | {{ book.latin_name }}</span>
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
          <div class="sr-only md:show flex w-full flex-row p-1 md:min-w-60">
            <span v-show="false" class="mr-2 mt-2 min-w-32 self-center">Book Part: </span>
            <div class="w-full">
              <div class="relative mt-2">
                <input
disabled type="text" :value="currentPart.name"
                  class="w-full rounded-sm border-none bg-transparent py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 ring-blue-500 focus:outline-none focus:ring-1 dark:text-gray-100" />
                <span
v-show="currentPart.latin_name != null"
                  class="absolute inset-y-0 right-0 flex items-center pr-8 text-sm text-gray-400"
                  :class="{ 'text-gray-200': active, 'text-gray-400': !active }">
                  {{ currentPart.latin_name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row">
          <div class="flex w-full flex-row p-1 md:min-w-60">
            <span class="sr-only mr-2 mt-2 min-w-32 self-center">Script: </span>
            <div class="w-full">
              <Combobox v-model="selectedScript" @update:model-value="(value) => getIndexOfScript(value)">
                <div class="relative mt-2">
                  <ComboboxInput
                    class="w-full rounded-sm border-none bg-transparent py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 ring-blue-500 focus:outline-none focus:ring-1 dark:text-gray-100"
                    :display-value="(script) => currentScript.name" @change="query = $event.target.value" />
                  <span
v-if="currentScript.latin_name != null"
                    class="absolute inset-y-0 right-0 flex items-center pr-8 text-sm text-gray-400">{{
                      currentScript.latin_name }}</span>
                  <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </ComboboxButton>
                  <Transition
enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-out"
                    leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0"
                    @after-leave="query = ''">
                    <ComboboxOptions
                      class="absolute z-[1] mt-1 max-h-60 w-full origin-top-right divide-y divide-gray-100 overflow-auto rounded-md bg-white/10 text-base shadow-lg ring-1 ring-black/5 backdrop-blur-sm focus:outline-none dark:bg-slate-900/10 sm:text-sm">
                      <div
v-if="filteredScript.flat().length === 0 && query !== ''"
                        class="relative cursor-default select-none px-4 py-2 text-gray-700">
                        Nothing found.
                      </div>
                      <ComboboxOptions
v-for="(part, part_index) in filteredScript" :key="part_index" as="div"
                        :class="filteredScript.flat().length === 0 && query !== '' ? '' : 'p-1'">
                        <div v-if="part.length !== 0" class="p-2 text-gray-400">
                          <span>{{ currentBook.parts[part_index].name }}</span>
                          <span v-show="currentBook.parts[part_index].latin_name != null">
                            | {{ currentBook.parts[part_index].latin_name }}</span>
                        </div>
                        <ComboboxOption
v-for="(script, index) in part" :key="part_index + '.' + index"
                          v-slot="{ active, selected }" :value="script" class="relative">
                          <li
class="rounded-md p-2" :class="[
                            active
                              ? 'bg-blue-500 text-white'
                              : 'bg-transparent text-gray-900 dark:text-white'
                          ]">
                            {{ script.name }}
                            <span
v-show="script.latin_name != null" text-gray-900
                              :class="[active ? 'text-gray-200' : 'text-gray-400']">
                              | {{ script.latin_name }}</span>
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
              <Combobox v-model.numbers="currentData.chapter" @update:model-value="setCurrentChapter()">
                <div class="relative mt-2">
                  <ComboboxInput
                    class="w-full rounded-sm border-none bg-transparent py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 ring-blue-500 focus:outline-none focus:ring-1 dark:text-gray-100"
                    :display-value="(chapter) => currentData.chapter + 1" @change="query = $event.target.value" />
                  <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </ComboboxButton>
                  <Transition
enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-out"
                    leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0"
                    @after-leave="query = ''">
                    <ComboboxOptions
                      class="absolute z-[1] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white/10 p-1 text-base shadow-lg ring-1 ring-black/5 backdrop-blur-sm focus:outline-none dark:bg-slate-900/10 sm:text-sm">
                      <div
v-if="filteredChapter.length === 0 && query !== ''"
                        class="relative cursor-default select-none px-2 py-2 text-gray-700">
                        Nothing found.
                      </div>
                      <ComboboxOption
v-for="(chapter, index) in filteredChapter" :key="index"
                        v-slot="{ active, selected }" :value="chapter" class="relative">
                        <li
class="rounded-md p-2" :class="{
                          'bg-blue-500 text-white': active,
                          'bg-transparent text-gray-900 dark:text-white': !active
                        }">
                          {{ chapter + 1 }}
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
                :disabled="prevButtonDisable" @click="prevCurrentChapter">
                <ChevronLeftIcon class="-ml-1 mr-2 h-4 w-4" />Previous
              </button>
            </div>
            <Menu as="div" class="relative inline-block text-left">
              <div>
                <MenuButton
                  class="inline-flex w-full justify-center rounded-md px-4 py-2 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                  Options
                  <ChevronDownIcon class="-mr-1 ml-2 h-4 w-4" aria-hidden="true" />
                </MenuButton>
              </div>
              <transition
enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <MenuItems
                  class="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white/10 shadow-lg ring-1 ring-black/5 backdrop-blur focus:outline-none dark:bg-slate-900/10">
                  <div class="p-1">
                    <MenuItem v-slot="{ active }" class="relative">
                    <Switch
v-slot="{ checked }" v-model="showVerseNumber" :class="[
                      active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white',
                      'group text-sm'
                    ]" class="flex w-full items-center rounded-md p-2">
                      Show Verse Number
                      <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <CheckIcon v-show="checked" class="h4 w-4" />
                      </span>
                    </Switch>
                    </MenuItem>
                    <MenuItem v-slot="{ active }" class="relative">
                    <Switch
v-slot="{ checked }" v-model="showVerseInline" :class="[
                      active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white',
                      'group text-sm'
                    ]" class="flex w-full items-center rounded-md p-2">Show Verse Inline
                      <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <CheckIcon v-show="checked" class="h4 w-4" />
                      </span>
                    </Switch>
                    </MenuItem>
                  </div>
                  <div class="p-1">
                    <MenuItem v-slot="{ active }" class="relative">
                    <Switch
v-slot="{ checked }" v-model="showPericope" :class="[
                      active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white',
                      'group text-sm'
                    ]" class="flex w-full items-center rounded-md p-2">Show Pericope
                      <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <CheckIcon v-show="checked" class="h4 w-4" />
                      </span>
                    </Switch>
                    </MenuItem>
                  </div>
                  <div class="p-1">
                    <MenuItem v-slot="{ active }" class="relative">
                    <Switch
v-slot="{ checked }" v-model="articleInWide" :class="[
                      active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white',
                      'group text-sm'
                    ]" class="flex w-full items-center rounded-md p-2">Wide Reading
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
              :disabled="nextButtonDisable" @click="nextCurrentChapter">
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
      <article class="prose font-display dark:prose-invert w-full" :class="articleInWide ? 'max-w-none' : ''">
        <p>
          <span v-for="(verse, index) in filteredVerse" :key="index">
            <br v-if="verse.pericope != null && index != 0" />
            <h3 v-if="verse.pericope != null && showPericope">{{ verse.pericope }}</h3>
            <span
:class="{
              block: !showVerseInline,
              'mx-1': showVerseInline,
              'mt-6': index == 0 && (verse.pericope == null || !showPericope)
            }">
              <b v-show="showVerseNumber" class="align-top text-xs">{{ index + 1 }}&nbsp;</b>
              <span>{{ verse.text }}</span>
            </span>
          </span>
        </p>
      </article>
      <!--Swiper :modules="sliderModules" :slides-per-view="1" :space-between="50" :centered-slides="true" :scrollbar="false"
        :virtual="true" :navigation="false" :mousewheel="{ forceToAxis: true }" :simulate-touch="false"
        @swiper="setSwiperRef">
        <SwiperSlide v-for="(slideContent, index) in dataSlides" :key="index" :virtual-index="index" class="swiper-slide">
          <article class=" prose max-w-none font-display dark:prose-invert">
            <p>
              <span v-for="(verse, index) in slideContent.verses" :key="index">
                <br v-if="verse.pericope != null && index != 0" />
                <h3 v-if="verse.pericope != null && showPericope">{{ verse.pericope }}</h3>
                <span :class="{
                  block: !showVerseInline,
                  'mx-1': showVerseInline,
                  'mt-6': index == 0 && (verse.pericope == null || !showPericope)
                }">
                  <b v-show="showVerseNumber" class="align-top text-xs">{{ index + 1 }}&nbsp;</b>
                  <span>{{ verse.text }}</span>
                </span>
              </span>
            </p>
          </article>
        </SwiperSlide>
      </Swiper-->
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

<style scoped>
.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
