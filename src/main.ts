import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
import highlight from "@/core/highlight";
import coreLoader from "@/core/loader";
import "./assets/css/index.css";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.directive("highlight", highlight);

app.use(router);
app.use(pinia);
app.use(coreLoader);

app.mount("#app");
