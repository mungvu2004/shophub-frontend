import { http, HttpResponse } from "msw";
import { MOCK_AUTH_CREDENTIAL, MOCK_CURRENT_USER, MOCK_TOKEN_RESPONSE } from "@/mocks/data/auth";

export const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };

    if (
      body.email === MOCK_AUTH_CREDENTIAL.email
      && body.password === MOCK_AUTH_CREDENTIAL.password
    ) {
      return HttpResponse.json(MOCK_TOKEN_RESPONSE, { status: 200 });
    }

    return HttpResponse.json(
      {
        status: 401,
        title: "Unauthorized",
        detail: "Email hoac mat khau khong dung",
        message: "Email hoac mat khau khong dung",
      },
      { status: 401 },
    );
  }),

  http.get("/api/auth/me", () => HttpResponse.json({ data: MOCK_CURRENT_USER, success: true }, { status: 200 })),
];
