<script setup lang="ts">
import PostTag from '@/components/PostTag.vue';
import PostThumbnail from '@/components/PostThumbnail.vue';
import Sidebar from '@/components/Sidebar.vue';
import { apiUrl } from '@/lib/api';
import type { Post } from '@/lib/types';
import { reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

type Results = { posts: Post[]; first: number; last: number };

const results = ref<Results>();
const route = useRoute();
const selectionMode = ref(false);
const selected = ref<number[]>([]);

const inputTags = ref('');

let queryPrevious = '';
let queryNext = '';
let failure = false;

function postSelection(id: number) {
  if (!selectionMode) {
    return;
  }

  const index = selected.value.indexOf(id);

  if (index === -1) {
    selected.value.push(id);
  } else {
    selected.value.splice(index, 1);
  }
}

function submitTagChanges(e: Event) {
  e.preventDefault();

  fetch(apiUrl('posts/bulk'), {
    method: 'PATCH',
    body: JSON.stringify({ tags: inputTags.value.split(' '), posts: selected.value }),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
}

async function onRouteChange() {
  let q = route.query.q as string;
  if (!q) {
    q = '';
  }
  let page = route.query.page as string;
  if (!page) {
    page = '1';
  }
  console.log('Query (bepis):', q, 'Page:', page);
  // const params = q ? new URLSearchParams([['q', q]]) : null;
  const params = new URLSearchParams([
    ['q', q],
    ['page', page],
    ['after', route.query.after as string],
    ['before', route.query.before as string],
  ]);
  const response = await fetch(apiUrl('posts', params));

  let lastQuery = route.query.q as string;
  if (route.query.after) {
    lastQuery += ('&after=' + route.query.after) as string;
  } else if (route.query.before) {
    lastQuery += ('&before=' + route.query.before) as string;
  } else if (route.query.offset) {
    lastQuery += ('&offset=' + route.query.offset) as string;
  }
  localStorage.setItem('query', lastQuery);

  console.log('route.query:', route.query);

  if (response.ok) {
    results.value = (await response.json()) as Results;
    console.log('first in whole search:', results.value.first);
    console.log('last in whole search:', results.value.last);
    if (results.value.posts.length > 0) {
      console.log('first on page:', results.value.posts[0].id);
      console.log('last on page:', results.value.posts[results.value.posts.length - 1].id);
      console.log('\n\n\n\n\n\n\n');
      queryPrevious = (('q=' + route.query.q) as string) + '&after=' + results.value.posts[0].id;
      queryNext =
        (('q=' + route.query.q) as string) + '&before=' + results.value.posts[results.value.posts.length - 1].id;
    } else {
      queryPrevious = '';
      queryNext = '';
      failure = true;
    }
  } else {
    console.error('oh no 3:');
  }
}

const tags = ref<{ name: string; count: number }[]>([]);

function onResultsChange() {
  const tag_counts: Map<string, number> = new Map();

  for (const post of results.value?.posts ?? []) {
    for (const tag of post.tags) {
      const n = tag_counts.get(tag) ?? 0;
      tag_counts.set(tag, n + 1);
    }
  }

  tags.value = [...tag_counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}
watch(route, onRouteChange, { immediate: true });
watch(results, onResultsChange, { immediate: true });

const previous = reactive({ disabled: true, to: '' });
const next = reactive({ disabled: true, to: '' });

watch(results, () => {
  try {
    previous.disabled = results.value?.first == results.value?.posts[0].id;
    previous.to = results.value?.first == results.value?.posts[0].id ? '#' : `../posts?${queryPrevious}`;
    next.disabled = results.value?.last == results.value?.posts[results.value?.posts.length - 1].id;
    next.to =
      results.value?.last == results.value?.posts[results.value?.posts.length - 1].id ? '#' : `../posts?${queryNext}`;
  } catch {}
});
</script>

<template>
  <section>
    <aside>
      <Sidebar>
        <button class="button" :class="!selectionMode ? 'grayed' : ''" @click="selectionMode = !selectionMode">
          Selection Mode
        </button>
        <form @submit="submitTagChanges" :style="!selectionMode ? 'display: none;' : ''">
          <input type="text" placeholder="enter tags..." v-model="inputTags" />
        </form>
      </Sidebar>
      <div class="tags">
        <ul>
          <PostTag v-for="{ name, count } in tags" :name :count />
        </ul>
      </div>
    </aside>
    <div id="container">
      <div class="navigation">
        <RouterLink class="button" :to="previous.to" :disabled="previous.disabled">Previous</RouterLink>
        <RouterLink class="button" :to="next.to" :disabled="next.disabled">Next</RouterLink>
      </div>
      <div class="results">
        <PostThumbnail
          v-for="post in results?.posts ?? []"
          :post
          :selectionMode
          :selected
          @click="postSelection(post.id)"
        />
      </div>
      <div v-if="failure" class="errormessage">
        <div>
          <img src="/errorbunny.png" />
          Nothing found. There are no results for that query, or you entered an invalid tag.
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.container {
  position: relative;
}

.results {
  display: grid;
  grid-template-columns: repeat(auto-fit, 192px);
  gap: 1rem;

  width: 100%;
  height: min-content;

  margin-top: 1rem;

  position: relative;
  top: 0;
  left: 0;
}

.errormessage {
  position: relative;
  width: 100%;
  div {
    display: block;
    margin-left: auto;
    margin-right: auto;
    align-items: center;
    text-align: center;
  }
  img {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
}

.button {
  border-width: 1px;
  border-color: gray;
  border-radius: 10px;
  border-style: solid;
  background: #4e4757;

  gap: 3rem;
  position: relative;
  margin: 0.2rem;
  display: inline-block;
  padding: 0.2rem;

  text-decoration: none;
  color: #efefef;
}

.button[disabled='true'] {
  background: #423d49;
  color: gray;
  pointer-events: none;
}

.grayed {
  background: #423d49;
  color: gray;
}

.navigation {
  /* height: auto;
  width: 12rem;
  border-width: 1px;
  border-color: gray;
  border-radius: 10px;
  border-style: solid;
  background: #302a38; */
  width: 12rem;
  align-items: center;
  text-align: center;

  position: relative;
  top: 0;
  left: -0.5rem;
}
</style>
