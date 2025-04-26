<script setup lang="ts">
import type { Post } from '@/lib/types';
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { apiUrl } from '@/lib/api';
import PostTag from '@/components/PostTag.vue';
import Sidebar from '@/components/Sidebar.vue';
import { Head } from '@unhead/vue/components';

const route = useRoute();
const router = useRouter();
const post = ref<Post | null>(null);

const sitesWithIcon = [] as string[];
const siteIcons = import.meta.glob('/public/webicons/*', { eager: true });
for (const icon in siteIcons) {
  sitesWithIcon.push(icon.split('/public/webicons/')[1].split('.').slice(0, -1).join('.'));
  console.log(sitesWithIcon);
}

const imageFormats = ['jpg', 'png', 'gif', 'webp'];
const videoFormats = ['webm', 'mp4', 'mov'];
const audioFormats = ['ogg', 'mp3', 'opus', 'flac', 'wma', 'm4a'];
const embedFormats = ['pdf'];
const archiveFormats = ['zip', 'tar', 'gz', 'tar.gz', '7z', 'rar'];
const allFormats = imageFormats.concat(videoFormats, audioFormats, embedFormats, archiveFormats);

const lastQuery = localStorage.getItem('query');

const altText = computed(() => (post.value?.filename ? post.value?.filename : post.value?.title));

function tagButton(buttonTag: string) {
  console.log('Button Tag:', buttonTag);
  router.push(`/posts?q=${buttonTag}`);
}

function webicon(url: string) {
  let uri = new URL(url);
  let path = `/webicons/${uri.hostname}.png`;

  console.log(path);

  if (sitesWithIcon.includes(uri.hostname)) {
    return path;
  } else {
    return '/favicon.png';
  }
}

function bettertimestamp(timestamp: any) {
  const date = new Date(timestamp);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return String(
    months[date.getMonth()] +
      ' ' +
      date.getDate() +
      ', ' +
      date.getFullYear() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes() +
      ':' +
      date.getSeconds(),
  ); //.split(".").slice(0, -1).join().split("T").join("\n");
}

onMounted(async () => {
  const response = await fetch(apiUrl(`posts/${route.params.id}`));

  if (response.ok) {
    post.value = await response.json();
  } else {
    console.error('oh no 3:');
  }
});

function saveAsFilename(text: string, filename: string) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}
</script>

<template>
  <Head>
    <title>awawawawawawawawaw</title>
    <link rel="icon" href="/favicon.png" />
    <meta property="og:type" content="" />
    <meta property="og:title" content="bunnny booru" />
    <meta property="og:image" :content="apiUrl('files/' + post?.md5 + '.' + post?.ext)" />
    <meta property="og:description" :content="post?.description" />
    <meta property="og:image:alt" :content="`Post #${post?.id ?? 0}`" />
    <meta name="twitter:card" content="summary_large_image" />
  </Head>

  <section v-if="post">
    <aside>
      <Sidebar> </Sidebar>
      <div class="tags">
        <ul>
          <template v-for="tag in post.tags">
            <li>
              <!-- <a class="tag" :href="`../posts?q=${tag}`">{{ tag }}</a> -->
              <button class="tag" @click="tagButton(tag)">{{ tag }}</button>
            </li>
          </template>
        </ul>
      </div>
      <div class="filestatsbox">
        <div>
          <span class="filestats"
            >Uploaded:
            <div class="timestamp">{{ bettertimestamp(post.created_at) }}</div></span
          >
          <span v-if="post.updated_at != post.created_at" class="filestats"
            >Modified:
            <div class="timestamp">{{ bettertimestamp(post.updated_at) }}</div></span
          >
          <span v-if="post.source.length > 0" v-for="source in post.source" class="filestats"
            ><div v-if="post.source.length > 0" class="source">Source:</div>
            <img v-if="source.includes('://') && source != ''" :src="webicon(source)" height="16px" />
            <a v-if="source.includes('://') && source != ''" :href="source">{{ source }}</a>
            <div v-if="!source.includes('://') && source.length > 0">{{ source }}</div>
          </span>
        </div>
      </div>
    </aside>

    <div class="post-content">
      <div>
        <RouterLink :to="`../posts?q=${lastQuery}`" class="backbutton">back</RouterLink>
        <img
          v-if="imageFormats.includes(post.ext)"
          :src="apiUrl('files/' + post.md5 + '.' + post.ext)"
          :alt="altText"
        />
        <video v-if="videoFormats.includes(post.ext)" controls :alt="altText">
          <source :src="apiUrl('files/' + post.md5 + '.' + post.ext)" :type="'video/' + post.ext" />
        </video>
        <audio v-if="audioFormats.includes(post.ext)" controls :alt="altText">
          <source :src="apiUrl('files/' + post.md5 + '.' + post.ext)" :type="'audio/' + post.ext" />
        </audio>
        <a
          v-if="embedFormats.includes(post.ext)"
          class="embedButton"
          :href="apiUrl('files/' + post.md5 + '.' + post.ext)"
          >Open document directly</a
        >
        <embed
          v-if="embedFormats.includes(post.ext)"
          :alt="altText"
          :src="apiUrl('files/' + post.md5 + '.' + post.ext)"
        />
        <img v-if="archiveFormats.includes(post.ext)" src="/zipbunny.png" />
        <img v-if="!allFormats.includes(post.ext)" src="/errorbunny.png" />
        <p v-if="post.filename">{{ post.filename + '.' + post.ext }}</p>
        <!-- <p v-if="archiveFormats.includes(post.ext)"><a :href="apiUrl('files/' + post.md5 + '.' + post.ext)">Download</a></p> -->
        <p v-if="!allFormats.includes(post.ext)">
          Unsupported file. <a :href="apiUrl('files/' + post.md5 + '.' + post.ext)">Download</a>
        </p>
        <p v-if="!!post.description">Description: {{ post.description }}</p>
        <button
          class="downloadbutton"
          @click="
            saveAsFilename(
              apiUrl('files/' + post.md5 + '.' + post.ext),
              altText ? altText + '.' + post.ext : post.md5 + '.' + post.ext,
            )
          "
        >
          Download
        </button>
      </div>
    </div>
  </section>
</template>

<style>
.downloadbutton {
  border: none;
  font-style: bold;
  font-size: 1.2rem;
  text-decoration: none;
  color: antiquewhite;
  background-color: rgb(81, 65, 85);
  border-radius: 0.75rem;
  padding: 0.4rem;
  box-shadow: 0 0 5px 5px hsla(0, 0%, 0%, 0.14);

  padding-bottom: 2.3rem;

  width: 7.5rem;

  > :active {
    color: antiquewhite;
  }
}

.post-content {
  display: flex;
  flex-flow: column nowrap;

  align-items: center;

  width: 100%;

  padding-top: 4rem;

  > div {
    display: flex;
    flex-flow: column nowrap;

    align-items: center;

    gap: 1rem;
    padding: 3rem;

    max-width: 1000px;
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 0 5px 5px hsla(0, 0%, 0%, 0.14);

    background-color: var(--bg-secondary);

    > img {
      border-radius: 0.5rem;
    }
  }
}

.backbutton {
  font-style: bold;
  font-size: 1.2rem;
  text-decoration: none;
  color: antiquewhite;
  background-color: rgb(81, 65, 85);
  border-radius: 0.75rem;
  padding: 0.4rem;
  box-shadow: 0 0 5px 5px hsla(0, 0%, 0%, 0.14);
  margin-top: -1.5rem;

  > :active {
    color: antiquewhite;
  }
}

.tag {
  text-align: left;
}

.tag {
  text-decoration: none;
  font-style: bold;
  color: white;
  background: none;
  border: none;
}

.embedButton {
  border: solid;
  border-width: 1px;
  border-color: antiquewhite;
  border-radius: 0.75rem;
  text-decoration: none;
  color: antiquewhite;
  background: none;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  a:link,
  a:visited,
  a:active,
  a:hover {
    color: antiquewhite;
  }
  a:active {
    background: gray;
  }
  a:hover {
    background: gray;
  }
}

.timestamp {
  color: antiquewhite;
  /* white-space: nowrap; */
  margin: 0;
}

.filestats {
  color: gray;
  display: inline;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  margin: 0px;
  padding-left: 0.25rem;

  a:link,
  a:visited,
  a:active,
  a:hover {
    color: antiquewhite;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 12rem;
    position: aboslute;
    padding-left: 2.45rem;
    margin-top: -5px;
  }
  img {
    display: inline;
    position: absolute;
    margin-left: 1.15rem;
  }
  .source {
    padding-left: 1.15rem;
  }
}

embed {
  width: 100%;
  height: 50rem;
}

.filestatsbox {
  display: flex;
  flex-flow: column nowrap;

  width: 100%;

  padding-top: 4rem;

  > div {
    display: flex;
    flex-flow: column nowrap;

    align-items: center;

    gap: 1rem;
    padding: 2rem;
    padding-left: 0.5rem;

    max-width: 1000px;
    width: 100%;
    border-radius: 10px;
    /* box-shadow: 0 0 5px 5px hsla(0, 0%, 0%, 0.14); */

    background-color: var(--bg-secondary);

    > img {
      border-radius: 0.5rem;
    }
  }
}
</style>
