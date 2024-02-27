<template>
  <button
    class="relative overflow-hidden"
    @click="toogleTheme"
  >
    <span class="absolute -inset-1.5" />
    <span class="sr-only">Change Theme</span>
    <div class="relative m-2 h-3 w-3">
      <ClientOnly>
        <Transition
          enter-active-class="transition-all ease-out duration-150"
          enter-from-class="opacity-0 -rotate-45"
          enter-to-class="opacity-100 rotate-0"
          leave-active-class="transition-all easy-in duration-150"
          leave-from-class="opacity-100 rotate-0"
          leave-to-class="opacity-0 rotate-90"
        >
          <component
            :is="
              $colorMode.preference === 'light'
                ? SunSolid
                : $colorMode.preference === 'dark'
                  ? MoonIcon
                  : SunIcon
            "
            class="absolute -inset-1.5"
            aria-hidden="true"
          />
        </Transition>
        <template #fallback>
          <!-- this will be rendered on server side -->
          <SunIcon
            class="absolute -inset-1.5"
            aria-hidden="true"
          />
        </template>
      </ClientOnly>
    </div>
  </button>
</template>
<script setup lang="ts">
import { SunIcon as SunSolid, MoonIcon } from '@heroicons/vue/24/solid'
import { SunIcon } from '@heroicons/vue/24/outline'
import { useColorMode } from '#imports'

const colorMode = useColorMode()

const toogleTheme = () =>
  colorMode.preference === 'system'
    ? (colorMode.preference = 'light')
    : colorMode.preference === 'light'
      ? (colorMode.preference = 'dark')
      : (colorMode.preference = 'system')
</script>
