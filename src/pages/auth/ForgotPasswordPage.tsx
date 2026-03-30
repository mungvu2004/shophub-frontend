import { Navigate, useLocation } from "react-router-dom";

import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { FullPageAuthLoading, useRequireAuth } from "@/features/auth/components/ProtectedRoute";

export function ForgotPasswordPage() {
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
    <AuthSplitLayout
      title="Quên mật khẩu"
      subtitle="Đừng lo, chúng tôi sẽ giúp bạn lấy lại quyền truy cập"
    >
      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}
