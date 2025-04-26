<script setup lang="ts">
import { apiUrl } from '@/lib/api';
import type { Post } from '@/lib/types';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

let props = defineProps<{ post: Post; selectionMode: boolean; selected: number[] }>();

const shownExtensions = [
  'gif',
  'mp4',
  'webm',
  'ogg',
  'mp3',
  'opus',
  'flac',
  'wma',
  'm4a',
  'zip',
  'tar',
  'gz',
  'tar.gz',
  '7z',
  'rar',
];
const src = computed(() => apiUrl('thumbs/' + props.post.md5 + (props.post.trans ? '.png' : '.jpg')));
const ext = computed(() => (shownExtensions.includes(props.post.ext) ? props.post.ext : null));
const alt = computed(() => (!!props.post.title ? props.post.title : 'Post #' + props.post.id));
const audioFormats = ['ogg', 'mp3', 'opus', 'flac', 'wma', 'm4a'];
const archiveFormats = ['zip', 'tar', 'gz', 'tar.gz', '7z', 'rar'];
</script>

<template>
  <component
    :is="selectionMode ? 'div' : RouterLink"
    class="post"
    :to="`/posts/${post.id}`"
    :class="{ selected: selectionMode && selected.includes(post.id) }"
  >
    <div>
      <img v-if="!audioFormats.concat(archiveFormats).includes(post.ext)" :src :alt />
      <img v-if="audioFormats.includes(post.ext)" src="/audiofileicon.png" />
      <img v-if="archiveFormats.includes(post.ext)" src="/zipbunny.png" />
      <div v-if="shownExtensions.includes(post.ext)" class="thumbnail-format">{{ post.ext }}</div>
    </div>
  </component>
</template>

<style>
.post {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 192px;
  height: 192px;

  overflow: hidden;

  background-color: var(--bg-secondary);

  border: 1px solid rgb(51, 47, 54);
  border-radius: 0.75rem;

  padding: 0.75rem;

  > div {
    position: relative;
    width: 100%;
    height: 100%;

    > img {
      height: 100%;
      object-fit: contain;
      width: 100%;
    }

    &::after {
      content: attr(data-format);
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}

.selected {
  background-color: #5b5365;
  box-shadow: inset 0px 0px 28px 0px rgb(228, 211, 223);
  box-shadow: outset 0px 0px 28px 0px rgb(228, 211, 223);
}

.thumbnail-format {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  color: white;
  padding: 0.25rem;
  padding-top: 0rem;
  padding-bottom: 0.3rem;
  font-size: 1rem;
  font-style: bold;

  position: absolute;
  bottom: -0.75rem;
  left: -0.75rem;

  text-shadow: 0 0 8px black;
}
</style>
