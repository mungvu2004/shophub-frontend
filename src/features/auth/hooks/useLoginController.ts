import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type FormEventHandler } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "@/components/ui/toast";
import { loginSchema, type LoginFormValues } from "@/lib/validators";
import { useAuthStore } from "@/stores/authStore";

import {
  CAPTCHA_THRESHOLD,
  getApiErrorDetail,
  LOCKOUT_SECONDS,
  LOCKOUT_THRESHOLD,
  REMEMBERED_EMAIL_KEY,
} from "@/features/auth/logic/loginSecurity";
import { authService, type SocialProvider } from "@/features/auth/services/auth.service";

export type LoginController = {
  form: ReturnType<typeof useForm<LoginFormValues>>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  mutationPending: boolean;
  showPassword: boolean;
  rememberMe: boolean;
  requiresCaptcha: boolean;
  captchaVerified: boolean;
  failedAttempts: number;
  attemptsBeforeLockout: number;
  isLocked: boolean;
  lockoutSeconds: number;
  onTogglePassword: () => void;
  onRememberMeChange: (checked: boolean) => void;
  onCaptchaChange: (checked: boolean) => void;
  onSocialLogin: (provider: SocialProvider) => void;
};

export function useLoginController(): LoginController {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const rememberedEmail =
    typeof window !== "undefined"
      ? window.localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? ""
      : "";

  const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ||
    "/dashboard/kpi-overview";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      email: rememberedEmail,
      password: "",
    },
  });

  const lockoutSeconds = useMemo(() => {
    if (!lockoutUntil) {
      return 0;
    }

    return Math.max(0, Math.ceil((lockoutUntil - currentTime) / 1000));
  }, [currentTime, lockoutUntil]);

  const isLocked = lockoutSeconds > 0;
  const requiresCaptcha = failedAttempts >= CAPTCHA_THRESHOLD;
  const attemptsBeforeLockout = Math.max(0, LOCKOUT_THRESHOLD - failedAttempts);

  useEffect(() => {
    if (!isLocked) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isLocked]);

  useEffect(() => {
    if (lockoutSeconds === 0 && lockoutUntil) {
      setLockoutUntil(null);
      setCaptchaVerified(false);
    }
  }, [lockoutSeconds, lockoutUntil]);

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (tokenResponse) => {
      setToken(tokenResponse.accessToken);
      const me = await authService.me();
      setUser(me);
      setFailedAttempts(0);
      setCaptchaVerified(false);
      setLockoutUntil(null);
      navigate(redirectTo, { replace: true });
    },
    onError: (error) => {
      setFailedAttempts((previous) => {
        const nextAttempts = previous + 1;

        if (nextAttempts >= LOCKOUT_THRESHOLD) {
          setLockoutUntil(Date.now() + LOCKOUT_SECONDS * 1000);
          setCurrentTime(Date.now());
        }

        return nextAttempts;
      });

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
      if (isLocked) {
        toast.warning(`Tài khoản đang tạm khóa. Vui lòng thử lại sau ${lockoutSeconds}s.`);
        return;
      }

      if (requiresCaptcha && !captchaVerified) {
        toast.warning("Vui lòng xác thực captcha trước khi tiếp tục.");
        return;
      }

      if (rememberMe) {
        window.localStorage.setItem(REMEMBERED_EMAIL_KEY, values.email);
      } else {
        window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      mutation.mutate(values);
    },
    onInvalid
  );

  const onSocialLogin = (provider: SocialProvider) => {
    const url = authService.getSocialLoginUrl(provider);

    if (!url) {
      toast.message(
        "Social OAuth chưa cấu hình URL. Bạn chỉ cần thêm VITE_SOCIAL_AUTH_BASE_URL để kích hoạt."
      );
      return;
    }

    window.location.assign(url);
  };

  return {
    form,
    onSubmit,
    mutationPending: mutation.isPending,
    showPassword,
    rememberMe,
    requiresCaptcha,
    captchaVerified,
    failedAttempts,
    attemptsBeforeLockout,
    isLocked,
    lockoutSeconds,
    onTogglePassword: () => setShowPassword((current) => !current),
    onRememberMeChange: setRememberMe,
    onCaptchaChange: setCaptchaVerified,
    onSocialLogin,
  };
}
