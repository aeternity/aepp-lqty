import { createRouter, createWebHistory } from "vue-router";

import DefaultLayout from "@/layouts/default/Default.vue";

import Dashboard from "@/views/Dashboard.vue";

import Borrow from "@/views/Borrow.vue";
import Invest from "@/views/Invest.vue";
import StabilityPool from "@/views/StabilityPool.vue";
import Troves from "@/views/Troves/Index.vue";
import Markets from "@/views/Markets.vue";
import Settings from "@/views/Settings.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "dashboard",
        component: Dashboard,
      },

      {
        path: "/borrow",
        name: "borrow",
        component: Borrow,
      },

      {
        path: "/invest",
        name: "invest",
        component: Invest,
      },
      {
        path: "/stability-pool",
        name: "stability-pool",
        component: StabilityPool,
      },

      {
        path: "/troves",
        name: "troves",
        component: Troves,
      },
      {
        path: "/markets",
        name: "markets",
        component: Markets,
      },
      {
        path: "/settings",
        name: "settings",
        component: Settings,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
