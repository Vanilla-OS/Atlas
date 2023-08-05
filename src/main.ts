import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
import yamlHighlight from "@/core/yaml-highlight";
import coreLoader from "@/core/loader";
import "./assets/css/index.css";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.directive("highlight-yaml", yamlHighlight);

app.use(router);
app.use(pinia);
app.use(coreLoader);

app.mount("#app");
