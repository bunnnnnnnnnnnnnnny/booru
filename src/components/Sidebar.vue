<script setup lang="ts">
import SearchBar from './SearchBar.vue';
</script>

<template>
  <div class="center-x">
    <RouterLink to="/">
      <img src="/public/logo.png" width="128px" alt="Home" />
    </RouterLink>
  </div>

  <div class="box">
    <SearchBar><button class="searchbuttonsidebar">♡ Submit ♡</button></SearchBar>
    <span></span>
    <slot />
  </div>
</template>

<style>
.box {
  display: flex;
  flex-flow: column nowrap;

  padding: 1rem;
  gap: 0.5rem;

  border-radius: 0.75rem;

  background-color: var(--bg-secondary);
}

.box > form > .searchbutton {
  /* border-radius: 0.4rem; */
  margin: auto;
  margin-left: auto;
  margin-right: auto;
  padding: auto;
  max-width: 100%;
  width: 100%;
  max-height: auto;
}

.suggestionsbox {
  left: 0rem;
}
</style>
