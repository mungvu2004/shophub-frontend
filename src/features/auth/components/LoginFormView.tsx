import { Eye, EyeOff, Globe, Lock, Mail, MessageCircle } from "lucide-react";
import type { ComponentType } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { LoginController } from "@/features/auth/hooks/useLoginController";

type SocialButtonItem = {
  provider: "google" | "facebook";
  label: string;
  className: string;
  icon: ComponentType<{ className?: string }>;
};

const socialButtons: SocialButtonItem[] = [
  {
    provider: "google",
    label: "Google",
    className: "border-[#d7d9f7] text-[#29307f] hover:bg-[#f2f3ff]",
    icon: Globe,
  },
  {
    provider: "facebook",
    label: "Facebook",
    className: "border-[#c9dcff] text-[#194d9a] hover:bg-[#eff6ff]",
    icon: MessageCircle,
  },
];

export function LoginFormView({
  form,
  onSubmit,
  mutationPending,
  showPassword,
  rememberMe,
  requiresCaptcha,
  captchaVerified,
  failedAttempts,
  attemptsBeforeLockout,
  isLocked,
  lockoutSeconds,
  onTogglePassword,
  onRememberMeChange,
  onCaptchaChange,
  onSocialLogin,
}: LoginController) {
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
                      className="h-11 rounded-xl border-slate-200 bg-indigo-50/60 pl-10 text-[15px]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
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
                      className="h-11 rounded-xl border-slate-200 bg-indigo-50/60 px-10 text-[15px]"
                    />
                    <button
                      type="button"
                      onClick={onTogglePassword}
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {failedAttempts > 0 && !isLocked ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            Bạn đã đăng nhập sai {failedAttempts} lần. Còn {attemptsBeforeLockout} lần trước khi bị khóa tạm thời.
          </div>
        ) : null}

        {isLocked ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
            Tài khoản tạm khóa do đăng nhập sai nhiều lần. Vui lòng thử lại sau {lockoutSeconds}s.
          </div>
        ) : null}

        {requiresCaptcha ? (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/80 p-3">
            <p className="text-sm font-semibold text-indigo-900">Xác thực bảo mật</p>
            <label className="mt-2 inline-flex items-center gap-2 text-sm text-indigo-800">
              <input
                type="checkbox"
                checked={captchaVerified}
                onChange={(event) => onCaptchaChange(event.target.checked)}
                className="size-4 rounded border-indigo-300"
              />
              Tôi không phải robot (Captcha UI placeholder)
            </label>
            <p className="mt-2 text-xs text-indigo-700/90">
              Khi backend sẵn sàng, phần này chỉ cần thay sang reCAPTCHA bằng API key.
            </p>
          </div>
        ) : null}

        <div className="flex items-center justify-between text-[13px]">
          <label className="inline-flex items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => onRememberMeChange(event.target.checked)}
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
          disabled={mutationPending || isLocked}
          className="h-11 rounded-xl bg-indigo-700 text-[15px] font-semibold text-white shadow-[0px_12px_22px_-12px_rgba(67,56,202,0.62)] hover:bg-indigo-600"
        >
          {mutationPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>

        <div className="flex items-center gap-4 py-1">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium text-slate-400">hoặc tiếp tục với</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {socialButtons.map((item) => {
            const Icon = item.icon;

            return (
              <Button
                key={item.provider}
                type="button"
                variant="outline"
                className={`h-11 rounded-xl text-sm font-semibold ${item.className}`}
                onClick={() => onSocialLogin(item.provider)}
              >
                <Icon className="mr-2 size-4" />
                {item.label}
              </Button>
            );
          })}
        </div>

        <p className="pt-1 text-center text-xs text-slate-500">
          Cần hỗ trợ? <span className="font-semibold text-indigo-600">Liên hệ Admin</span>
        </p>
      </form>
    </Form>
  );
}
