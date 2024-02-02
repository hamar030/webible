<script setup>
import YAML from 'yaml'
import { ref, reactive } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'

const data_url = "https://gist.githubusercontent.com/hamar030/3ed4a54ec9f2e8e1721627714193fdcc/raw/75d6e6a338e44ab13162fce7a367874c10b37ce3/example_data.yaml"
const showVerseNumber = ref(false)
const bodydata = reactive({
    raw_data: [],
    book_data: {
        book_name: "",
        part_name: "",
        script_name: "",
        chapter: 1,
        script_list: [],
        chapter_list: [],
        verse_list: [],
    },

})
const current_bible = reactive({
    book: 0,
    part: 0,
    script: 0,
    chapter: 0,
    verses: 0
})

// This is isn't declared as `async` because it already returns a promise
/*
function delay() {
    // `delay` returns a promise
    return new Promise(function (resolve, reject) {
        // Only `delay` is able to resolve or reject the promise
        setTimeout(function () {
            resolve(42); // After 3 seconds, resolve the promise with value 42
        }, 3000);
    });
}*/

async function getBibledata() {
    try {
        //let data = YAML.parse(await (await (await fetch('./data/list-bible.yaml')).blob()).text())
        let data = YAML.parse(await (await (await fetch(data_url)).blob()).text())
        console.log(data)

        bodydata.raw_data = data
        bodydata.book_data.book_name = data.book_list[current_bible.book].name
        bodydata.book_data.part_name = data.book_list[current_bible.book].parts[current_bible.part].part_name
        bodydata.book_data.script_name = data.book_list[current_bible.book].parts[current_bible.part].scripts[current_bible.script].script_name
        bodydata.book_data.chapter = data.book_list[current_bible.book].parts[current_bible.part].scripts[current_bible.script].chapters[current_bible.chapter].chapter

        bodydata.book_data.script_list = []
        bodydata.book_data.chapter_list = []
        bodydata.book_data.verse_list = []
        for (const part of data.book_list[current_bible.book].parts) {
            console.log("for-part: " + part.part_name)
            for (const script of part.scripts) {
                bodydata.book_data.script_list.push(script.script_name)
                console.log("for-script: " + script.script_name)
            }
        }
        for (const chapter of data.book_list[current_bible.book].parts[current_bible.part].scripts[current_bible.script].chapters) {
            bodydata.book_data.chapter_list.push(chapter.chapter)
            console.log("for-chapter: " + chapter.chapter)
        }
        for (const verse of data.book_list[current_bible.book].parts[current_bible.part].scripts[current_bible.script].chapters[current_bible.chapter].verses) {
            bodydata.book_data.verse_list.push(verse.text)
            console.log("for-verses: " + verse.text)
        }

    } catch (error) {
        console.error("Bible Data: " + error)
    }
}

/*
fetch('./data/list-bible.yaml')
 .then(res => res.blob())
 .then(blob => blob.text())
 .then(yamlAsString => {
     //console.log('yaml res:', YAML.parse(yamlAsString))
     bodydata.data = YAML.parse(yamlAsString);
     console.log(YAML.parse(yamlAsString).book_list[1].name)
 })
.catch(err => console.log('yaml err:', err))*/


// Start an IIFE to use `await` at the top level

(async function () {
    await getBibledata()
    console.log("data: Ready")
})()



/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function listBooks() {
    document.getElementById("listBooks").classList.toggle("show");
}
function listScripts() {
    document.getElementById("listScripts").classList.toggle("show");
}
function listChapters() {
    document.getElementById("listChapters").classList.toggle("show");
}
async function changeBook(id) {
    current_bible.book = id
    await getBibledata()
}
async function changeScript(id) {
    current_bible.script = id
    await getBibledata()
}
async function changeChapter(id) {
    current_bible.chapter = id
    await getBibledata()
}


// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function toogleVerseNumber() {
    showVerseNumber.value = !showVerseNumber.value
}
</script>

<template>
    <table class="w-full md:max-w-[1000px] mx-auto py-auto text-left text-sm font-light">
        <thead class="border-b text-center font-medium dark:border-neutral-500">
            <tr>
                <th scope="col" class="px-6 py-4">
                    <h1>Book Version:
                        <button @click="listBooks" class="dropbtn">
                            {{ bodydata.book_data.book_name }}
                        </button>
                    </h1>
                    <div id="listBooks" class="dropdown-content">
                        <button v-for="(item, index) in bodydata.raw_data.book_list" @click="changeBook(index)">
                            {{ item.name }}
                        </button>
                    </div>
                </th>
            </tr>
            <tr>
                <th scope="col" class="px-6 py-1">
                    <h1>Part: {{ bodydata.book_data.part_name }}</h1>
                </th>
            </tr>
            <tr>
                <th colspan="2" scope="col" class="px-6 py-4">
                    <button @click="listScripts" class="dropbtn">
                        {{ bodydata.book_data.script_name }}
                    </button>
                    <div id="listScripts" class="dropdown-content">
                        <button v-for="(item, index) in bodydata.book_data.script_list" @click="changeScript(index)">
                            {{ item }}
                        </button>
                    </div>
                    &nbsp;
                    <button @click="listChapters" class="dropbtn">
                        {{ bodydata.book_data.chapter }}
                    </button>
                    <div id="listChapters" class="dropdown-content">
                        <button v-for="(item, index) in bodydata.book_data.chapter_list" @click="changeChapter(index)">
                            {{ item }}
                        </button>
                    </div>

                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan=2 class="px-6 py-4 overflow-hidden">
                    <a v-if="showVerseNumber" v-for="(item, index) in bodydata.book_data.verse_list" class="">{{ item }}</a>
                    <p v-else v-for="(item, index) in bodydata.book_data.verse_list">
                        {{ index + 1 }}. {{ item }}
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
.dropdown {
    position: relative;
    display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content button {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
    background-color: #ddd;
}

/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {
    display: block;
}
</style>
