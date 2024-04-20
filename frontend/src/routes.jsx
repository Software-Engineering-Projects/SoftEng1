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
// import { Checkout } from "./containers/components/user-profile/user/pages/Checkout.jsx";

function MainPageRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

function UserProfileRoutes() {
  return (
    <Routes>
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/orders" element={<Orders />} />
      <Route path="/profile/order-history" element={<OrderHistory />} />
      <Route path="/profile/transactions" element={<Transactions />} />
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
        <Route path="featured" element={<AboutPage />} />
        <Route path="contacts" element={<ContactsPage />} />
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

