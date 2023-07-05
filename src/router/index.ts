// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "dashboard",
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "@/views/Dashboard.vue"),
      },

      {
        path: "/borrow",
        name: "borrow",
        component: () =>
          import(/* webpackChunkName: "borrow" */ "@/views/Borrow.vue"),
      },

      {
        path: "/lend",
        name: "lend",
        component: () =>
          import(/* webpackChunkName: "lend" */ "@/views/Lend.vue"),
      },

      {
        path: "/troves",
        name: "troves",
        component: () =>
          import(
            /* webpackChunkName: "troves" */ "@/views/Troves/Index.vue"
          ),
      },
      {
        path: "/oracles",
        name: "oracles",
        component: () =>
          import(/* webpackChunkName: "oracles" */ "@/views/Oracles.vue"),
      },
      {
        path: "/settings",
        name: "settings",
        component: () =>
          import(/* webpackChunkName: "settings" */ "@/views/Settings.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
