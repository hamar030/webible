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

//const data_url = "https://gist.githubusercontent.com/hamar030/3ed4a54ec9f2e8e1721627714193fdcc/raw/08236a6e03fc126111b3ff675971e3b15032110d/example_data.yaml"
const data_url = "/data/example_data.yaml"
const showVerseNumber = ref(false)
const dataBook = reactive({
    book_list: [{
        name: "Book Name",
        parts: [{
            name: "Part Name",
            scripts: [{
                name: "Script Name",
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
        ? currentScript.value.chapters
        : dataBook.book_list.filter((chapter) => {
            return chapter === query.value ? null : chapter
        })
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
    <table class="w-full md:max-w-[1000px] mx-auto py-auto text-left text-sm font-light">
        <thead class="border-b font-medium dark:border-neutral-500">
            <tr>
                <th scope="col" class="px-6 md:py-4">
                    <div class="flex flex-row">
                        <div class="pr-3 text-left sm:text-sm self-center"><span class="block truncate">Book Version:</span>
                        </div>
                        <div class="w-full md:w-72">
                            <Combobox v-model="currentData.book" @update:model-value="checkData()">
                                <div class="relative mt-1">
                                    <ComboboxInput
                                        class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                        :displayValue="(book) => currentBook.name" @change="query = $event.target.value" />
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
                                            class="z-[1] absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white p-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                            <div v-if="filteredBook.length === 0 && query !== ''"
                                                class="relative cursor-default select-none px-4 py-2 text-gray-700">
                                                Nothing found.
                                            </div>
                                            <ComboboxOption v-for="(book, index) in filteredBook" :key="index"
                                                :value="index" v-slot="{ active, selected }">
                                                <li class="p-2" :class="{
                                                    'bg-blue-500 text-white': active,
                                                    'bg-white text-black': !active,
                                                }">
                                                    <!--CheckIcon v-show="selected" /-->
                                                    {{ book.name }}
                                                </li>
                                            </ComboboxOption>
                                        </ComboboxOptions>
                                    </Transition>
                                </div>
                            </Combobox>
                        </div>
                    </div>
                </th>
            </tr>
            <tr>
                <th scope="col" class="px-6 py-2 md:py-4">
                    <div class="flex flex-row">
                        <div class="pr-3 text-left sm:text-md self-center"><span class="block truncate">Part:</span></div>
                        <div class="text-sm"><span class="block truncate">
                                {{ currentPart.name }}
                            </span>
                        </div>
                    </div>
                </th>
            </tr>
            <tr>
                <th colspan="2" scope="col" class="px-6 md:py-4">
                    <div class="flex flex-row w-full">
                        <div class="w-full md:w-72 mr-5">
                            <Combobox v-model="selectedScript" @update:modelValue="(value) => getIndexOfScript(value)">
                                <div class="relative mt-1">
                                    <ComboboxInput
                                        class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                        :displayValue="(script) => script.name" @change="query = $event.target.value" />
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
                                            class="z-[1] absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white p-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                            <div v-if="filteredScript.flat().length === 0 && query !== ''"
                                                class="relative cursor-default select-none px-4 py-2 text-gray-700">
                                                Nothing found.
                                            </div>
                                            <div v-for="(part, part_index) in filteredScript">
                                                <div v-if="part.length !== 0" class="text-gray-400 p-2">
                                                    {{ currentBook.parts[part_index].name }}
                                                </div>
                                                <ComboboxOption v-for="(script, index) in part"
                                                    :key="part_index + '.' + index" :value="script" v-slot="{ active, selected }
                                                    ">
                                                    <li class="p-2" :class="{
                                                        'bg-blue-500 text-white': active,
                                                        'bg-white text-black': !active,
                                                    }">
                                                        <!--CheckIcon v-show="selected" /-->
                                                        {{ script.name }}
                                                    </li>
                                                </ComboboxOption>
                                                <hr>
                                            </div>
                                        </ComboboxOptions>
                                    </Transition>
                                </div>
                            </Combobox>
                        </div>
                        <div class="w-full md:w-72">
                            <Combobox v-model="currentData.chapter">
                                <div class="relative mt-1">
                                    <ComboboxInput
                                        class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
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
                                            class="z-[1] absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white p-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                            <div v-if="filteredChapter.length === 0 && query !== ''"
                                                class="relative cursor-default select-none px-4 py-2 text-gray-700">
                                                Nothing found.
                                            </div>
                                            <ComboboxOption v-for="(chapter, index) in filteredChapter" :key="index"
                                                :value="index" v-slot="{ active, selected }">
                                                <li class="p-2" :class="{
                                                    'bg-blue-500 text-white': active,
                                                    'bg-white text-black': !active,
                                                }">
                                                    <!--CheckIcon v-show="selected" /-->
                                                    {{ index + 1 }}
                                                </li>
                                            </ComboboxOption>
                                        </ComboboxOptions>
                                    </Transition>
                                </div>
                            </Combobox>
                        </div>
                    </div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan=2 class="px-6 py-4 overflow-hidden">
                    <span v-if="showVerseNumber" v-for="(verse, index) in currentChapter.verses">
                        <h3 v-show="verse.pericope != null" class="font-medium text-md pb-2 pt-5">{{ verse.pericope }}</h3>
                        {{ verse.text }}
                    </span>
                    <p v-else v-for="(verse, index) in currentChapter.verses">
                    <h3 v-show="verse.pericope != null" class="font-medium text-md pb-2 pt-5">{{ verse.pericope }}</h3>
                    <span class="text-md font-medium">{{ index + 1 }}</span>. {{ verse.text }}
                    </p>
                </td>
            </tr>
            <tr class="border-b dark:border-neutral-500 px-6 py-4">
                <td colspan="2">
                    <button @click="toogleVerseNumber">Show verse number</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>

</style>
