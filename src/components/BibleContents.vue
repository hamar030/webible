<script setup>
import YAML from 'yaml'
import { ref, reactive, computed } from 'vue'
import { CheckIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'
import {
    Combobox,
    ComboboxInput,
    ComboboxButton,
    ComboboxOptions,
    ComboboxOption,
    TransitionRoot,

} from '@headlessui/vue'

/* example data url */
//const data_url = "https://gist.githubusercontent.com/hamar030/3ed4a54ec9f2e8e1721627714193fdcc/raw/example_data.yaml"
//const data_url = "/data/example_data.yaml"
/* bible list data url */
const data_url = "https://gist.githubusercontent.com/hamar030/3ed4a54ec9f2e8e1721627714193fdcc/raw/list-bible.yaml"
const data_url = "https://gist.githubusercontent.com/hamar030/3ed4a54ec9f2e8e1721627714193fdcc/raw/id-il3.yaml"

const showVerseNumber = ref(false)
const dataBook = reactive({
    book_list: [{
        name: "Book Name",
        short_name: "Short Name",
        latin_name: "Latin Name",
        desc: "Description",
        lang: "en",
        parts: [{
            name: "Part Name",
            latin_name: "Part Latin Name",
            scripts: [{
                name: "Script Name",
                latin_name: "Script Latin Name",
                chapters: [{
                    verses: [{
                        text: "verse text",
                        pericope: "Verse Pericope",
                        reference: [
                            "Verse reference 1",
                        ],
                    }],
                }],
            }],
        }],
    }],
})

const currentData = reactive({
    book: 0,
    part: 0,
    script: 0,
    chapter: 0,
    verses: 0,
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

const query = ref('')

const filteredBook = computed(() =>
    query.value === ''
        ? dataBook.book_list
        : dataBook.book_list.filter((book) => {
            return book.name.toLowerCase().replace(/\s+/g, '')
                .includes(query.value.toLowerCase().replace(/\s+/g, ''))
        })
)
const filteredPart = computed(() =>
    query.value === ''
        ? currentBook.value.parts
        : currentBook.value.parts.filter((part) => {
            return part.name.toLowerCase().replace(/\s+/g, '')
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
                return script.name.toLowerCase().replace(/\s+/g, '').includes(query.value.toLowerCase().replace(/\s+/g, ''))
            })
        })
)

const filteredChapter = computed(() =>
    query.value === ''
        ? currentScript.value.chapters.map((chapter) => {
            return currentScript.value.chapters.indexOf(chapter)
        })
        : currentScript.value.chapters.map((chapter) => {
            return currentScript.value.chapters.indexOf(chapter)
        }).filter((indexof) => {return indexof == query.value-1})
)

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
    try {
        dataBook.book_list = ref(YAML.parse(await (await (await fetch(data_url)).blob()).text()).book_list)
    } catch (error) {
        console.error("Bible Data: " + error)
    }
}

(async function () {
    await getBibledata()
})()

function toogleVerseNumber() {
    showVerseNumber.value = !showVerseNumber.value
}
function checkData() {
    currentData.book = currentData.book >= dataBook.book_list.length ? 0 : currentData.book
    currentData.part = currentData.part >= currentBook.value.parts.length ? 0 : currentData.part,
        currentData.script = currentData.script >= currentPart.value.scripts.length ? 0 : currentData.script,
        currentData.chapter = currentData.chapter >= currentScript.value.chapters.length ? 0 : currentData.chapter,
        currentData.verses = currentData.verses >= currentChapter.value.verses.length ? 0 : currentData.verses
}
</script>

<template>
    <div class="w-full">
        <div class="flex flex-col">
            <div class="flex flex-col md:flex-row">
                <div class="flex flex-row w-full md:min-w-60">
                    <span class="self-center mt-2 mr-2 min-w-32">Book Version: </span>
                    <div class="w-full">
                        <Combobox v-model="currentData.book" @update:model-value="checkData()" class="">
                            <div class="relative mt-2">
                                <ComboboxInput
                                    class="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none border-none focus:ring-1 ring-blue-500 rounded-sm text-gray-900 dark:text-gray-100  bg-transparent"
                                    :displayValue="(book) => currentBook.name" @change="query = $event.target.value" />
                                <span v-if="currentBook.latin_name != null"
                                    class="absolute inset-y-0 right-0 flex items-center pr-8 text-gray-400 text-sm">{{
                                        currentBook.latin_name }}</span>
                                <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </ComboboxButton>
                                <Transition enter-active-class="transition duration-100 ease-out"
                                    enter-from-class="transform scale-95 opacity-0"
                                    enter-to-class="transform scale-100 opacity-100"
                                    leave-active-class="transition duration-75 ease-out"
                                    leave-from-class="transform scale-100 opacity-100"
                                    leave-to-class="transform scale-95 opacity-0" @after-leave="query = ''">
                                    <ComboboxOptions
                                        class="z-[1] absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white p-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm">
                                        <div v-if="filteredBook.length === 0 && query !== ''"
                                            class="relative cursor-default select-none px-4 py-2 text-gray-700">
                                            Nothing found.
                                        </div>
                                        <ComboboxOption v-for="(book, index) in filteredBook" :key="index" :value="index"
                                            v-slot="{ active, selected }">
                                            <li class="p-2" :class="{
                                                'bg-blue-500 text-white': active,
                                                'bg-transparent text-black dark:text-white': !active,
                                            }">
                                                <!--CheckIcon v-show="selected" /-->
                                                {{ book.name }}
                                                <span v-if="book.latin_name != null" class="absolute right-0 pr-2"
                                                    :class="{ 'text-gray-200': active, 'text-gray-500': !active }">{{
                                                        book.latin_name }}</span>
                                            </li>
                                        </ComboboxOption>
                                    </ComboboxOptions>
                                </Transition>
                            </div>
                        </Combobox>
                    </div>
                </div>
                <div class="flex flex-row w-full md:min-w-60 p-1">
                    <span class="self-center mt-2 mr-2 min-w-32">Book Part: </span>
                    <div class="w-full">
                        <div class="relative mt-2">
                            <input disabled type="text" :value="currentPart.name"
                                class="bg-white w-full py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none border-none focus:ring-1 ring-blue-500 rounded-sm text-gray-900 dark:text-gray-100  bg-transparent" />
                            <span v-if="currentPart.latin_name != null"
                                class="absolute inset-y-0 right-0 flex items-center pr-8 text-gray-400 text-sm"
                                :class="{ 'text-gray-200': active, 'text-gray-400': !active }">
                                {{ currentPart.latin_name }}</span>
                        </div>

                    </div>
                </div>
            </div>
            <div class="flex flex-col md:flex-row">
                <div class="flex flex-row w-full md:min-w-60 p-1">
                    <span class="self-center mt-2 mr-2 min-w-32">Script: </span>
                    <div class="w-full">
                        <Combobox v-model="selectedScript" @update:modelValue="(value) => getIndexOfScript(value)">
                            <div class="relative mt-2">
                                <ComboboxInput
                                    class="w-full py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none border-none focus:ring-1 ring-blue-500 rounded-sm text-gray-900 dark:text-gray-100  bg-transparent"
                                    :displayValue="(script) => currentScript.name" @change="query = $event.target.value" />
                                <span v-if="currentScript.latin_name != null"
                                    class="absolute inset-y-0 right-0 flex items-center pr-8 text-gray-400 text-sm">{{
                                        currentScript.latin_name }}</span>
                                <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </ComboboxButton>
                                <Transition enter-active-class="transition duration-100 ease-out"
                                    enter-from-class="transform scale-95 opacity-0"
                                    enter-to-class="transform scale-100 opacity-100"
                                    leave-active-class="transition duration-75 ease-out"
                                    leave-from-class="transform scale-100 opacity-100"
                                    leave-to-class="transform scale-95 opacity-0" @after-leave="query = ''">
                                    <ComboboxOptions
                                        class="z-[1] absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white p-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm">
                                        <div v-if="filteredScript.flat().length === 0 && query !== ''"
                                            class="relative cursor-default select-none px-4 py-2 text-gray-700">
                                            Nothing found.
                                        </div>
                                        <div v-for="(part, part_index) in filteredScript">
                                            <div v-if="part.length !== 0" class="text-gray-400 p-2">
                                                <span>{{ currentBook.parts[part_index].name }}</span>
                                                <span v-if="currentBook.parts[part_index].latin_name != null"
                                                    class="absolute right-0 pr-2">{{
                                                        currentBook.parts[part_index].latin_name }}</span>
                                            </div>
                                            <ComboboxOption v-for="(script, index) in part" :key="part_index + '.' + index"
                                                :value="script" v-slot="{ active, selected }
                                                ">
                                                <li class="p-2" :class="{
                                                    'bg-blue-500 text-white': active,
                                                    'bg-transparent text-black dark:text-white': !active,
                                                }">
                                                    <!--CheckIcon v-show="selected" /-->
                                                    {{ script.name }}
                                                    <span v-if="script.latin_name != null" class="absolute right-0 pr-2"
                                                        :class="{ 'text-gray-200': active, 'text-gray-400': !active }">{{
                                                            script.latin_name }}</span>
                                                </li>
                                            </ComboboxOption>
                                            <hr v-if="part.length !== 0 && part_index + 1 !== part.length">
                                        </div>
                                    </ComboboxOptions>
                                </Transition>
                            </div>
                        </Combobox>
                    </div>
                </div>
                <div class="flex flex-row w-full md:min-w-60 p-1">
                    <span class="self-center mt-2 mr-2 min-w-32">Chapter: </span>
                    <div class="w-full ">
                        <Combobox v-model.number="currentData.chapter">
                            <div class="relative mt-2">
                                <ComboboxInput
                                    class="w-full py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none border-none focus:ring-1 ring-blue-500 rounded-sm text-gray-900 dark:text-gray-100  bg-transparent"
                                    :displayValue="(chapter) => currentData.chapter + 1"
                                    @change="query = $event.target.value" />
                                <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </ComboboxButton>
                                <Transition enter-active-class="transition duration-100 ease-out"
                                    enter-from-class="transform scale-95 opacity-0"
                                    enter-to-class="transform scale-100 opacity-100"
                                    leave-active-class="transition duration-75 ease-out"
                                    leave-from-class="transform scale-100 opacity-100"
                                    leave-to-class="transform scale-95 opacity-0" @after-leave="query = ''">
                                    <ComboboxOptions
                                        class="z-[1] absolute mt-1 max-h-60 w-full overflow-auto rounded-md p-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm">
                                        <div v-if="filteredChapter.length === 0 && query !== ''"
                                            class="relative cursor-default select-none px-4 py-2 text-gray-700">
                                            Nothing found.
                                        </div>
                                        <ComboboxOption v-for="(chapter, index) in filteredChapter" :key="index"
                                            :value="chapter" v-slot="{ active, selected }">
                                            <li class="p-2" :class="{
                                                'bg-blue-500 text-white': active,
                                                'bg-transparent text-black dark:text-white': !active,
                                            }">
                                                <!--CheckIcon v-show="selected" /-->
                                                {{ chapter + 1 }}
                                            </li>
                                        </ComboboxOption>
                                    </ComboboxOptions>
                                </Transition>
                            </div>
                        </Combobox>
                    </div>
                </div>
            </div>
            <div class="py-5">
                <hr />
            </div>
        </div>
        <div class="text-md font-light">
            <div v-if="showVerseNumber">
                <span v-for="(verse, index) in currentChapter.verses" :key="index">
                    <h3 v-if="verse.pericope != null" class="font-medium text-lg pb-2 pt-5">{{ verse.pericope }}</h3>
                    {{ verse.text }}
                </span>
            </div>
            <div v-else>
                <p v-for="(verse, index) in currentChapter.verses"  :key="index">

                <h3 v-if="verse.pericope != null" class="font-medium text-lg pb-2 pt-5">{{ verse.pericope }}</h3>
                <span class="font-medium">{{ index + 1 }}</span>. {{ verse.text }}
                </p>
            </div>
        </div>
        <div>
            <div class="py-5">
                <hr />
            </div>
            <button @click="toogleVerseNumber">Show verse number</button>
        </div>
    </div>
</template>

<style scoped></style>
