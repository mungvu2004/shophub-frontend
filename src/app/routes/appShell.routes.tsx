import { lazy } from 'react'
import { Navigate, Route } from 'react-router-dom'

import { PageLoader } from '@/app/routes/pageLoader'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { CRMCustomerProfilesPage } from '@/pages/crm/CRMCustomerProfilesPage'
import { CRMReviewInboxPage } from '@/pages/crm/CRMReviewInboxPage'
import { CRMSentimentAnalysisPage } from '@/pages/crm/CRMSentimentAnalysisPage'
import { DashboardAlertsNotificationsPage } from '@/pages/dashboard/DashboardAlertsNotificationsPage'
import { DashboardKPIOverviewPage } from '@/pages/dashboard/DashboardKPIOverviewPage'
import { DashboardRevenueChartsPage } from '@/pages/dashboard/DashboardRevenueChartsPage'
import { DashboardTopProductsPage } from '@/pages/dashboard/DashboardTopProductsPage'
import { InventoryAIForecastPage } from '@/pages/inventory/InventoryAIForecastPage'
import { InventorySKUStockPage } from '@/pages/inventory/InventorySKUStockPage'
import { InventoryStockMovementsPage } from '@/pages/inventory/InventoryStockMovementsPage'
import { OrdersAllPage } from '@/pages/orders/OrdersAllPage'
import { OrdersPendingActionsPage } from '@/pages/orders/OrdersPendingActionsPage'
import { OrdersReturnsPage } from '@/pages/orders/OrdersReturnsPage'
import { ProductsCompetitorTrackingPage } from '@/pages/products/ProductsCompetitorTrackingPage'
import { ProductsDynamicPricingPage } from '@/pages/products/ProductsDynamicPricingPage'
import { ProductsListPage } from '@/pages/products/ProductsListPage'
import { RevenueMLForecastPage } from '@/pages/revenue/RevenueMLForecastPage'
import { RevenuePlatformComparisonPage } from '@/pages/revenue/RevenuePlatformComparisonPage'
import { RevenueSummaryReportPage } from '@/pages/revenue/RevenueSummaryReportPage'
import { SettingsAutomationPage } from '@/pages/settings/SettingsAutomationPage'
import { SettingsAutomationBuilderPage } from '@/pages/settings/SettingsAutomationBuilderPage'
import { SettingsPlatformConnectionsPage } from '@/pages/settings/SettingsPlatformConnectionsPage'
import { SettingsProfilePage } from '@/pages/settings/SettingsProfilePage'
import { SettingsStaffPermissionsPage } from '@/pages/settings/SettingsStaffPermissionsPage'

const ProductDetailPage = lazy(() =>
  import('@/pages/products/ProductDetailPage').then((module) => ({
    default: module.ProductDetailPage,
  })),
)

const OrderDetailPage = lazy(() =>
  import('@/pages/orders/OrderDetailPage').then((module) => ({
    default: module.OrderDetailPage,
  })),
)

const PlatformsPage = lazy(() =>
  import('@/pages/integrations/PlatformsPage').then((module) => ({
    default: module.PlatformsPage,
  })),
)

const PlatformCallbackPage = lazy(() =>
  import('@/pages/integrations/PlatformCallbackPage').then((module) => ({
    default: module.PlatformCallbackPage,
  })),
)

const AIChatPage = lazy(() =>
  import('@/pages/ai/AIChatPage').then((module) => ({ default: module.AIChatPage })),
)

const AIForecastPage = lazy(() =>
  import('@/pages/ai/AIForecastPage').then((module) => ({
    default: module.AIForecastPage,
  })),
)

export function AppShellRoutes() {
  return (
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Navigate to="/dashboard/kpi-overview" replace />} />
        <Route
          path="dashboard/kpi-overview"
          element={
            <PageLoader>
              <DashboardKPIOverviewPage />
            </PageLoader>
          }
        />
        <Route
          path="dashboard/revenue-charts"
          element={
            <PageLoader>
              <DashboardRevenueChartsPage />
            </PageLoader>
          }
        />
        <Route
          path="dashboard/top-products"
          element={
            <PageLoader>
              <DashboardTopProductsPage />
            </PageLoader>
          }
        />
        <Route
          path="dashboard/alerts-notifications"
          element={
            <PageLoader>
              <DashboardAlertsNotificationsPage />
            </PageLoader>
          }
        />
        <Route path="orders" element={<Navigate to="/orders/all" replace />} />
        <Route
          path="orders/all"
          element={
            <PageLoader>
              <OrdersAllPage />
            </PageLoader>
          }
        />
        <Route
          path="orders/pending-actions"
          element={
            <PageLoader>
              <OrdersPendingActionsPage />
            </PageLoader>
          }
        />
        <Route
          path="orders/returns"
          element={
            <PageLoader>
              <OrdersReturnsPage />
            </PageLoader>
          }
        />
        <Route path="inventory" element={<Navigate to="/inventory/sku-stock" replace />} />
        <Route
          path="inventory/sku-stock"
          element={
            <PageLoader>
              <InventorySKUStockPage />
            </PageLoader>
          }
        />
        <Route
          path="inventory/stock-movements"
          element={
            <PageLoader>
              <InventoryStockMovementsPage />
            </PageLoader>
          }
        />
        <Route
          path="inventory/ai-forecast"
          element={
            <PageLoader>
              <InventoryAIForecastPage />
            </PageLoader>
          }
        />
        <Route path="revenue" element={<Navigate to="/revenue/summary-report" replace />} />
        <Route
          path="revenue/summary-report"
          element={
            <PageLoader>
              <RevenueSummaryReportPage />
            </PageLoader>
          }
        />
        <Route
          path="revenue/platform-comparison"
          element={
            <PageLoader>
              <RevenuePlatformComparisonPage />
            </PageLoader>
          }
        />
        <Route
          path="revenue/ml-forecast"
          element={
            <PageLoader>
              <RevenueMLForecastPage />
            </PageLoader>
          }
        />
        <Route path="products" element={<Navigate to="/products/list" replace />} />
        <Route
          path="products/list"
          element={
            <PageLoader>
              <ProductsListPage />
            </PageLoader>
          }
        />
        <Route
          path="products/dynamic-pricing"
          element={
            <PageLoader>
              <ProductsDynamicPricingPage />
            </PageLoader>
          }
        />
        <Route
          path="products/competitor-tracking"
          element={
            <PageLoader>
              <ProductsCompetitorTrackingPage />
            </PageLoader>
          }
        />
        <Route path="crm" element={<Navigate to="/crm/sentiment-analysis" replace />} />
        <Route
          path="crm/sentiment-analysis"
          element={
            <PageLoader>
              <CRMSentimentAnalysisPage />
            </PageLoader>
          }
        />
        <Route
          path="crm/review-inbox"
          element={
            <PageLoader>
              <CRMReviewInboxPage />
            </PageLoader>
          }
        />
        <Route
          path="crm/customer-profiles"
          element={
            <PageLoader>
              <CRMCustomerProfilesPage />
            </PageLoader>
          }
        />
        <Route path="settings" element={<Navigate to="/settings/platform-connections" replace />} />
        <Route
          path="settings/profile"
          element={
            <PageLoader>
              <SettingsProfilePage />
            </PageLoader>
          }
        />
        <Route
          path="settings/platform-connections"
          element={
            <PageLoader>
              <SettingsPlatformConnectionsPage />
            </PageLoader>
          }
        />
        <Route
          path="settings/staff-permissions"
          element={
            <PageLoader>
              <SettingsStaffPermissionsPage />
            </PageLoader>
          }
        />
        <Route
          path="settings/automation"
          element={
            <PageLoader>
              <SettingsAutomationPage />
            </PageLoader>
          }
        />
        <Route
          path="settings/automation/new-rule"
          element={
            <PageLoader>
              <SettingsAutomationBuilderPage />
            </PageLoader>
          }
        />
        <Route
          path="products/:id"
          element={
            <PageLoader>
              <ProductDetailPage />
            </PageLoader>
          }
        />
        <Route
          path="orders/:id"
          element={
            <PageLoader>
              <OrderDetailPage />
            </PageLoader>
          }
        />
        <Route
          path="platforms"
          element={
            <PageLoader>
              <PlatformsPage />
            </PageLoader>
          }
        />
        <Route
          path="platforms/callback/:platform"
          element={
            <PageLoader>
              <PlatformCallbackPage />
            </PageLoader>
          }
        />
        <Route
          path="ai/chat"
          element={
            <PageLoader>
              <AIChatPage />
            </PageLoader>
          }
        />
        <Route
          path="ai/forecast"
          element={
            <PageLoader>
              <AIForecastPage />
            </PageLoader>
          }
        />
      </Route>
    </Route>
  )
}
