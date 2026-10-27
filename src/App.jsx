import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import ShopCatalog from './pages/ShopCatalog';
import ProductDetail from './pages/ProductDetail';
import CartCheckout from './pages/CartCheckout';
import AdminInventory from './pages/AdminInventory';
import StaffPacking from './pages/StaffPacking';
import Dashboard from './components/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Customers from './pages/Customers';

function AppRoutes() {
  return (
    <Routes>
      {/* 1. Fullscreen Standalone Route (NO Sidebar / NO Topbar) */}
      <Route path="/login" element={<Login />} />

      {/* 2. Main Application Routes (Wrapped in Layout Shell) */}
      <Route path="/" element={<Layout />}>
        {/* Public Application Routes */}
        <Route index element={<ShopCatalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<CartCheckout />} />
        <Route path="settings" element={<Settings />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="staff/packing" element={<StaffPacking />} />
          <Route path="customers" element={<Customers />} />
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/inventory" element={<AdminInventory />} />
          <Route path="admin/users" element={<Users />} />
        </Route>
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
   
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
   
  );
}