<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <div lass="h-full w-full">
    <span class="sr-only"> Menu Bar </span>
    <div
      id="bibleMenuBar"
      class="sticky top-0 z-10"
    >
      <span class="sr-only">backdrop blurr</span>
      <div
        class="absolute inset-0 h-full w-full bg-white/70 backdrop-blur-[25px] dark:bg-neutral-950/70"
      ></div>
      <span class="sr-only">menu main</span>
      <div class="relative flex flex-row p-2">
        <span class="sr-only">Books</span>
        <HeadlessCombobox v-model="selectedBook">
          <div class="relative">
            <HeadlessComboboxInput
              class="cb-input"
              :display-value="() => selectedBook.name"
              @change="sq = $event.target.value"
            />
            <HeadlessComboboxButton
              class="absolute inset-y-0 right-0 flex items-center pr-2"
              aria-label="select book"
            >
              <ChevronUpDownIcon
                class="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </HeadlessComboboxButton>
            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-out"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
              @after-leave="sq = ''"
            >
              <HeadlessComboboxOptions
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white/10 p-1 text-base shadow-lg ring-1 ring-black/5 backdrop-blur-sm focus:outline-none sm:text-sm dark:bg-slate-900/10"
              >
                <div
                  v-show="filteredBooks.length === 0 && sq !== ''"
                  class="relative cursor-default select-none px-4 py-2 text-gray-700"
                >
                  Nothing found.
                </div>
                <HeadlessComboboxOption
                  v-for="bk in filteredBooks"
                  :key="bk.id"
                  v-slot="{ active, selected }"
                  :value="bk"
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
                    {{ bk.name }}
                    <span
                      v-show="bk.alt_name != null"
                      text-gray-900
                      :class="[active ? 'text-gray-200' : 'text-gray-400']"
                    >
                      | {{ bk.alt_name }}</span
                    >
                    <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                      <CheckIcon
                        v-show="selected"
                        class="h4 w-4"
                      />
                    </span>
                  </li>
                </HeadlessComboboxOption>
              </HeadlessComboboxOptions>
            </Transition>
          </div>
        </HeadlessCombobox>
        <span class="sr-only">Scripts</span>
        <HeadlessCombobox v-model="selectedScript">
          <div class="relative">
            <HeadlessComboboxInput
              class="cb-input"
              :display-value="() => selectedScript.name"
              @change="sq = $event.target.value"
            />
            <span
              v-show="selectedScript.alt_name != null"
              class="absolute inset-y-0 right-0 flex items-center pr-8 text-sm text-gray-400"
              >{{ selectedScript.name }}</span
            >
            <HeadlessComboboxButton
              class="absolute inset-y-0 right-0 flex items-center pr-2"
              aria-label="select script"
            >
              <ChevronUpDownIcon
                class="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </HeadlessComboboxButton>
            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-out"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
              @after-leave="sq = ''"
            >
              <HeadlessComboboxOptions
                class="absolute z-[1] mt-1 max-h-60 w-full origin-top-right divide-y divide-gray-100 overflow-auto rounded-md bg-white/10 text-base shadow-lg ring-1 ring-black/5 backdrop-blur-sm focus:outline-none sm:text-sm dark:bg-slate-900/10"
              >
                <div
                  v-show="filteredScripts.flat().length === 0 && sq !== ''"
                  class="relative cursor-default select-none px-4 py-2 text-gray-700"
                >
                  Nothing found.
                </div>
                <HeadlessComboboxOptions
                  v-for="(prt, pIndex) in filteredScripts"
                  :key="parts[pIndex].id"
                  as="div"
                  :class="filteredScripts.flat().length === 0 && sq !== '' ? '' : 'p-1'"
                >
                  <div
                    v-show="parts[pIndex].scripts.length !== 0"
                    class="p-2 text-gray-400"
                  >
                    <span>{{ parts[pIndex].name }}</span>
                    <span v-show="parts[pIndex].alt_name != null">
                      | {{ parts[pIndex].alt_name }}</span
                    >
                  </div>
                  <HeadlessComboboxOption
                    v-for="scr in prt"
                    :key="scr.id"
                    v-slot="{ active, selected }"
                    :value="scr"
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
                      {{ scr.name }}
                      <span
                        v-show="script.alt_name != null"
                        text-gray-900
                        :class="[active ? 'text-gray-200' : 'text-gray-400']"
                      >
                        | {{ scr.alt_name }}</span
                      >
                      <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <CheckIcon
                          v-show="selected"
                          class="h4 w-4"
                        />
                      </span>
                    </li>
                  </HeadlessComboboxOption>
                </HeadlessComboboxOptions>
              </HeadlessComboboxOptions>
            </Transition>
          </div>
        </HeadlessCombobox>
        <span class="sr-only">Chapters</span>
        <HeadlessCombobox v-model="selectedChapter">
          <div class="relative">
            <HeadlessComboboxInput
              class="cb-input"
              :display-value="() => selectedChapter.id.toString()"
              @change="sq = $event.target.value"
            />
            <HeadlessComboboxButton
              class="absolute inset-y-0 right-0 flex items-center pr-2"
              aria-label="select chapter"
            >
              <ChevronUpDownIcon
                class="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </HeadlessComboboxButton>
            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-out"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
              @after-leave="sq = ''"
            >
              <HeadlessComboboxOptions
                class="absolute z-[1] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white/10 p-1 text-base shadow-lg ring-1 ring-black/5 backdrop-blur-sm focus:outline-none sm:text-sm dark:bg-slate-900/10"
              >
                <div
                  v-show="filteredChapters.length === 0 && sq !== ''"
                  class="relative cursor-default select-none px-2 py-2 text-gray-700"
                >
                  Nothing found.
                </div>
                <HeadlessComboboxOption
                  v-for="(chp, cIndex) in filteredChapters"
                  :key="cIndex"
                  v-slot="{ active, selected }"
                  :value="chp"
                  class="relative"
                >
                  <li
                    class="rounded-md p-2"
                    :class="{
                      'bg-blue-500 text-white': active,
                      'bg-transparent text-gray-900 dark:text-white': !active
                    }"
                  >
                    {{ chp.id }}
                    <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                      <CheckIcon
                        v-show="selected"
                        class="h4 w-4"
                      />
                    </span>
                  </li>
                </HeadlessComboboxOption>
              </HeadlessComboboxOptions>
            </Transition>
          </div>
        </HeadlessCombobox>
      </div>
      <span class="sr-only">menu config</span>
      <div class="relative text-gray-900 dark:text-white">
        <div class="flex flex-row items-center justify-between p-1 text-xs">
          <div class="flex flex-1 flex-row">
            <div class="text-left">
              <button
                class="inline-flex w-full justify-center rounded-md px-4 py-2 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                :disabled="!isPrevAvailable"
                @click="prevChapter"
              >
                <ChevronLeftIcon class="-ml-1 mr-2 h-4 w-4" />Previous
              </button>
            </div>
            <HeadlessMenu
              as="div"
              class="relative inline-block text-left"
            >
              <div>
                <HeadlessMenuButton
                  class="inline-flex w-full justify-center rounded-md px-4 py-2 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                >
                  Options
                  <ChevronDownIcon
                    class="-mr-1 ml-2 h-4 w-4"
                    aria-hidden="true"
                  />
                </HeadlessMenuButton>
              </div>
              <!-- hydration mismatch -->
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <HeadlessMenuItems
                  class="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white/10 shadow-lg ring-1 ring-black/5 backdrop-blur focus:outline-none dark:bg-slate-900/10"
                >
                  <div class="p-1">
                    <HeadlessMenuItem
                      v-slot="{ active }"
                      class="relative"
                    >
                      <HeadlessSwitch
                        v-slot="{ checked }"
                        v-model="useConfig.verseNumber"
                        :class="[
                          active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white',
                          'group text-sm'
                        ]"
                        class="flex w-full items-center rounded-md p-2"
                      >
                        Show Verse Number
                        <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                          <CheckIcon
                            v-show="checked"
                            class="h4 w-4"
                          />
                        </span>
                      </HeadlessSwitch>
                    </HeadlessMenuItem>
                    <HeadlessMenuItem
                      v-slot="{ active }"
                      class="relative"
                    >
                      <HeadlessSwitch
                        v-slot="{ checked }"
                        v-model="useConfig.verseInline"
                        :class="[
                          active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white',
                          'group text-sm'
                        ]"
                        class="flex w-full items-center rounded-md p-2"
                        >Show Verse Inline
                        <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                          <CheckIcon
                            v-show="checked"
                            class="h4 w-4"
                          />
                        </span>
                      </HeadlessSwitch>
                    </HeadlessMenuItem>
                  </div>
                  <div class="p-1">
                    <HeadlessMenuItem
                      v-slot="{ active }"
                      class="relative"
                    >
                      <HeadlessSwitch
                        v-slot="{ checked }"
                        v-model="useConfig.pericope"
                        :class="[
                          active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white',
                          'group text-sm'
                        ]"
                        class="flex w-full items-center rounded-md p-2"
                        >Show Pericope
                        <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                          <CheckIcon
                            v-show="checked"
                            class="h4 w-4"
                          />
                        </span>
                      </HeadlessSwitch>
                    </HeadlessMenuItem>
                  </div>
                  <div class="p-1">
                    <HeadlessMenuItem
                      v-slot="{ active }"
                      class="relative"
                    >
                      <HeadlessSwitch
                        v-slot="{ checked }"
                        v-model="useConfig.readWide"
                        :class="[
                          active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-white',
                          'group text-sm'
                        ]"
                        class="flex w-full items-center rounded-md p-2"
                        >Wide Reading
                        <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                          <CheckIcon
                            v-show="checked"
                            class="h4 w-4"
                          />
                        </span>
                      </HeadlessSwitch>
                    </HeadlessMenuItem>
                  </div>
                </HeadlessMenuItems>
              </transition>
            </HeadlessMenu>
          </div>
          <div class="text-left">
            <button
              class="inline-flex w-full justify-center rounded-md px-4 py-2 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
              :disabled="!isNextAvailable"
              @click="nextChapter"
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
    <span class="sr-only"> Verses </span>
    <div class="flex justify-center px-2">
      <article
        class="prose font-display dark:prose-invert w-full"
        :class="[
          useConfig.readWide ? 'max-w-none' : '',
          book.language == 'he' ? 'rtl text-right' : 'text-left' // rtl when lang=he
        ]"
      >
        <!--hydration mismatch  -->
        <!-- <p> -->
        <span
          v-for="(verse, vindex) in chapter.verses"
          :key="verse.id"
        >
          <br v-show="verse.pericope != null && vindex != 0" />
          <h3 v-show="verse.pericope != null && useConfig.pericope">{{ verse.pericope }}</h3>
          <span
            :class="{
              block: !useConfig.verseInline,
              'mx-1': useConfig.verseInline,
              'mt-6': vindex == 0 && (verse.pericope == null || !useConfig.pericope)
            }"
          >
            <sup
              v-show="useConfig.verseNumber"
              class="text-xs font-bold"
              >{{ verse.id }}&nbsp;</sup
            >
            <span>{{ verse.text }}</span>
          </span>
        </span>
        <!-- </p> -->
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

<script async setup lang="ts">
import {
  ChevronUpDownIcon,
  ChevronDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/solid'

import {
  definePageMeta,
  useSeoMeta,
  useNuxtApp,
  // useBookStore,
  useBibleConfigStore,
  computed,
  ref,
  useRoute,
  useRouter,
  useKebabCase,
  watch
} from '#imports'

definePageMeta({
  layout: 'reading',
  path: '/bible/:bookName?/:scriptName?/:chapterId(\\d+)?',
  middleware: 'bible-middleware', // the middleware is slow thinks
  validate: async (route) => {
    const { $trpc } = useNuxtApp()
    const { bookName, scriptName, chapterId } = route.params
    if (bookName === '' || scriptName === '' || chapterId === '') {
      return true //skiping validation when empty
    } else {
      return $trpc.bible.isAvailable.query({
        bookName: bookName.toString(),
        scriptName: scriptName.toString(),
        chapterId: parseInt(chapterId.toString())
      })
    }
  }
})

useSeoMeta({
  title: 'Webible - bible',
  ogType: 'article'
})

const route = useRoute()
const router = useRouter()
const { $trpc } = useNuxtApp()
const useConfig = useBibleConfigStore()
// const useBook = useBookStore()

const { bookName, scriptName, chapterId } = route.params
const { data } = await $trpc.bible.getInitByParams.useQuery(
  {
    bookName: bookName.toString(),
    scriptName: scriptName.toString(),
    chapterId: parseInt(chapterId.toString())
  },
  { queryKey: `/bible/${bookName.toString()}/${scriptName.toString()}/${chapterId.toString()}` }
)
if (data.value === null || data.value === undefined) throw Error('data is missing')
const { books, index } = data.value
const book = computed(() => books[index.book])
const part = computed(() => book.value.parts[index.part])
const script = computed(() => part.value.scripts[index.script])
const chapter = computed(() => script.value.chapters[index.chapter])

const parts = computed(() => book.value.parts)
// const scripts = computed(() => part.value.scripts)
const chapters = computed(() => script.value.chapters)

// todo: move next and prev chapter to server?
const isNextAvailable = computed(
  () =>
    !(
      index.chapter == script.value.chapters.length - 1 &&
      index.script == part.value.scripts.length - 1 &&
      index.part == book.value.parts.length - 1
    )
)
const isPrevAvailable = computed(
  () => !(index.chapter == 0 && index.script == 0 && index.part == 0)
)
const nextChapter = async () => {
  const nIndex = {
    book: index.book,
    part: index.part,
    script: index.script,
    chapter: index.chapter
  }
  if (index.chapter + 1 < script.value.chapters.length) {
    nIndex.chapter++
  } else {
    if (index.script + 1 < part.value.scripts.length) {
      nIndex.chapter = 0
      nIndex.script++
    } else {
      if (index.part + 1 < book.value.parts.length) {
        nIndex.chapter = 0
        nIndex.script = 0
        nIndex.part++
      }
    }
  }
  const url = await $trpc.bible.getUrlParams.query({ index: nIndex })
  router.push(
    `/bible/${useKebabCase(url.bookName)}/${useKebabCase(url.scriptName)}/${url.chapterId}`
  )
}
const prevChapter = async () => {
  const pIndex = {
    book: index.book,
    part: index.part,
    script: index.script,
    chapter: index.chapter
  }
  if (index.chapter > 0) {
    pIndex.chapter--
  } else {
    if (index.script > 0) {
      pIndex.script--
      const cdata = await $trpc.bible.script.chapter.list.query({ index: pIndex })
      pIndex.chapter = cdata.length - 1
    } else {
      if (index.part > 0) {
        pIndex.part--
        pIndex.script = book.value.parts[pIndex.part].scripts.length - 1
        const cdata = await $trpc.bible.script.chapter.list.query({ index: pIndex })
        pIndex.chapter = cdata.length - 1
      }
    }
  }
  const url = await $trpc.bible.getUrlParams.query({ index: pIndex })
  router.push(
    `/bible/${useKebabCase(url.bookName)}/${useKebabCase(url.scriptName)}/${url.chapterId}`
  )
}

const sq = ref('')
/**
 * @return an filltered verse
 */
const filteredBooks = computed(() =>
  sq.value === ''
    ? books
    : books.filter((bk) => useKebabCase(bk.name).includes(useKebabCase(sq.value)))
)
const filteredScripts = computed(() =>
  sq.value === ''
    ? parts.value.map((prt) => prt.scripts)
    : parts.value.map((prt) =>
        prt.scripts.filter((sc) => useKebabCase(sc.name).includes(useKebabCase(sq.value)))
      )
)
const filteredChapters = computed(() =>
  sq.value === ''
    ? chapters.value
    : chapters.value.filter((ch) =>
        ch.id.toString().match(new RegExp('^' + sq.value.replace(/(\/)|(\\)|(\s+)/g, '')))
      )
)

const selectedBook = ref(book.value)
const selectedScript = ref(script.value)
const selectedChapter = ref(chapter.value)

watch(
  selectedBook,
  (bk) => {
    router.push(`/bible/${useKebabCase(bk.short_name)}`)
  },
  { immediate: true }
)
watch(
  selectedScript,
  (sc) => {
    router.push(`/bible/${useKebabCase(book.value.short_name)}/${useKebabCase(sc.name)}`)
  },
  { immediate: true }
)
watch(
  selectedChapter,
  (ch) => {
    router.push(
      `/bible/${useKebabCase(book.value.short_name)}/${useKebabCase(script.value.name)}/${ch.id}`
    )
  },
  { immediate: true }
)
</script>

<style scoped lang="pcss">
.cb-input {
  @apply w-full rounded-sm border-none bg-transparent py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 ring-blue-500 focus:outline-none focus:ring-1 dark:text-gray-100;
}
</style>
