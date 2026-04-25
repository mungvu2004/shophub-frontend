import React from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useStaffList } from '@/features/dashboard/hooks/useStaffList'
import { useDashboardAlertsNotifications } from '@/features/dashboard/hooks/useDashboardAlertsNotifications'
import { Skeleton } from '@/components/ui/skeleton'
import { UserPlus, UserCheck } from 'lucide-react'
import { toast } from 'sonner'

// Checking for Avatar component in the project
// Based on list_directory src/components/ui, I don't see avatar.tsx. 
// I'll use a simple div with img instead to be safe or check if there's any other UI lib.
// package.json says @base-ui/react is present.

interface AlertAssignmentDialogProps {
  alertId: string | null
  onOpenChange: (open: boolean) => void
}

export const AlertAssignmentDialog: React.FC<AlertAssignmentDialogProps> = ({ 
  alertId, 
  onOpenChange 
}) => {
  const { data: staff, isLoading } = useStaffList()
  const { assignAlert, isAssigningAlert } = useDashboardAlertsNotifications()

  const handleAssign = (userId: string) => {
    if (!alertId) return

    assignAlert(
      { alertId, userId },
      {
        onSuccess: () => {
          toast.success('Đã phân công nhân sự xử lý')
          onOpenChange(false)
        },
        onError: () => toast.error('Lỗi khi phân công nhân sự')
      }
    )
  }

  return (
    <Dialog open={!!alertId} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-slate-200 shadow-2xl rounded-3xl">
        <DialogHeader className="px-6 pt-6 pb-4 bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 shadow-sm">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-extrabold text-slate-900 tracking-tight">
                Phân công xử lý cảnh báo
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-slate-500">
                Chọn thành viên chịu trách nhiệm giải quyết vấn đề này.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-4 space-y-1.5 max-h-[400px] overflow-y-auto custom-scrollbar bg-white">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : (
            staff?.map(member => (
              <button 
                key={member.id} 
                type="button"
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group border border-transparent hover:border-slate-100 hover:shadow-sm"
                onClick={() => handleAssign(member.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-200 group-hover:ring-primary-300 transition-all">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-black text-slate-400 bg-slate-50">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800 group-hover:text-primary-700 transition-colors">{member.name}</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Thành viên đội ngũ</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary-600 text-white shadow-md shadow-primary-200">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <DialogFooter className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-medium text-slate-400 italic">
            * Hệ thống sẽ gửi thông báo đẩy đến người được chọn.
          </p>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)} 
            disabled={isAssigningAlert}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 rounded-xl"
          >
            Hủy bỏ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
