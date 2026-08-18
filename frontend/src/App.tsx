import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { CartDrawer } from './components/cart/CartDrawer';
import { ComparisonDrawer } from './components/product/ComparisonDrawer';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { ProteinCalculatorPage } from './pages/ProteinCalculatorPage';
import { FitnessCalculatorPage } from './pages/FitnessCalculatorPage';
import { DailyProteinTrackerPage } from './pages/DailyProteinTrackerPage';
import { SupplementStackPage } from './pages/SupplementStackPage';
import { DailyPlanPage } from './pages/DailyPlanPage';
import { VerifyPage } from './pages/VerifyPage';
import { ComparePage } from './pages/ComparePage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

// Admin Pages
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminInventoryPage } from './pages/AdminInventoryPage';
import { AdminCouponsPage } from './pages/AdminCouponsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected Route Wrapper for Authenticated Users
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// Admin Guard Wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <BrowserRouter>
                  <ScrollToTop />
                  <div className="flex flex-col min-h-screen bg-white dark:bg-[#070a0f] text-gray-900 dark:text-gray-100 transition-colors">
                    <Navbar />
                    <main className="flex-grow">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ShopPage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/order-success/:id" element={<OrderSuccessPage />} />
                        <Route path="/orders/:id" element={<OrderTrackingPage />} />
                        <Route path="/track" element={<OrderTrackingPage />} />
                        <Route path="/track-order" element={<OrderTrackingPage />} />
                        <Route path="/orders" element={<Navigate to="/my-orders" replace />} />
                        <Route
                          path="/my-orders"
                          element={
                            <ProtectedRoute>
                              <MyOrdersPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/protein-calculator" element={<ProteinCalculatorPage />} />
                        <Route path="/calculator" element={<ProteinCalculatorPage />} />
                        <Route path="/fitness-calculator" element={<FitnessCalculatorPage />} />
                        <Route path="/protein-tracker" element={<DailyProteinTrackerPage />} />
                        <Route path="/daily-tracker" element={<DailyProteinTrackerPage />} />
                        <Route path="/tracker" element={<DailyProteinTrackerPage />} />
                        <Route path="/supplement-stack" element={<SupplementStackPage />} />
                        <Route path="/stack-builder" element={<SupplementStackPage />} />
                        <Route path="/daily-plan" element={<DailyPlanPage />} />
                        <Route path="/verify" element={<VerifyPage />} />
                        <Route path="/compare" element={<ComparePage />} />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <ProfilePage />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                        {/* Admin Routes */}
                        <Route
                          path="/admin"
                          element={
                            <AdminRoute>
                              <AdminDashboardPage />
                            </AdminRoute>
                          }
                        />
                        <Route
                          path="/admin/products"
                          element={
                            <AdminRoute>
                              <AdminProductsPage />
                            </AdminRoute>
                          }
                        />
                        <Route
                          path="/admin/orders"
                          element={
                            <AdminRoute>
                              <AdminOrdersPage />
                            </AdminRoute>
                          }
                        />
                        <Route
                          path="/admin/inventory"
                          element={
                            <AdminRoute>
                              <AdminInventoryPage />
                            </AdminRoute>
                          }
                        />
                        <Route
                          path="/admin/coupons"
                          element={
                            <AdminRoute>
                              <AdminCouponsPage />
                            </AdminRoute>
                          }
                        />

                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </main>
                    <Footer />

                    {/* Global Floating Components */}
                    <CartDrawer />
                    <ComparisonDrawer />
                  </div>
                </BrowserRouter>
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
