<script setup lang="ts">
import router from '@/router';

defineProps<{ name: string; count: number }>();

function tagButton(buttonTag: string) {
  console.log('Button Tag:', buttonTag);
  router.push(`../posts?q=${buttonTag}`);
}
</script>

<template>
  <li>
    <!-- <a class="tag" :href="`../posts?q=${name}`"><span class="name">{{ name }}</span> <span class="count">- {{ count }}</span></a> -->
    <!-- <button class="tag" @click="tagButton(name)"><span class="name">{{ name }}</span> <span class="count">- {{ count }}</span></button>  -->
    <RouterLink :to="`../posts?q=${name}`" class="tag"
      ><span class="name">{{ name }}</span> <span class="count">- {{ count }}</span></RouterLink
    >
  </li>
</template>

<style>
.name {
  color: #a285bb;
  font-style: bold;
}

.count {
  color: #7a787b;
  font-size: 0.85rem;
}

.tag {
  text-decoration: none;
  background: none;
  border: none;
}
</style>
