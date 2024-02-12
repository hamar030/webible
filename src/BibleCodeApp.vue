<script setup lang="ts">
import { onMounted, ref, createApp } from 'vue'
import {Book} from '@/lib/book'

const data_url = '/data/id-ilt3.yaml'
//const data_url = "/data/list-bible.yaml"



let msg = ref('Hello Code')
onMounted(() => {
  const book = Book.initialize(data_url)
})
</script>
<template>
    <article>
      <p>
        {{book}}
      </p>
    </article>
</template>
