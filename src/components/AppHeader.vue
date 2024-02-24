<template>
  <Disclosure
    v-slot="{ open }"
    as="nav"
    class="bg-neutral-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <!-- logo -->
            <img
              width="50"
              height="50"
              src="https://img.icons8.com/stickers/100/000000/torah.png"
              alt="{{ appConfig.title }}"
            />
          </div>
          <div class="md:hidden">
            <!-- App Name Mobile -->
            <h1 class="ml-5 text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
              {{ appConfig.title }}
            </h1>
          </div>
          <!-- Link -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <LinkButton
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="link-color rounded-md px-3 py-2 text-sm font-medium"
                >{{ item.name }}</LinkButton
              >
            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <ChangeThemeButton class="link-color rounded-full p-1" />
            <button
              type="button"
              class="link-color sr-only relative rounded-full p-1"
            >
              <span class="absolute -inset-1.5" />
              <span class="sr-only">View notifications</span>
              <BellIcon
                class="h-6 w-6"
                aria-hidden="true"
              />
            </button>

            <!-- Profile dropdown -->
            <Menu
              as="div"
              class="sr-only relative ml-3 hidden"
            >
              <div>
                <MenuButton
                  class="relative flex max-w-xs items-center rounded-full bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span class="absolute -inset-1.5" />
                  <span class="sr-only">Open user menu</span>
                  <img
                    class="h-8 w-8 rounded-full"
                    :src="user.imageUrl"
                    alt=""
                  />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <MenuItem
                    v-for="item in userNavigation"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <a
                      :href="item.href"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700'
                      ]"
                      >{{ item.name }}</a
                    >
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
        <div class="-mr-2 flex md:hidden">
          <ChangeThemeButton class="link-color rounded-md p-2" />
          <!-- Mobile menu button -->
          <DisclosureButton
            class="link-color relative inline-flex items-center justify-center rounded-md p-2"
          >
            <span class="sr-only absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <Bars3Icon
              v-if="!open"
              class="block h-6 w-6"
              aria-hidden="true"
            />
            <XMarkIcon
              v-else
              class="block h-6 w-6"
              aria-hidden="true"
            />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <DisclosurePanel
      v-slot="{ close }"
      class="md:hidden"
    >
      <div class="pb-3sm:px-3 space-y-1 px-5">
        <h6 class="font-md tracking-tight">
          <span class="inline-block">Webible</span>
        </h6>
      </div>
      <!-- link mobile -->
      <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
        <LinkButton
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="link-color block rounded-md px-3 py-2 text-base font-medium"
          @click="close"
          >{{ item.name }}</LinkButton
        >
      </div>
      <div class="sr-only border-t border-gray-700 pb-3 pt-4">
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
            <img
              class="h-10 w-10 rounded-full"
              :src="user.imageUrl"
              alt=""
            />
          </div>
          <div class="ml-3">
            <div class="text-base font-medium leading-none text-white">{{ user.name }}</div>
            <div class="text-sm font-medium leading-none text-gray-400">
              {{ user.email }}
            </div>
          </div>
          <button
            type="button"
            class="link-color relative ml-auto flex-shrink-0 rounded-full"
          >
            <span class="absolute -inset-1.5" />
            <span class="sr-only">View notifications</span>
            <BellIcon
              class="h-6 w-6"
              aria-hidden="true"
            />
          </button>
        </div>
        <div class="mt-3 space-y-1 px-2">
          <DisclosureButton
            v-for="item in userNavigation"
            :key="item.name"
            as="a"
            :href="item.href"
            class="link-color block rounded-md px-3 py-2 text-base font-medium"
          >
            {{ item.name }}</DisclosureButton
          >
        </div>
      </div>
      <div class="pb-3"></div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useAppConfig } from '#app'

const appConfig = useAppConfig()

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/User_icon-cp.svg/485px-User_icon-cp.svg.png'
}

const navigation = [
  { name: 'Welcome', href: '/' },
  { name: 'Bible', href: '/bible' },
  { name: 'Bible Code', href: '/biblecode' },
  { name: 'About', href: '/about' }
]

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' }
]
</script>

<style scoped>
.link-color {
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  @apply text-slate-800 hover:bg-gray-50 hover:text-blue-500  focus:ring-gray-400  focus:ring-offset-slate-200;
  @apply dark:text-slate-400 dark:hover:bg-gray-700 dark:hover:text-slate-100 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-800;
}
.link-color.active {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-500;
  @apply dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700;
}
</style>
