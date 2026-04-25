import { BarChart2, ShieldCheck, Zap } from 'lucide-react'
import type {
  AlertsSeverity,
  AlertsTabId,
  DashboardAlertsNotificationsViewModel,
} from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

import { AlertsHeader } from './AlertsHeader'
import { AlertsSection } from './AlertsSection'
import { AlertsSummaryStrip } from './AlertsSummaryStrip'
import { AlertHistory } from '../alerts-notifications/AlertHistory'
import { AlertThresholdSettings } from '../alerts-notifications/AlertThresholdSettings'
import { AlertFrequencyChart } from '../alerts-notifications/AlertFrequencyChart'
import { AlertAssignmentDialog } from '../alerts-notifications/AlertAssignmentDialog'

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
  focusedAlertId?: string | null
  assigningAlertId: string | null
  onAssignAlertIdChange: (id: string | null) => void
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
  focusedAlertId,
  assigningAlertId,
  onAssignAlertIdChange,
}: DashboardAlertsNotificationsViewProps) {
  const activeTab = model.tabs.find((tab) => tab.id === selectedTab)
  const isHistoryTab = selectedTab === 'history'

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
      <div className="space-y-10">
        <AlertsHeader
          title="Trung tâm Cảnh báo"
          subtitle={model.subtitle.replace('Hệ thống ghi nhận', 'Phát hiện')}
          autoRefreshLabel={model.autoRefreshLabel}
          updatedAtLabel={model.updatedAtLabel}
          markAllReadLabel={model.markAllReadLabel}
          settingsTooltip={model.settingsTooltip}
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
          filterLabel="Lọc mức độ"
          clearFilterLabel={model.clearFilterLabel}
          onToggleSeverity={onToggleSeverity}
          onClearSeverity={onClearSeverity}
          onTabChange={onTabChange}
        />

        <div className="min-h-[400px]">
          {isHistoryTab ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AlertHistory />
            </div>
          ) : model.totalVisible === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-20 text-center animate-in zoom-in-95 duration-300">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                <ShieldCheck className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Mọi thứ đều ổn định</h3>
              <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto">
                {model.emptyMessage}
              </p>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in duration-500">
              {model.sections.map((section) => (
                <AlertsSection 
                  key={section.id} 
                  section={section} 
                  onActionClick={onActionClick} 
                  onAssignClick={onAssignAlertIdChange}
                  focusedAlertId={focusedAlertId}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-2 pt-10 border-t border-slate-100">
          <AlertFrequencyChart />
          <AlertThresholdSettings />
        </div>
      </div>

      <aside className="space-y-6 xl:sticky xl:top-6">
        {/* Simplified Overview */}
        <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="size-4 text-primary-500" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Tóm tắt</h2>
          </div>

          <div className="space-y-4">
            <OverviewItem label="Đang xem" value={activeTab?.label ?? 'Tất cả'} />
            <OverviewItem label="Hiển thị" value={`${model.totalVisible} mục`} />
            
            <div className="mt-4 rounded-2xl bg-slate-50 p-3 border border-slate-100">
              <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                <span>Trạng thái</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-600 line-clamp-1">
                {model.autoRefreshLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Tips - Compact */}
        <div className="rounded-3xl border border-indigo-100 bg-indigo-50/30 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="size-4 text-indigo-600" />
            <p className="text-[11px] font-black uppercase tracking-widest text-indigo-900/70">Mẹo nhanh</p>
          </div>
          <p className="text-xs leading-relaxed text-slate-700 font-bold">
            Sử dụng phím <kbd className="bg-white border border-slate-200 px-1 rounded shadow-sm">J</kbd>/<kbd className="bg-white border border-slate-200 px-1 rounded shadow-sm">K</kbd> để di chuyển và <kbd className="bg-white border border-slate-200 px-1 rounded shadow-sm">A</kbd> để phân công nhanh.
          </p>
        </div>
      </aside>

      <AlertAssignmentDialog 
        alertId={assigningAlertId} 
        onOpenChange={(open) => !open && onAssignAlertIdChange(null)} 
      />
    </div>
  )
}

function OverviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-right text-xs font-black text-slate-800">{value}</span>
    </div>
  )
}
