type ApiErrorShape = {
  status?: number;
  detail?: string;
  details?: unknown;
  message?: string;
};

export const REMEMBERED_EMAIL_KEY = "shophub.rememberedEmail";
export const CAPTCHA_THRESHOLD = 3;
export const LOCKOUT_THRESHOLD = 5;
export const LOCKOUT_SECONDS = 30;

const mapAuthErrorMessage = (input: string) => {
  if (/email\s+hoac\s+mat\s+khau\s+khong\s+dung/i.test(input)) {
    return "Email hoặc mật khẩu không đúng";
  }

  return input;
};

export const getApiErrorDetail = (error: unknown) => {
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
