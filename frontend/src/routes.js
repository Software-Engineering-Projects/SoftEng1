// routes.js

import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

// User Top Nav bar pages
import {
  HomePage,
  MenuPage,
  FeaturedPage,
  ContactsPage,
} from "./containers/components/main/index";

import { Login } from "./containers/index";

// User Profile Pages
import {
  Profile,
  Orders,
  OrderHistory,
  Transactions,
  Cart,
} from "./containers/components/user-profile/index";

// Dashboard Pages
import {
  DashboardOrders,
  DashboardUsers,
  DashboardProducts,
  DashboardRestaurants,
  DashboardReports,
  DashboardSettings,
  DashboardAddProducts,
  DashboardAddRestaurants,
  DashboardAddUsers,
} from "./containers/components/dashboard/pages/index";

// Main Pages
import { MainDashboard } from "./containers/components/dashboard/index";
import { TopNavbar } from "./containers/components/main/index";


function MainPageRoutes() {
  return (
    <Routes>
      {/* TODO: 404 Page doesn't work properly */}
      {/* <Route path="/" element={<HomePage />} /> */}
      <Route path="/login" element={<Login />} />
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

function UserProfileRoutes() {
  return (
    <Routes>
      <Route path="/profile" element={<Profile />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/transactions" element={<Transactions />} />
    </Routes>
  );
}

function MainPageTopNavbarRoutes() {
  return (
    <Routes>
      <Route
        element={
          <>
            <TopNavbar />
            <Outlet />
          </>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="menu" element={<MenuPage />} />
        <Route path="featured" element={<FeaturedPage />} />
        <Route path="contacts" element={<ContactsPage />} />
      </Route>
    </Routes>
  );
}

// TODO: Add the outlet child routes for the dashboard routes
function AdminDashboardRoutes() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<MainDashboard />}>
        <Route path="orders" element={<DashboardOrders />} />
        <Route path="users" element={<DashboardUsers />} />
        <Route path="products" element={<DashboardProducts />} />
        <Route path="restaurants" element={<DashboardRestaurants />} />
        <Route path="reports" element={<DashboardReports />} />
        <Route path="settings" element={<DashboardSettings />} />
      </Route>
    </Routes>
  );
}

// TODO: Add the outlet child routes for the dashboard routes
function AdminDashboardAddRoutes() {
  return (
    <Routes>
      <Route
        path="/dashboard/products/add"
        element={<DashboardAddProducts />}
      />
      <Route
        path="/dashboard/restaurants/add"
        element={<DashboardAddRestaurants />}
      />
      <Route path="/dashboard/users/add" element={<DashboardAddUsers />} />
    </Routes>
  );
}

// Export your route components

export {
  MainPageRoutes,
  UserProfileRoutes,
  MainPageTopNavbarRoutes,
  AdminDashboardRoutes,
  AdminDashboardAddRoutes,
};

export default function AllRoutes() {
  return (
    <>
      <MainPageRoutes />
      <UserProfileRoutes />
      <MainPageTopNavbarRoutes />
      <AdminDashboardRoutes />
      <AdminDashboardAddRoutes />
    </>
  );
}
