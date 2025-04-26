<script setup lang="ts">
import { apiUrl } from '@/lib/api';
import { debounce } from '@/lib/utils';
import { useSearchResults } from '@/stores/results';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const search = useSearchResults();
const input = ref('');
const router = useRouter();

const inputfocused = ref(false);

type Suggestions = [{ name: string; count: number }];

const suggestions = ref<Suggestions>();
const suggest = [] as String[];
localStorage.setItem('query', '');

function onSuggestionClick(suggestion: string) {
  const inputTags = input.value.split(' ');
  input.value = `${inputTags.splice(0, inputTags.length - 1).join(' ')} ${suggestion}`;
}

function onSubmit(e: Event) {
  e.preventDefault();

  if (!input.value) {
    router.push(`/posts`);
  }

  const query = input.value.split(' ').join('+');
  // console.log("Sidebar input:", query);
  router.push(`/posts?q=${query}`);
  // router.replace(`/posts?q=${query}`);
  // location.reload();

  search.previousQuery = search.query;
  search.query = query;
  localStorage.setItem('query', search.query);

  // router.push(`/posts?q=${input.value.split(' ').join('+')}`);
}

const awa = ref('');

async function loadSuggestionsImpl() {
  if (input.value.length > 0) {
    console.log('Search bar input:', input);
    inputfocused.value = false;
    const params = new URLSearchParams([['suggest', input.value]]);
    const response = await fetch(apiUrl('posts/suggest', params));

    if (response.ok) {
      suggestions.value = (await response.json()) as Suggestions;
      // for (const post of results.value?.posts ?? []) {
      // const suggest = [];
      suggest.length = 0;
      awa.value = '';

      for (const suggestion of suggestions.value) {
        suggest.push(suggestion.name);
      }

      console.log('Suggested tags:', suggest.join(', '));

      awa.value = suggest.join(', ');

      if (awa.value.length > 0) {
        inputfocused.value = true;
      }
    } else {
      console.log('Error returned');
      awa.value = '';
      inputfocused.value = false;
    }
  } else {
    console.log('Search bar empty');
    awa.value = '';
    inputfocused.value = false;
  }
}

function defocusImpl() {
  inputfocused.value = false;
}

const defocus = debounce(defocusImpl, 100);
const loadSuggestions = debounce(loadSuggestionsImpl, 700);
</script>

<template>
  <div class="suggestioncontainer">
    <form @submit="onSubmit">
      <input
        class="search"
        type="text"
        placeholder="♡ enter search terms ♡"
        v-model="input"
        @input="loadSuggestions"
        @focusin="
          if (awa.length > 0) {
            inputfocused = true;
          }
        "
        @focusout="defocus"
      />
      <slot />
      <ul class="suggestionsbox" v-if="inputfocused">
        <li v-for="item in suggestions">
          <label @click="onSuggestionClick(item.name)"> {{ item.name }} </label>
          <div class="suggestioncount">({{ item.count }})</div>
        </li>
      </ul>
    </form>
  </div>
</template>

<style>
.suggestioncontainer {
  position: relative;
  overflow: visible;
  width: 100%;
  padding: 0px;
  margin: 0px;
}

form {
  padding: 0px;
  margin: 0px;
}

.search {
  width: 100%;
  margin: 0px;
  padding: 0px;
}

.searchbutton {
  /* border-radius: 0.4rem; */
  margin: auto;
  margin-right: 0px;
  padding: 0;
  /*
  margin-left: 0.2rem;
  max-width: 6rem;
  */
  margin-left: 0rem;
  max-height: 2rem;
}

.suggestionsbox {
  position: absolute;
  top: 1.75rem;
  left: 0px;
  /* top: 145px;
  left: 65px; */
  background: #55515a;
  z-index: 1000;
  /* position: absolute;*/
  float: left;
  width: 300px;
  color: white;
  display: flex;
  flex-flow: column nowrap;
  padding: 0 0.25rem 0.125rem 0.25rem;
}

li {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

.suggestionsbox[disabled='true'] {
  display: hidden;
}

.suggestioncount {
  text-align: right;
  width: 100%;
  color: #c4b0d6;
}
</style>
