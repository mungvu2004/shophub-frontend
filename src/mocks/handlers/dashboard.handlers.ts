import { http, HttpResponse } from "msw";
import {
  dashboardKPIOverview,
  dashboardRevenue30d,
  dashboardRevenueByPlatform,
} from "@/mocks/data/dashboard";
import { 
  dashboardAlertsNotificationsMock,
  alertHistoryMock,
  alertThresholdsMock,
  alertFrequencyMock,
  mockAssignees
} from "@/mocks/data/dashboardAlertsNotifications";
import {
  getDashboardTopProductsPayload,
  type DashboardTopProductsMetric,
  type DashboardTopProductsPlatform,
  type DashboardTopProductsRange,
} from "@/mocks/data/dashboardTopProducts";
import {
  getDashboardRevenueChartsPayload,
  type RevenueChartsPlatform,
  type RevenueChartsRange,
} from "@/mocks/data/dashboardRevenueCharts";

export const dashboardHandlers = [
  http.get("/api/dashboard/kpi-overview", () => {
    return HttpResponse.json(
      {
        success: true,
        data: dashboardKPIOverview,
      },
      { status: 200 },
    );
  }),

  http.get("/api/dashboard/revenue", ({ request }) => {
    const url = new URL(request.url);
    const daysParam = Number(url.searchParams.get("days") ?? 30);
    const days = Number.isNaN(daysParam) ? 30 : Math.max(1, Math.min(daysParam, 30));
    const points = dashboardRevenue30d.slice(-days);

    return HttpResponse.json(
      {
        success: true,
        data: {
          points,
          byPlatform: dashboardRevenueByPlatform,
          totalRevenue: points.reduce((acc, point) => acc + point.total, 0),
        },
      },
      { status: 200 },
    );
  }),

  http.get("/api/revenue", ({ request }) => {
    const url = new URL(request.url);
    const daysParam = Number(url.searchParams.get("days") ?? 30);
    const days = Number.isNaN(daysParam) ? 30 : Math.max(1, Math.min(daysParam, 30));
    const points = dashboardRevenue30d.slice(-days);

    return HttpResponse.json(
      {
        items: points,
        totalCount: points.length,
      },
      { status: 200 },
    );
  }),

  http.get("/api/dashboard/top-products", ({ request }) => {
    const url = new URL(request.url);

    const metric = (url.searchParams.get("metric") ?? "revenue") as DashboardTopProductsMetric;
    const rangeParam = Number(url.searchParams.get("range") ?? 30);
    const platform = (url.searchParams.get("platform") ?? "all") as DashboardTopProductsPlatform;

    const rangeDays: DashboardTopProductsRange =
      rangeParam === 7 || rangeParam === 90
        ? rangeParam
        : 30;

    const safeMetric: DashboardTopProductsMetric =
      metric === "quantity" || metric === "returnRate"
        ? metric
        : "revenue";

    const safePlatform: DashboardTopProductsPlatform =
      platform === "shopee" || platform === "lazada" || platform === "tiktok_shop"
        ? platform
        : "all";

    return HttpResponse.json(
      {
        success: true,
        data: getDashboardTopProductsPayload({
          metric: safeMetric,
          rangeDays,
          platform: safePlatform,
        }),
      },
      { status: 200 },
    );
  }),

  http.get("/api/dashboard/revenue-charts", ({ request }) => {
    const url = new URL(request.url);

    const platform = (url.searchParams.get("platform") ?? "all") as RevenueChartsPlatform;
    const rangeParam = Number(url.searchParams.get("range") ?? 30);

    const safePlatform: RevenueChartsPlatform =
      platform === "shopee" || platform === "lazada" || platform === "tiktok_shop"
        ? platform
        : "all";

    const safeRange: RevenueChartsRange = rangeParam === 7 ? 7 : 30;

    return HttpResponse.json(
      {
        success: true,
        data: getDashboardRevenueChartsPayload({
          platform: safePlatform,
          rangeDays: safeRange,
        }),
      },
      { status: 200 },
    );
  }),

  http.get("/api/dashboard/alerts-notifications", () => {
    return HttpResponse.json(
      {
        success: true,
        data: dashboardAlertsNotificationsMock,
      },
      { status: 200 },
    );
  }),

  http.post("/api/dashboard/alerts-notifications/read-all", () => {
    dashboardAlertsNotificationsMock.alerts = dashboardAlertsNotificationsMock.alerts.map((item) => ({
      ...item,
      isRead: true,
    }));

    return HttpResponse.json(
      {
        success: true,
        message: "All alerts marked as read",
      },
      { status: 200 },
    );
  }),

  http.post("/api/dashboard/alerts-notifications/:id/dismiss", ({ params }) => {
    const { id } = params;
    const alert = dashboardAlertsNotificationsMock.alerts.find(a => a.id === id);
    if (alert) {
      alert.severity = 'resolved'; // Move to history instead of deleting for demo
    }

    return HttpResponse.json(
      {
        success: true,
        message: `Alert ${id} dismissed`,
      },
      { status: 200 },
    );
  }),

  http.post("/api/dashboard/alerts-notifications/:id/undismiss", ({ params }) => {
    const { id } = params;
    const alert = dashboardAlertsNotificationsMock.alerts.find(a => a.id === id);
    if (alert) {
      alert.severity = 'action'; // Revert to action
    }

    return HttpResponse.json(
      {
        success: true,
        message: `Alert ${id} restored`,
      },
      { status: 200 },
    );
  }),

  http.get("/api/dashboard/alerts-notifications/history", () => {
    const history = dashboardAlertsNotificationsMock.alerts.filter(a => a.severity === 'resolved');
    return HttpResponse.json(
      {
        success: true,
        data: history.length > 0 ? history : alertHistoryMock,
      },
      { status: 200 },
    );
  }),

  http.get("/api/dashboard/alerts-notifications/thresholds", () => {
    return HttpResponse.json(
      {
        success: true,
        data: alertThresholdsMock,
      },
      { status: 200 },
    );
  }),

  http.put("/api/dashboard/alerts-notifications/thresholds", async ({ request }) => {
    const body = await request.json() as AlertThreshold;
    const index = alertThresholdsMock.findIndex(t => t.id === body.id);
    if (index !== -1) {
      alertThresholdsMock[index] = body;
    }
    return HttpResponse.json(
      {
        success: true,
        data: body,
      },
      { status: 200 },
    );
  }),

  http.post("/api/dashboard/alerts-notifications/:id/assign", async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as { userId: string | null };
    const alert = dashboardAlertsNotificationsMock.alerts.find(a => a.id === id);
    
    if (alert) {
      if (body.userId === null) {
        alert.assignedTo = undefined;
      } else {
        const user = mockAssignees.find(u => u.id === body.userId);
        if (user) {
          alert.assignedTo = user;
        }
      }
    }

    return HttpResponse.json(
      {
        success: true,
        message: body.userId ? `Alert ${id} assigned` : `Alert ${id} unassigned`,
      },
      { status: 200 },
    );
  }),

  http.get("/api/dashboard/alerts-notifications/frequency", () => {
    return HttpResponse.json(
      {
        success: true,
        data: alertFrequencyMock,
      },
      { status: 200 },
    );
  }),

  http.get("/api/users/staff", () => {
    return HttpResponse.json(
      {
        success: true,
        data: mockAssignees,
      },
      { status: 200 },
    );
  }),
];
