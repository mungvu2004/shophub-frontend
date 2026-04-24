import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { InventoryStockMovementChartEntry } from '@/features/inventory/logic/inventoryStockMovements.types';

export type StockMovementsChartProps = {
  data: InventoryStockMovementChartEntry[];
};

export function StockMovementsChart({ data }: StockMovementsChartProps) {
  return (
    <div className="h-[300px] w-full p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Biến động nhập xuất theo ngày</h3>
          <p className="text-[10px] text-slate-500 font-medium italic">Dữ liệu trong khoảng thời gian đang lọc</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ fontWeight: 800, color: '#0f172a' }}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}
          />
          <Line 
            type="monotone" 
            dataKey="inbound" 
            name="Nhập kho" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="outbound" 
            name="Xuất kho" 
            stroke="#f43f5e" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
