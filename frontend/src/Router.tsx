import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MenuPage } from "./pages/MenuPage";
import { SubscriptionPage } from "./pages/SubscriptionPage";
import { ContactPage } from "./pages/ContactPage";
import { Layout } from "./components/Layout";
import { UserDashboard } from "./pages/UserDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { TestimonialsPage } from "./pages/TestimonialsPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export function Router() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
