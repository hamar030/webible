<template>
  <Disclosure
    v-slot="{ open }"
    as="nav"
    class="bg-neutral-100 text-neutral-700 dark:bg-slate-800 dark:text-slate-300"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="flex flex-shrink-0 flex-row flex-row">
            <span class="sr-only">logo</span>
            <div class="flex items-center">
              <img
                width="50"
                height="50"
                :src="appConfig.logo"
                :alt="appConfig.title"
              />
            </div>
            <span class="sr-only">head text</span>
            <div class="ml-2 flex flex-col leading-none tracking-tight md:hidden">
              <h1 class="font-display text-2xl font-bold">{{ appConfig.title }}</h1>
              <h6 class="font-md">
                {{ appConfig.description }}
              </h6>
            </div>
          </div>
          <!-- Link -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <!-- hydration mismatch -->
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
          </div>
        </div>
        <div class="-mr-2 flex md:hidden">
          <ChangeThemeButton class="link-color mr-1 rounded-md p-2" />
          <!-- Mobile menu button -->
          <DisclosureButton
            class="link-color relative inline-flex items-center justify-center rounded-md p-2"
          >
            <span class="sr-only absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <div class="relative m-2 h-3 w-3">
              <Transition
                enter-active-class="transition-all ease-out duration-150"
                enter-from-class="opacity-0 -rotate-45"
                enter-to-class="opacity-100 rotate-0"
                leave-active-class="transition-all easy-in duration-150"
                leave-from-class="opacity-100 rotate-0"
                leave-to-class="opacity-0 rotate-90"
              >
                <component
                  :is="open ? XMarkIcon : Bars3Icon"
                  class="absolute -inset-1.5"
                  aria-hidden="true"
                />
              </Transition>
            </div>
          </DisclosureButton>
        </div>
      </div>
    </div>

    <DisclosurePanel
      v-slot="{ close }"
      class="md:hidden"
    >
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
      <div class="pb-3"></div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useAppConfig } from '#app'

const appConfig = useAppConfig()

const navigation = [
  { name: 'Welcome', href: '/' },
  { name: 'Bible', href: '/bible' },
  { name: 'Bible Code', href: '/biblecode' },
  { name: 'About', href: '/about' }
]
</script>

<style scoped lang="pcss">
.link-color {
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  @apply text-slate-800 hover:bg-gray-200 hover:text-blue-500 focus:ring-gray-400 focus:ring-offset-gray-50;
  @apply dark:text-slate-400 dark:hover:bg-gray-700 dark:hover:text-slate-100 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-800;
}
.link-color.active {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-500;
  @apply dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700;
}
</style>
