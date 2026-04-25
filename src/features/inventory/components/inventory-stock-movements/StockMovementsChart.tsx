import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { InventoryStockMovementChartEntry } from '@/features/inventory/logic/inventoryStockMovements.types';

export type StockMovementsChartProps = {
  data: InventoryStockMovementChartEntry[];
};

export function StockMovementsChart({ data }: StockMovementsChartProps) {
  return (
    <div className="h-full min-h-[340px] w-full p-6 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Xu hướng biến động kho</h3>
          <p className="text-[10px] text-slate-500 font-medium italic mt-1">Dữ liệu tổng hợp theo ngày</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Nhập</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-rose-500" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Xuất</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ fontWeight: 800, color: '#0f172a' }}
            />
            <Area 
              type="monotone" 
              dataKey="inbound" 
              stroke="#10b981" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorInbound)" 
              dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
            />
            <Area 
              type="monotone" 
              dataKey="outbound" 
              stroke="#f43f5e" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorOutbound)" 
              dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
