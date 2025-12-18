import { createRouter, createWebHistory } from "vue-router";

const HomeView = () => import("@/views/HomeView.vue");
const PageNotFound = () => import("@/views/PageNotFound.vue");

const DashboardView = () => import("@/views/DashboardView.vue");
const ProfileView = () => import("@/views/ProfileView.vue");
const ProfileSettingsView = () => import("@/views/ProfileSettingsView.vue");
const ReferralView = () => import("@/views/ReferralView.vue");

const LoginView = () => import("@/views/LoginView.vue");
const SignupView = () => import("@/views/SignupView.vue");

const WalletView = () => import("@/views/WalletView.vue");
const ConvertView = () => import("@/views/ConvertView.vue");
const TopupView = () => import("@/views/TopupView.vue");
const PayView = () => import("@/views/PayView.vue");
const PaysView = () => import("@/views/PaysView.vue");
const WithdrawView = () => import("@/views/WithdrawView.vue");

const ShopView = () => import("@/views/ShopView.vue");
const ProductDetailView = () => import("@/views/ProductDetailView.vue");

const CashbackView = () => import("@/views/CashbackView.vue");
const LearnView = () => import("@/views/LearnView.vue");
const MarketView = () => import("@/views/MarketView.vue");
const AustoreView = () => import("@/views/AustoreView.vue");
const WuletView = () => import("@/views/WuletView.vue");
const TourView = () => import("@/views/TourView.vue");
const BotsView = () => import("@/views/BotsView.vue");
const MobileView = () => import("@/views/MobileView.vue");
const AunitView = () => import("@/views/AunitView.vue");

const AdminDashboard = () => import("@/admin/views/AdminDashboard.vue");
const AdminUsers = () => import("@/admin/views/AdminUsers.vue");
const AdminProducts = () => import("@/admin/views/AdminProducts.vue");
const AdminProductEdit = () => import("@/admin/views/AdminProductEdit.vue");
const AdminCategories = () => import("@/admin/views/AdminCategories.vue");
const AdminAttributes = () => import("@/admin/views/AdminAttributes.vue");
const AdminTransactions = () => import("@/admin/views/AdminTransactions.vue");
const AdminWallets = () => import("@/admin/views/AdminWallets.vue");
const AdminNotifications = () => import("@/admin/views/AdminNotifications.vue");
const AdminReferrals = () => import("@/admin/views/AdminReferrals.vue");

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
