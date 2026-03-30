import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormValues } from "@/lib/validators";
import { apiClient } from "@/services/apiClient";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/components/ui/toast";
import type { ApiResponse } from "@/types/api.types";
import type { TokenResponse, User } from "@/types/auth.types";

type ApiErrorShape = {
  status?: number;
  detail?: string;
  details?: unknown;
  message?: string;
};

const REMEMBERED_EMAIL_KEY = "shophub.rememberedEmail";

const authService = {
  async login(payload: LoginFormValues) {
    const response = await apiClient.post<TokenResponse>("/auth/login", payload);
    return response.data;
  },
  async me() {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me");
    return response.data.data;
  },
};

const mapAuthErrorMessage = (input: string) => {
  if (/email\s+hoac\s+mat\s+khau\s+khong\s+dung/i.test(input)) {
    return "Email hoặc mật khẩu không đúng";
  }

  return input;
};

const getApiErrorDetail = (error: unknown) => {
  const fallback = "Email hoặc mật khẩu không đúng";

  if (!error || typeof error !== "object") {
    return fallback;
  }

  const apiError = error as ApiErrorShape;

  if (typeof apiError.detail === "string" && apiError.detail.trim().length > 0) {
    return mapAuthErrorMessage(apiError.detail);
  }

  if (typeof apiError.message === "string" && apiError.message.trim().length > 0) {
    return mapAuthErrorMessage(apiError.message);
  }

  if (typeof apiError.details === "string" && apiError.details.trim().length > 0) {
    return mapAuthErrorMessage(apiError.details);
  }

  return fallback;
};

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const rememberedEmail =
    typeof window !== "undefined"
      ? window.localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? ""
      : "";
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));

  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ||
    "/dashboard";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      email: rememberedEmail,
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (tokenResponse) => {
      setToken(tokenResponse.accessToken);
      const me = await authService.me();
      setUser(me);
      navigate(redirectTo, { replace: true });
    },
    onError: (error) => {
      toast.error(getApiErrorDetail(error));
    },
  });

  const onInvalid = (errors: FieldErrors<LoginFormValues>) => {
    const message =
      errors.email?.message ||
      errors.password?.message ||
      "Vui lòng kiểm tra lại thông tin đăng nhập.";

    toast.warning(String(message));
  };

  const onSubmit = form.handleSubmit(
    (values) => {
      if (rememberMe) {
        window.localStorage.setItem(REMEMBERED_EMAIL_KEY, values.email);
      } else {
        window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      mutation.mutate(values);
    },
    onInvalid
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-5" noValidate>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-slate-700">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      {...field}
                      autoFocus
                      type="email"
                      placeholder="seller@shophub.vn"
                      className="h-11 rounded-lg border-slate-200 bg-indigo-50/70 pl-10 text-[15px]"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-slate-700">Mật khẩu</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-11 rounded-lg border-slate-200 bg-indigo-50/70 px-10 text-[15px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between text-[13px]">
          <label className="inline-flex items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="size-4 rounded border-slate-300"
            />
            Ghi nhớ đăng nhập
          </label>
          <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="h-11 rounded-lg bg-indigo-600 text-[15px] font-semibold text-white shadow-[0px_10px_20px_-10px_rgba(79,70,229,0.6)] hover:bg-indigo-500"
        >
          {mutation.isPending ? "Đang đăng nhập…" : "Đăng nhập"}
        </Button>

        <div className="flex items-center gap-4 py-1">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium text-slate-400">hoặc</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-lg border-slate-200 text-sm font-semibold text-slate-700"
        >
          Đăng nhập bằng Google
        </Button>

        <p className="pt-1 text-center text-xs text-slate-500">
          Cần hỗ trợ? <span className="font-semibold text-indigo-600">Liên hệ Admin</span>
        </p>
      </form>
    </Form>
  );
}
