<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import NumberThing from './NumberThing.vue';

const numbers = ref([0]);

onBeforeMount(() => {
  numbers.value = (window.post_count ?? 0)
    .toString()
    .split('')
    .map((x) => Number.parseInt(x));

  if (numbers.value.find((x) => Number.isNaN(x))) {
    console.warn('schizo number', numbers.value);
  }
});
</script>

<template>
  <NumberThing v-for="number in numbers" :number />
</template>
