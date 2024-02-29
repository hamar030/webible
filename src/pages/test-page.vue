<template>
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
        <ClientOnly>
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
        </ClientOnly>
      </HeadlessMenuItems>
    </transition>
  </HeadlessMenu>
</template>

<script setup lang="ts">
import { useBibleConfigStore } from '../stores/bibleConfig'
const useConfig = useBibleConfigStore()

import {
  //   ChevronUpDownIcon,
  ChevronDownIcon,
  CheckIcon
  //   ChevronLeftIcon,
  //   ChevronRightIcon
} from '@heroicons/vue/24/solid'
</script>
