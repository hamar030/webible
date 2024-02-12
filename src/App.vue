<script setup lang="ts">
<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { SunIcon as SunSolid } from '@heroicons/vue/24/solid'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

const APP_NAME = 'WeBible'
const APP_NAME = 'WeBible'
const currentTheme = ref(
  localStorage.getItem('webibleTheme') === null ? 'system' : localStorage.getItem('webibleTheme')
)
const systemDarkTheme = window.matchMedia('(prefers-color-scheme: dark)')

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/User_icon-cp.svg/485px-User_icon-cp.svg.png'
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/User_icon-cp.svg/485px-User_icon-cp.svg.png'
}

const navigation = [
  { name: 'Bible', href: '/bible', current: false, route: true },
  { name: 'Bible Code', href: '/bible-code', current: false, route: true },
  { name: 'Bible', href: '/bible', current: false, route: true },
  { name: 'Bible Code', href: '/bible-code', current: false, route: true },
  {
    name: 'Fork This App on Github',
    href: 'https://github.com/hamar030/webible.git',
    current: false, route: false,
  },
]

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' }
]

// toogle currentTheme
function toogleTheme() {
  switch (currentTheme.value) {
    case 'light': // set to Dark Theme
      localStorage.setItem('webibleTheme', 'dark')
      document.documentElement.classList.add('dark')
      break
    case 'dark': // set to System Theme
      localStorage.removeItem('webibleTheme')
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      break
    case 'system': // set to Light Theme
      localStorage.setItem('webibleTheme', 'light')
      document.documentElement.classList.remove('dark')
      break
  }

  currentTheme.value =
    localStorage.getItem('webibleTheme') === null ? 'system' : localStorage.getItem('webibleTheme')
}

// change system theme automaticly
systemDarkTheme.onchange = (systemTheme) => {
  if (currentTheme.value == 'system') {
    if (systemTheme.matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

// set theme on load
if (
  currentTheme.value === 'dark' ||
  (currentTheme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
</script>

<template>
  <html>

  <head>
    <title>{{ APP_NAME }}</title>
  </head>

  <body class="font-body">
    <div class="h-full h-full min-h-screen">
      <route-view name="header">
        <Disclosure
v-slot="{ open }" as="nav"
          class="bg-neutral-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <img class="sr-only h-8 w-8" src="/src/assets/logo.svg" alt="Your Company" />
                  <img
width="50" height="50" src="https://img.icons8.com/stickers/100/000000/torah.png"
                    alt="{{APP_NAME}}" />
                </div>
                <div class="md:hidden">
                  <h1 class="ml-5 text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
                    {{ APP_NAME }}
                  </h1>
                </div>
                <div class="hidden md:block">
                  <div class="ml-10 flex items-baseline space-x-4">
                    <component
:is="item.route?'router-link':'a'" v-for="item in navigation" :key="item.name" :to="item.href" :href="item.href" :class="[
                      item.current
                        ? 'bg-gray-200 text-white dark:bg-gray-900'
                        : 'hover:bg-gray-50 hover:text-blue-500 dark:text-slate-400 dark:hover:bg-gray-700 dark:hover:text-slate-100',
                      'rounded-md px-3 py-2 text-sm font-medium'
                    ]" :aria-current="item.current ? 'page' : undefined">{{
  item.name }}</component>
                  </div>
                </div>
              </div>
              <div class="hidden md:block">
                <div class="ml-4 flex items-center md:ml-6">
                  <button
                    class="relative rounded-full p-1 hover:bg-gray-50 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:hover:bg-gray-700 dark:hover:text-slate-100"
                    @click="toogleTheme">
                    <span class="absolute -inset-1.5" />
                    <span class="sr-only">Change Theme</span>
                    <SunIcon v-show="currentTheme == 'system'" class="h-6 w-6" aria-hidden="true" />
                    <SunSolid v-show="currentTheme == 'light'" class="h-6 w-6" aria-hidden="true" />
                    <MoonIcon v-show="currentTheme == 'dark'" class="h-6 w-6" aria-hidden="true" />
                  </button>
                  <button
type="button"
                    class="sr-only relative rounded-full p-1 text-gray-400 hover:bg-sky-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:hover:bg-gray-700">
                    <span class="absolute -inset-1.5" />
                    <span class="sr-only">View notifications</span>
                    <BellIcon class="h-6 w-6" aria-hidden="true" />
                  </button>

                  <!-- Profile dropdown -->
                  <Menu as="div" class="sr-only relative ml-3">
                    <div>
                      <MenuButton
                        class="relative flex max-w-xs items-center rounded-full bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span class="absolute -inset-1.5" />
                        <span class="sr-only">Open user menu</span>
                        <img class="h-8 w-8 rounded-full" :src="user.imageUrl" alt="" />
                      </MenuButton>
                    </div>
                    <transition
enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                      <MenuItems
                        class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                        <a
:href="item.href" :class="[
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700'
                        ]">{{ item.name }}</a>
                        </MenuItem>
                      </MenuItems>
                    </transition>
                  </Menu>
                </div>
              </div>
              <div class="-mr-2 flex md:hidden">
                <button
                  class="relative mr-2 inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-50 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:text-slate-400 dark:hover:bg-gray-700 dark:hover:text-slate-100"
                  @click="toogleTheme">
                  <span class="sr-only absolute -inset-1.5" />
                  <span class="sr-only">Change Theme</span>
                  <SunIcon v-show="currentTheme == 'system'" class="h-6 w-6" aria-hidden="true" />
                  <SunSolid v-show="currentTheme == 'light'" class="h-6 w-6" aria-hidden="true" />
                  <MoonIcon v-show="currentTheme == 'dark'" class="h-6 w-6" aria-hidden="true" />
                </button>
                <!-- Mobile menu button -->
                <DisclosureButton
                  class="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-50 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:text-slate-400 dark:hover:bg-gray-700 dark:hover:text-slate-100">
                  <span class="sr-only absolute -inset-0.5" />
                  <span class="sr-only">Open main menu</span>
                  <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
                  <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel class="md:hidden">
            <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              <DisclosureButton
v-for="item in navigation" :key="item.name" as="a" :href="item.href" :class="[
                item.current
                  ? 'bg-gray-900 text-white'
                  : 'hover:bg-gray-50 hover:text-blue-500 dark:text-slate-400 dark:hover:bg-gray-700 dark:hover:text-slate-100',
                'block rounded-md px-3 py-2 text-base font-medium'
              ]" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</DisclosureButton>
            </div>
            <div class="sr-only border-t border-gray-700 pb-3 pt-4">
              <div class="flex items-center px-5">
                <div class="flex-shrink-0">
                  <img class="h-10 w-10 rounded-full" :src="user.imageUrl" alt="" />
                </div>
                <div class="ml-3">
                  <div class="text-base font-medium leading-none text-white">{{ user.name }}</div>
                  <div class="text-sm font-medium leading-none text-gray-400">{{ user.email }}</div>
                </div>
                <button
type="button"
                  class="relative ml-auto flex-shrink-0 rounded-full bg-slate-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span class="absolute -inset-1.5" />
                  <span class="sr-only">View notifications</span>
                  <BellIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div class="mt-3 space-y-1 px-2">
                <DisclosureButton
v-for="item in userNavigation" :key="item.name" as="a" :href="item.href"
                  class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
                  {{ item.name }}</DisclosureButton>
              </div>
            </div>
            <div class="pb-3"></div>
          </DisclosurePanel>
        </Disclosure>

        <header class="hidden bg-neutral-100 text-slate-800 shadow-lg dark:bg-slate-800 dark:text-white md:block">
          <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:min-h-48 lg:px-8">
            <h1 class="text-3xl font-bold tracking-tight font-display">{{ APP_NAME }}</h1>
          </div>
        </header>
      </route-view>

        <header class="hidden bg-neutral-100 text-slate-800 shadow-lg dark:bg-slate-800 dark:text-white md:block">
          <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:min-h-48 lg:px-8">
            <h1 class="text-3xl font-bold tracking-tight font-display">{{ APP_NAME }}</h1>
          </div>
        </header>
      </route-view>

      <!-- Content section -->
      <main>
        <div class="mx-auto max-w-7xl md:px-6 md:py-6 lg:px-8">
          <!-- Your content -->
          <!-- Your content -->
          <div
            class="mx-auto min-h-96 bg-white p-5 text-black shadow-lg dark:bg-slate-900 dark:text-white md:-mt-32 md:rounded-lg">
            <router-view />
            <router-view />
          </div>
          <!--Copyright section-->
          <route-view name="footer">
            <footer>
              <div class="copyright">
                <span class="inline-block">© 2024 No Copyright: <a href="https://webible.netlify.app/">WeBible</a></span>
                | <span class="inline-block">Hosted by: <a href="https://netlify.com/">Netlify</a></span> |
                <span class="inline-block">For the Glory of YAHWEH</span>
              </div>
            </footer>
          </route-view>
        </div>
      </main>
          <!--Copyright section-->
          <route-view name="footer">
            <footer>
              <div class="copyright">
                <span class="inline-block">© 2024 No Copyright: <a href="https://webible.netlify.app/">WeBible</a></span>
                | <span class="inline-block">Hosted by: <a href="https://netlify.com/">Netlify</a></span> |
                <span class="inline-block">For the Glory of YAHWEH</span>
              </div>
            </footer>
          </route-view>
        </div>
      </main>
    </div>
  </body>

  </html>
</template>

<style scoped>
.copyright {
  @apply w-full p-4 text-center text-neutral-700 dark:text-neutral-200;
}

.copyright a {
  @apply text-neutral-800 dark:text-neutral-400;
}
</style>
