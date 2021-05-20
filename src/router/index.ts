import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/test',
    name: 'Test',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Test.vue')
  }, {
    path: '/search',
    name: 'search',
    component: () => import('../views/Search.vue')
  }, {
    path: '/searchresult/:keyword',
    name: 'searchresult',
    component: () => import('../views/SearchResult.vue')
  }, {
    path: '/playerfullscreen',
    name: 'playerfullscreen',
    component: () => import('../views/PlayerFullScreen.vue')
  }, {
    path: '/setting',
    name: 'setting',
    component: () => import('../views/Setting.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
