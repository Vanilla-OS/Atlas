import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import yamlHighlight from '@/core//yaml-highlight'; 

import "./assets/css/index.css";

const app = createApp(App);

app.use(router);
app.directive('highlight-yaml', yamlHighlight);

app.mount("#app");
