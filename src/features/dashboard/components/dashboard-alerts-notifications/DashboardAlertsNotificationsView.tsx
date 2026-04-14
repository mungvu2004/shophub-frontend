import type {
  AlertsSeverity,
  AlertsTabId,
  DashboardAlertsNotificationsViewModel,
} from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

import { AlertsHeader } from './AlertsHeader'
import { AlertsSection } from './AlertsSection'
import { AlertsSummaryStrip } from './AlertsSummaryStrip'

type DashboardAlertsNotificationsViewProps = {
  model: DashboardAlertsNotificationsViewModel
  selectedTab: AlertsTabId
  selectedSeverities: AlertsSeverity[]
  isRefreshing: boolean
  isMarkingAllRead: boolean
  onTabChange: (tab: AlertsTabId) => void
  onToggleSeverity: (severity: AlertsSeverity) => void
  onClearSeverity: () => void
  onMarkAllRead: () => void
  onOpenSettings: () => void
  onActionClick: (payload: {
    alertId: string
    actionId: string
    actionLabel: string
    category: DashboardAlertsNotificationsViewModel['sections'][number]['cards'][number]['category']
  }) => void
}

export function DashboardAlertsNotificationsView({
  model,
  selectedTab,
  selectedSeverities,
  isRefreshing,
  isMarkingAllRead,
  onTabChange,
  onToggleSeverity,
  onClearSeverity,
  onMarkAllRead,
  onOpenSettings,
  onActionClick,
}: DashboardAlertsNotificationsViewProps) {
  const activeTab = model.tabs.find((tab) => tab.id === selectedTab)

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
      <div className="space-y-6">
        <AlertsHeader
          title={model.title}
          subtitle={model.subtitle}
          autoRefreshLabel={model.autoRefreshLabel}
          updatedAtLabel={model.updatedAtLabel}
          isRefreshing={isRefreshing}
          isMarkingAllRead={isMarkingAllRead}
          onMarkAllRead={onMarkAllRead}
          onOpenSettings={onOpenSettings}
        />

        <AlertsSummaryStrip
          chips={model.summaryChips}
          tabs={model.tabs}
          activeTab={selectedTab}
          selectedSeverities={selectedSeverities}
          onToggleSeverity={onToggleSeverity}
          onClearSeverity={onClearSeverity}
          onTabChange={onTabChange}
        />

        {model.totalVisible === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm font-medium text-slate-500">
            Không có cảnh báo phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          <div className="space-y-8">
            {model.sections.map((section) => (
              <AlertsSection key={section.id} section={section} onActionClick={onActionClick} />
            ))}
          </div>
        )}
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_34px_-28px_rgba(15,23,42,0.18)]">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tổng quan nhanh</p>
            <h2 className="text-lg font-semibold text-slate-900">Trạng thái hiện tại</h2>
          </div>

          <div className="mt-5 space-y-3">
            <OverviewRow label="Đang xem" value={activeTab?.label ?? 'Tất cả'} />
            <OverviewRow label="Cảnh báo hiển thị" value={`${model.totalVisible}`} />
            <OverviewRow label="Nhóm đang có" value={`${model.sections.length}`} />
            <OverviewRow
              label="Bộ lọc severity"
              value={selectedSeverities.length > 0 ? `${selectedSeverities.length} đã chọn` : 'Toàn bộ'}
            />
            <OverviewRow label="Tự làm mới" value={model.autoRefreshLabel} />
            <OverviewRow label="Cập nhật" value={model.updatedAtLabel} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Gợi ý</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Ưu tiên xử lý các mục Khẩn cấp và Cần xử lý trước. Nhóm Thông tin chỉ là phần theo dõi tổng quát.
          </p>
          <div className="mt-4 grid gap-2 text-sm text-slate-700">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">Dùng chip để lọc nhanh theo mức độ.</div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">Chuyển tab khi cần xem theo nghiệp vụ.</div>
          </div>
        </div>
      </aside>
    </div>
  )
}

function OverviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/70 bg-slate-50 px-3 py-2.5">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-right text-sm font-semibold text-slate-900">{value}</span>
    </div>
  )
}
