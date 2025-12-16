import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue"; // landing page
import PageNotFound from "@/views/PageNotFound.vue"; // 404 page

import DashboardView from "@/views/DashboardView.vue";
import ProfileView from "@/views/ProfileView.vue";
import ProfileSettingsView from "@/views/ProfileSettingsView.vue";

//auth
import LoginView from "@/views/LoginView.vue";
import SignupView from "@/views/SignupView.vue";

// Wallet
import WalletView from "@/views/WalletView.vue";
import ConvertView from "@/views/ConvertView.vue";
import TopupView from "@/views/TopupView.vue";
import PayView from "@/views/PayView.vue";
import PaysView from "@/views/PaysView.vue";
import WithdrawView from "@/views/WithdrawView.vue";

// Shop
import ShopView from "@/views/ShopView.vue";

// Projects
import CashbackView from "@/views/CashbackView.vue";
import LearnView from "@/views/LearnView.vue";
import MarketView from "@/views/MarketView.vue";
import AustoreView from "@/views/AustoreView.vue";
import WuletView from "@/views/WuletView.vue";
import TourView from "@/views/TourView.vue";
import BotsView from "@/views/BotsView.vue";
import MobileView from "@/views/MobileView.vue";
import AunitView from "@/views/AunitView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // auth
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: "/signup",
      name: "signup",
      component: SignupView,
      meta: { requiresAuth: false },
    },
    {
      path: "/ref/:refCode",
      name: "ref",
      component: SignupView,
      meta: { requiresAuth: false },
    },

    // public landing page
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: false },
    },

    // private dashboard
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
    },

    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
    {
      path: "/profile-settings",
      name: "profile-settings",
      component: ProfileSettingsView,
    },

    // Wallet

    {
      path: "/wallet",
      name: "wallet",
      component: WalletView,
    },
    {
      path: "/convert",
      name: "convert",
      component: ConvertView,
    },
    {
      path: "/topup",
      name: "topup",
      component: TopupView,
    },
    {
      path: "/withdraw",
      name: "withdraw",
      component: WithdrawView,
    },
    {
      path: "/pay",
      name: "pay",
      component: PayView,
    },
    {
      path: "/pays",
      name: "pays",
      component: PaysView,
    },

    // Shop
    {
      path: "/shop",
      name: "shop",
      component: ShopView,
    },

    // Projects
    {
      path: "/cashback",
      name: "cashback",
      component: CashbackView,
    },
    {
      path: "/learn",
      name: "learn",
      component: LearnView,
    },
    {
      path: "/market",
      name: "market",
      component: MarketView,
    },
    {
      path: "/austore",
      name: "austore",
      component: AustoreView,
    },
    {
      path: "/wulet",
      name: "wulet",
      component: WuletView,
    },
    {
      path: "/tour",
      name: "tour",
      component: TourView,
    },
    {
      path: "/bots",
      name: "bots",
      component: BotsView,
    },
    {
      path: "/mobile",
      name: "mobile",
      component: MobileView,
    },
    {
      path: "/aunit",
      name: "aunit",
      component: AunitView,
    },
    { path: "/:pathMatch(.*)*", name: "not-found", component: PageNotFound },
  ],
});

export default router;
