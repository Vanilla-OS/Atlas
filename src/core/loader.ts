import type { App } from "vue";
import AtlasManager from "@/core/manager";

export default {
    install(app: App) {
        app.use(AtlasManager)
    },
};
