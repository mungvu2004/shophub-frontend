import { Card } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import type { ProductInsightsData } from '@/features/products/logic/productsListPage.types'

interface ProductInsightsProps {
  data: ProductInsightsData
}

export function ProductInsights({ data }: ProductInsightsProps) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">Hiệu suất danh mục</h3>
            <p className="text-[11px] font-bold text-slate-500 uppercase mt-1">Doanh số vs Tồn kho theo ngành hàng</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-indigo-500" />
              <span className="text-[11px] font-bold text-slate-600 uppercase">Doanh số</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-slate-300" />
              <span className="text-[11px] font-bold text-slate-600 uppercase">Tồn kho</span>
            </div>
          </div>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
              <Bar dataKey="stock" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">Phân bổ Sàn</h3>
          <p className="text-[11px] font-bold text-slate-500 uppercase mt-1">Tỉ lệ sản phẩm trên các kênh</p>
        </div>
        <div className="relative h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.platformAllocation}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.platformAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-3xl font-black text-slate-900">100%</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">Hoạt động</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {data.platformAllocation.map((p) => (
            <div key={p.name} className="text-center">
              <p className="text-sm font-black text-slate-900">{p.value}%</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase">{p.name}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

