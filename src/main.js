import { createApp } from 'vue';
import App from '@/App.vue';
import '@/utils/styles/reset.less';
import '@/utils/styles/tailwindcssBase.css';

const app = createApp(App);

import router from '@/router/index.js';
app.use(router);

import store from '@/store';
app.use(store);

import components from '@/components/index.js';
app.use(components);

import vueConfig from '@/utils/vue/index.js';
app.use(vueConfig);

import '@/utils/styles/tailwindcss.css';
import '@/utils/styles/vant.less';
import 'animate.css';


app.mount('#app');
