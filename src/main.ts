import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import yamlHighlight from '@/core//yaml-highlight';
import { createPinia } from 'pinia';

import "./assets/css/index.css";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.directive('highlight-yaml', yamlHighlight);

app.mount("#app");
