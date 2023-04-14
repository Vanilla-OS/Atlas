import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ImageView from '../views/ImageView.vue'
import AtlasConfig from '@/config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/image/:image/tag/:tag',
      name: 'Image',
      component: ImageView
    }
  ]
})

router.beforeEach((to, from, next) => {
  const suffix = AtlasConfig.title ? ` ${AtlasConfig.title}` : '';
  document.title = to.meta.title ? to.meta.title + suffix : suffix;
  next();
});

export default router
