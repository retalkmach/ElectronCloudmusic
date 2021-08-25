import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/fm',
        name: 'FM',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Personalfm.vue'),
    }, {
        path: '/search',
        name: 'search',
        component: () => import('../views/Search.vue'),
    }, {
        path: '/searchresult/:keyword',
        name: 'searchresult',
        component: () => import('../views/SearchResult.vue'),
    }, {
        path: '/playerfullscreen',
        name: 'playerfullscreen',
        component: () => import('../views/PlayerFullScreen.vue'),
    }, {
        path: '/setting',
        name: 'setting',
        component: () => import('../views/Setting.vue'),
    }, {
        path: '/artist/:artistID',
        name: 'artist',
        component: () => import('../views/Artist.vue'),
    }, {
        path: '/album/:albumID',
        name: 'album',
        component: () => import('../views/Album.vue'),
    }, {
        path: '/user',
        name: 'user',
        component: () => import('../views/User.vue'),
    }, {
        path: '/playlist/:playlistID',
        name: 'playlist',
        component: () => import('../views/Playlist.vue'),
    },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
export default router;
//# sourceMappingURL=index.js.map