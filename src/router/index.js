import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Kedai Tivera - Katalog Menu' },
    },
    {
      path: '/product/:slug',
      name: 'product-detail',
      component: () => import('@/views/ProductDetailView.vue'),
      meta: { title: 'Detail Menu - Kedai Tivera' },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue'),
      meta: { title: 'Favorit - Kedai Tivera' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
      meta: { title: 'Keranjang - Kedai Tivera' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { title: 'Profil - Kedai Tivera' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, top: 96, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = to.meta.title ?? 'Kedai Tivera'
})

export default router
