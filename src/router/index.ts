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
        path: "/invest",
        name: "invest",
        component: () =>
          import(/* webpackChunkName: "stake" */ "@/views/Invest.vue"),
      },
      {
        path: "/stability-pool",
        name: "stability-pool",
        component: () =>
          import(/* webpackChunkName: "stability-pool" */ "@/views/StabilityPool.vue"),
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
        path: "/markets",
        name: "markets",
        component: () =>
          import(/* webpackChunkName: "markets" */ "@/views/Markets.vue"),
      },
      {
        path: "/settings",
        name: "settings",
        component: () =>
          import(/* webpackChunkName: "settings" */ "@/views/Settings.vue"),
      },
      {
        path: "/test",
        name: "test",
        component: () =>
          import(/* webpackChunkName: "test" */ "@/views/Test.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
