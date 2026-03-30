import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Mail } from "lucide-react";
import { useForm, type FieldErrors } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

async function requestPasswordReset(_payload: ForgotPasswordValues) {
  await new Promise((resolve) => setTimeout(resolve, 700));
}

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => {
      toast.success("Đã gửi hướng dẫn đặt lại mật khẩu vào email của bạn.");
      form.reset();
    },
    onError: () => {
      toast.error("Không thể gửi yêu cầu lúc này. Vui lòng thử lại.");
    },
  });

  const onInvalid = (errors: FieldErrors<ForgotPasswordValues>) => {
    const message = errors.email?.message || "Vui lòng nhập email hợp lệ.";

    toast.warning(String(message));
  };

  const onSubmit = form.handleSubmit(
    (values) => {
      mutation.mutate(values);
    },
    onInvalid
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-5" noValidate>
        <p className="text-center text-sm text-slate-500">
          Nhập email tài khoản, ShopHub sẽ gửi hướng dẫn đặt lại mật khẩu.
        </p>

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

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="h-11 rounded-lg bg-indigo-600 text-[15px] font-semibold text-white shadow-[0px_10px_20px_-10px_rgba(79,70,229,0.6)] hover:bg-indigo-500"
        >
          {mutation.isPending ? "Đang gửi..." : "Gửi hướng dẫn"}
        </Button>

        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="size-4" />
          Quay lại đăng nhập
        </Link>
      </form>
    </Form>
  );
}
