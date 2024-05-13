// routes.js

import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

// User Top Nav bar pages
import {
  HomePage,
  MenuPage,
  AboutPage,
  ContactsPage,
} from "./pages/main/navbar/navbar-pages-index.js";

import { LoginPage } from "./auth/auth-index.js";

// User Profile Pages
import {
  Profile,
  Orders,
  OrderHistory,
  Transactions,
  Checkout
} from "./pages/user-profile/user-profile-index.js";

// Dashboard Pages
import {
  DashboardOrders,
  DashboardUsers,
  DashboardProducts,
  DashboardRestaurants,
  DashboardReports,
  DashboardSettings,
  DashboardAddRestaurants,
  DashboardAddUsers,
  DashboardAddProducts
} from "./pages/dashboard/dashboard-pages-index.js";

// Main Pages
import { MainDashboard } from "./pages/dashboard/dashboard-pages-index.js";
import { TopNavbar } from "@/global-components/main/navbar/TopNavbar.jsx";
import { Footer } from "@/global-components/main/main-pages/Footer.jsx";
import { MenuItemProductPage } from "./pages/main/navbar/navbar-pages-index.js";
import { CheckoutSuccess } from "./pages/checkout/checkout-status/CheckoutSuccess.jsx";
import { CheckoutCancel } from "./pages/checkout/checkout-status/CheckoutCancel.jsx";
import { CashOnDelivery } from "./pages/checkout/checkout-type/CashOnDelivery.jsx";

function MainPageRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
// TODO: Later create this better
function UserProfileRoutes() {
  return (
    <Routes>
      {/* These should use dynamic routes based on the uid*/}

    </Routes>
  );
}

function MainPageTopNavbarRoutes() {
  return (
    <Routes>
      <Route path="/" element={<><TopNavbar /><Outlet /></>}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="menu/:id" element={<MenuItemProductPage />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="checkout/success" element={<CheckoutSuccess />} />
        <Route path="checkout/cancel" element={<CheckoutCancel />} />
        <Route path="/checkout/cash-on-delivery" element={<CashOnDelivery />} />
        <Route path="about-us" element={<AboutPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        {/* NOTE: User Profile Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/orders" element={<Orders />} />
        <Route path="/profile/order-history" element={<OrderHistory />} />
        <Route path="/profile/transactions" element={<Transactions />} />
      </Route>
    </Routes>
  );
}

function AdminDashboardRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<><MainDashboard /></>}>
        {/* <Route index element={<MainDashboard />} /> */}
        <Route path="orders" element={<DashboardOrders />} />
        <Route path="users" element={<DashboardUsers />} />
        <Route path="products" element={<DashboardProducts />} />
        <Route path="restaurants" element={<DashboardRestaurants />} />
        <Route path="reports" element={<DashboardReports />} />
        <Route path="settings" element={<DashboardSettings />} />
        <Route path="products/add" element={<DashboardAddProducts />} />
        <Route path="restaurants/add" element={<DashboardAddRestaurants />} />
        <Route path="users/add" element={<DashboardAddUsers />} />
      </Route>
    </Routes>
  );
}

export {
  MainPageRoutes,
  UserProfileRoutes,
  MainPageTopNavbarRoutes,
  AdminDashboardRoutes,
};

export default function AllRoutes() {
  return (
    <>
      <MainPageRoutes />
      <UserProfileRoutes />
      <MainPageTopNavbarRoutes />
      <AdminDashboardRoutes />
    </>
  );
}