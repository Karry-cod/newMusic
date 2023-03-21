import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/index.vue'),
      children: [
        {
          path: "",
          name: "main",
          component: () => import("@/views/pages/main.vue")
        }, {
          path: "musicSheet/:msid",
          name: "musicSheet",
          component: () => import("@/views/pages/musicSheet.vue")
        }
      ]
    }
  ]
})

export default router
