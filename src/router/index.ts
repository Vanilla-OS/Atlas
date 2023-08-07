import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RecipeView from "../views/RecipeView.vue";
import AtlasConfig from "@/config";

const router = createRouter({
  history: createWebHashHistory(),
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
    {
      path: "/recipe/:id/module/:module",
      name: "recipe-module",
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
