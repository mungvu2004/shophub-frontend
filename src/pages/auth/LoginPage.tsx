import { Navigate, useLocation } from "react-router-dom";

import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { FullPageAuthLoading, useRequireAuth } from "@/features/auth/components/ProtectedRoute";

export function LoginPage() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useRequireAuth();

  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ||
    "/dashboard";

  if (isLoading) {
    return <FullPageAuthLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <AuthSplitLayout title="Đăng nhập" subtitle="Chào mừng trở lại 👋">
      <LoginForm />
    </AuthSplitLayout>
  );
}
