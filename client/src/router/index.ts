import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import PageNotFound from "@/views/PageNotFound.vue";

import DashboardView from "@/views/DashboardView.vue";
import ProfileView from "@/views/ProfileView.vue";
import ProfileSettingsView from "@/views/ProfileSettingsView.vue";

import LoginView from "@/views/LoginView.vue";
import SignupView from "@/views/SignupView.vue";

import WalletView from "@/views/WalletView.vue";
import ConvertView from "@/views/ConvertView.vue";
import TopupView from "@/views/TopupView.vue";
import PayView from "@/views/PayView.vue";
import PaysView from "@/views/PaysView.vue";
import WithdrawView from "@/views/WithdrawView.vue";

import ShopView from "@/views/ShopView.vue";

import CashbackView from "@/views/CashbackView.vue";
import LearnView from "@/views/LearnView.vue";
import MarketView from "@/views/MarketView.vue";
import AustoreView from "@/views/AustoreView.vue";
import WuletView from "@/views/WuletView.vue";
import TourView from "@/views/TourView.vue";
import BotsView from "@/views/BotsView.vue";
import MobileView from "@/views/MobileView.vue";
import AunitView from "@/views/AunitView.vue";

import AdminDashboard from "@/admin/views/AdminDashboard.vue";
import AdminUsers from "@/admin/views/AdminUsers.vue";
import AdminProducts from "@/admin/views/AdminProducts.vue";
import AdminProductEdit from "@/admin/views/AdminProductEdit.vue";
import AdminCategories from "@/admin/views/AdminCategories.vue";
import AdminAttributes from "@/admin/views/AdminAttributes.vue";
import AdminTransactions from "@/admin/views/AdminTransactions.vue";
import AdminWallets from "@/admin/views/AdminWallets.vue";
import AdminNotifications from "@/admin/views/AdminNotifications.vue";

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
    // Admin
    {
      path: "/admin",
      name: "admin-dashboard",
      component: AdminDashboard,
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/users",
      name: "admin-users",
      component: AdminUsers,
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/products",
      name: "admin-products",
      component: AdminProducts,
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/products/new",
      name: "admin-product-new",
      component: AdminProductEdit,
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/products/:id",
      name: "admin-product-edit",
      component: AdminProductEdit,
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/categories",
      name: "admin-categories",
      component: AdminCategories,
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/attributes",
      name: "admin-attributes",
      component: AdminAttributes,
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/transactions",
      name: "admin-transactions",
      component: AdminTransactions,
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/wallets",
      name: "admin-wallets",
      component: AdminWallets,
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/notifications",
      name: "admin-notifications",
      component: AdminNotifications,
      meta: { requiresAdmin: true },
    },

    { path: "/:pathMatch(.*)*", name: "not-found", component: PageNotFound },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAdmin) {
    try {
      const response = await fetch("/api/auth/get-session");
      const session = await response.json();
      
      if (!session || !session.user) {
        return next({ name: "login" });
      }
      
      if (session.user.role !== "admin") {
        return next({ name: "dashboard" });
      }
    } catch (error) {
      return next({ name: "login" });
    }
  }
  next();
});

export default router;
