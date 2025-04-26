import type { Post } from '@/lib/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSearchResults = defineStore('searchResults', () => {
  const previousQuery = null as string | null;
  const query = ref('');
  const results = ref<Post[]>([]);

  return {
    previousQuery,
    query,
    results,
  };
});
