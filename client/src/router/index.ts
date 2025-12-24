import { createRouter, createWebHistory } from "vue-router";
import { loadSessionToken, getSessionToken, isNativePlatform } from "@/utils/sessionStorage";
import { API_BASE_URL } from "@/utils/apiConfig";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import PartnersView from "@/views/PartnersView.vue";
import PageNotFound from "@/views/PageNotFound.vue";

import DashboardView from "@/views/DashboardView.vue";
import ProfileView from "@/views/ProfileView.vue";
import ProfileSettingsView from "@/views/ProfileSettingsView.vue";
import ReferralView from "@/views/ReferralView.vue";

import LoginView from "@/views/LoginView.vue";
import SignupView from "@/views/SignupView.vue";

import WalletView from "@/views/WalletView.vue";
import CardDetailsView from "@/views/CardDetailsView.vue";
import ConvertView from "@/views/ConvertView.vue";
import TopupView from "@/views/TopupView.vue";
import PayView from "@/views/PayView.vue";
import PaysView from "@/views/PaysView.vue";
import WithdrawView from "@/views/WithdrawView.vue";

import ShopView from "@/views/ShopView.vue";
import ProductDetailView from "@/views/ProductDetailView.vue";
import CartView from "@/views/CartView.vue";
import CheckoutView from "@/views/CheckoutView.vue";
import OrdersView from "@/views/OrdersView.vue";

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
import AdminVerifications from "@/admin/views/AdminVerifications.vue";
import AdminReferrals from "@/admin/views/AdminReferrals.vue";
import AdminOrders from "@/admin/views/AdminOrders.vue";
import AdminCoupons from "@/admin/views/AdminCoupons.vue";

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
    {
      path: "/about",
      name: "about",
      component: AboutView,
      meta: { requiresAuth: false },
    },
    {
      path: "/partners",
      name: "partners",
      component: PartnersView,
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

    {
      path: "/referral",
      name: "referral",
      component: ReferralView,
    },

    // Wallet

    {
      path: "/wallet",
      name: "wallet",
      component: WalletView,
    },
    {
      path: "/wallet/:currency",
      name: "card-details",
      component: CardDetailsView,
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
    {
      path: "/shop/:id",
      name: "product-detail",
      component: ProductDetailView,
    },
    {
      path: "/cart",
      name: "cart",
      component: CartView,
    },
    {
      path: "/checkout",
      name: "checkout",
      component: CheckoutView,
    },
    {
      path: "/orders",
      name: "orders",
      component: OrdersView,
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
    {
      path: "/admin/referrals",
      name: "admin-referrals",
      component: AdminReferrals,
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/verifications",
      name: "admin-verifications",
      component: AdminVerifications,
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/orders",
      name: "admin-orders",
      component: AdminOrders,
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/coupons",
      name: "admin-coupons",
      component: AdminCoupons,
      meta: { requiresAdmin: true },
    },

    { path: "/:pathMatch(.*)*", name: "not-found", component: PageNotFound },
  ],
});

router.beforeEach(async (to, from, next) => {
  // Загружаем токен из Preferences (асинхронно)
  const token = await loadSessionToken();
  const publicPages = ['home', 'about', 'partners', 'login', 'signup', 'ref'];
  
  console.log('[Router] Checking route:', to.name, 'Token exists:', !!token);
  
  // Если есть токен и пользователь на публичной странице — проверяем сессию
  if (token && publicPages.includes(to.name as string)) {
    try {
      const baseUrl = isNativePlatform() ? API_BASE_URL : '';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (isNativePlatform()) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('[Router] Checking session at:', `${baseUrl}/api/auth/get-session`);
      
      const response = await fetch(`${baseUrl}/api/auth/get-session`, {
        credentials: 'include',
        headers,
      });
      const session = await response.json();
      
      console.log('[Router] Session response:', session?.user ? 'User found' : 'No user');
      
      if (session && session.user) {
        // Пользователь авторизован — перенаправляем на dashboard
        console.log('[Router] User authenticated, redirecting to dashboard');
        return next({ name: "dashboard" });
      }
    } catch (error) {
      console.error('[Router] Error checking session:', error);
    }
  }
  
  // Проверка для админских страниц
  if (to.meta.requiresAdmin) {
    try {
      const baseUrl = isNativePlatform() ? API_BASE_URL : '';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (isNativePlatform() && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${baseUrl}/api/auth/get-session`, {
        credentials: 'include',
        headers,
      });
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
  return next();
});

export default router;
