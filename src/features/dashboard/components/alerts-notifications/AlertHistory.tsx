import React from 'react'
import { useAlertHistory } from '@/features/dashboard/hooks/useAlertHistory'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { History, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export const AlertHistory: React.FC = () => {
  const { data: history, isLoading } = useAlertHistory()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <History className="w-5 h-5 text-muted-foreground" />
          Lịch sử cảnh báo (30 ngày qua)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history && history.length > 0 ? (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[150px]">Ngày xử lý</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Phân loại</TableHead>
                  <TableHead className="text-right">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="text-xs font-medium">
                      {alert.resolvedAt ? format(new Date(alert.resolvedAt), 'dd/MM HH:mm', { locale: vi }) : alert.timeAgo}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{alert.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{alert.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {alert.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="soft" className="bg-green-500/10 text-green-600 border-green-500/20 gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Đã đóng
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            Không có lịch sử cảnh báo trong 30 ngày qua
          </div>
        )}
      </CardContent>
    </Card>
  )
}
