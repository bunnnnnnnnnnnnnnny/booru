import './assets/reset.css';
import './assets/main.css';

import { createHead } from '@unhead/vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);
const head = createHead();

app.use(createPinia());
app.use(router);
app.use(head);

app.mount('#app');
