<script setup lang="ts">
import NumberThings from '@/components/NumberThings.vue';

import SearchBar from '@/components/SearchBar.vue';
</script>

<template>
  <div class="homepage">
    <img class="homepage-portrait" src="/portrait1.png" />
    <div>
      <h1>♥ bunnny booru ♥</h1>
      <span> meow meow meow meow meow meow meow meow meow meow meow</span>
      <SearchBar><button class="searchbuttonhome">♡ Submit ♡</button></SearchBar>
      <div class="numbers">
        <NumberThings />
      </div>
    </div>
  </div>
</template>

<style>
.homepage {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column nowrap;

  flex-grow: 1;
}

.homepage > div {
  display: flex;
  flex-flow: column nowrap;

  align-items: center;
  gap: 1rem;

  padding: 1rem;
  padding-left: 2rem;
  padding-right: 2rem;

  margin-bottom: 30rem;

  max-width: 621px;
  width: 100%;
  /* border: 10px solid black; */
  border-radius: 10px;
  box-shadow: 0 0 10px 10px hsla(0, 0%, 0%, 0.14);

  /* background-color: var(--bg-secondary); */
  background-color: transparent;
  backdrop-filter: blur(2px);

  > h1 {
    text-shadow: 0 0 4px black;
  }
}

.homepage form {
  display: flex;
  justify-content: center;
  width: 100%;
}

.homepage-portrait {
  margin-bottom: -90px;
}

.searchbuttonhome {
  /* border-radius: 0.4rem; */
  margin: auto;
  margin-left: 0.2rem;
  margin-right: 0px;
  padding: 0;
  max-width: 6rem;
  max-height: 2rem;
}
</style>
