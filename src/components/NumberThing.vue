<script setup lang="ts">
defineProps<{
  number: number;
}>();
</script>

<template>
  <div class="numbers">
    <img v-if="number === 0" src="/img/0.png" />
    <img v-else-if="number === 1" src="/img/1.png" />
    <img v-else-if="number === 2" src="/img/2.png" />
    <img v-else-if="number === 3" src="/img/3.png" />
    <img v-else-if="number === 4" src="/img/4.png" />
    <img v-else-if="number === 5" src="/img/5.png" />
    <img v-else-if="number === 6" src="/img/6.png" />
    <img v-else-if="number === 7" src="/img/7.png" />
    <img v-else-if="number === 8" src="/img/8.png" />
    <img v-else-if="number === 9" src="/img/9.png" />
  </div>
</template>

<style>
.numbers {
  display: flex;
  flex-flow: row nowrap;

  gap: 0.25rem;

  > img {
    min-width: 96px;
    max-width: 96px;
    min-height: 96px;
    max-height: 96px;
  }
}
</style>
