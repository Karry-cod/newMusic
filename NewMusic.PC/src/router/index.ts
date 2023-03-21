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
        }, {
          path: "artist/:aid",
          name: "artist",
          component: () => import("@/views/pages/artistDetail.vue")
        }, {
          path: "album/:aid",
          name: "album",
          component: () => import("@/views/pages/albumDetail.vue")
        }, {
          path: "mv/:mid",
          name: "mv",
          component: () => import("@/views/pages/mvDetail.vue")
        }, {
          path: "user/:uid",
          name: "user",
          component: () => import("@/views/pages/userDetail.vue")
        }, {
          path: "userEvent/:uid",
          name: "event",
          component: () => import("@/views/pages/user/event.vue")
        }, {
          path: "userFollow/:uid",
          name: "follow",
          component: () => import("@/views/pages/user/follows.vue")
        }, {
          path: "userFollowers/:uid",
          name: "follower",
          component: () => import("@/views/pages/user/follows.vue")
        }
      ]
    }
  ]
})

export default router
