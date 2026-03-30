import { Loader2 } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";

type RequireAuthResult = {
  isAuthenticated: boolean;
  isLoading: boolean;
  from: ReturnType<typeof useLocation>;
};

export function useRequireAuth(): RequireAuthResult {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const from = useLocation();

  return {
    isAuthenticated,
    isLoading,
    from,
  };
}

function FullPageAuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="size-7 animate-spin" />
        <p className="text-sm font-medium">Đang kiểm tra phiên đăng nhập...</p>
      </div>
    </div>
  );
}

export { FullPageAuthLoading };

export function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading) {
    return <FullPageAuthLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
