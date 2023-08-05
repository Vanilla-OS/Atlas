import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RecipeView from "../views/RecipeView.vue";
import AtlasConfig from "@/config";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/recipe/:id",
      name: "recipe",
      component: RecipeView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const suffix = AtlasConfig.title ? ` ${AtlasConfig.title}` : "";
  document.title = to.meta.title ? to.meta.title + suffix : suffix;
  next();
});

export default router;
