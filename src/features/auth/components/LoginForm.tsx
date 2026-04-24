import { useLoginController } from "@/features/auth/hooks/useLoginController";

import { LoginFormView } from "./LoginFormView";

export function LoginForm() {
  const controller = useLoginController();

  return <LoginFormView {...controller} />;
}
