import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { 
  ArrowLeft, 
  Sparkles, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Zap, 
  Target,
  ShieldCheck
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { InventoryAIForecastDetailViewModel } from '@/features/inventory/logic/inventoryAIForecastDetail.types'

type InventoryAIForecastDetailViewProps = {
  model: InventoryAIForecastDetailViewModel
  onBack: () => void
}

export function InventoryAIForecastDetailView({ model, onBack }: InventoryAIForecastDetailViewProps) {
  const chartData = model.chartPoints.map((point) => ({
    monthLabel: point.monthLabel,
    historical: point.historical,
    forecast: point.forecast,
    confidenceLow: point.confidenceRange[0],
    confidenceHigh: point.confidenceRange[1],
  }))

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Top Navigation Bar - Standardized px-10 */}
      <nav className="sticky top-0 z-30 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl px-10 py-5">
        <div className="mx-auto max-w-[1600px] flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={onBack}
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50"
            >
              <ArrowLeft className="h-5 w-5 text-slate-500 transition-colors group-hover:text-indigo-600" />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{model.title}</h1>
                <Badge className="bg-indigo-600 text-white border-none font-black text-[9px] px-2 py-0.5 rounded-full">AI AGENT</Badge>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-0.5">{model.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 font-bold text-slate-600 transition-all hover:bg-slate-50">XUẤT DỮ LIỆU</Button>
            <Button className="h-11 px-6 rounded-xl bg-indigo-600 font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-95">
              <Plus className="mr-2 h-4 w-4 stroke-[3px]" />
              TẠO LỆNH NHẬP
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1600px] px-10 pt-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          
          {/* Left Column: Analysis & Charts */}
          <div className="space-y-10">
            {/* SKU Header Card - Standardized p-10 */}
            <Card className="overflow-hidden border-none bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] ring-1 ring-slate-100 rounded-[32px]">
              <div className="flex items-start justify-between">
                <div className="space-y-5">
                  <div className="flex items-center gap-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-slate-900 text-white shadow-xl shadow-slate-200">
                      <Package className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="font-mono text-[32px] font-black tracking-tighter text-slate-900 leading-none">{model.skuTitle}</h2>
                      <p className="text-[16px] font-medium text-slate-500 mt-2">{model.productName}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {model.tags.map((tag) => (
                      <Badge key={tag} className="bg-slate-50 text-slate-500 border border-slate-100 font-bold uppercase text-[10px] tracking-widest px-3 py-1.5 rounded-lg">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Model Confidence</p>
                  <div className="mt-1 flex items-end justify-end gap-2">
                    <span className="font-mono text-[48px] font-black leading-none text-indigo-600 tracking-tighter">{model.confidenceScore}%</span>
                    <Target className="mb-2 h-7 w-7 text-indigo-100" />
                  </div>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
                <StatMetric icon={<TrendingUp className="text-emerald-500" />} label="Bán TB/Ngày" value={model.avgDailySalesLabel} />
                <StatMetric icon={<Package className="text-indigo-500" />} label="Tồn kho thực" value={model.currentStockLabel} />
                <StatMetric icon={<AlertTriangle className="text-rose-500" />} label="Dự kiến Out-of-stock" value={model.stockoutDateLabel} />
                <StatMetric icon={<Zap className="text-amber-500" />} label="Số lượng gợi ý" value={model.suggestedInboundLabel} />
              </div>
            </Card>

            {/* Demand Forecast Chart - Standardized p-10 */}
            <Card className="border-none bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] ring-1 ring-slate-100 rounded-[32px]">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h3 className="text-[18px] font-bold text-slate-900 uppercase tracking-tight">{model.chartTitle}</h3>
                  <p className="text-xs font-medium text-slate-400 mt-1">Phân tích chuỗi thời gian thông minh</p>
                </div>
                <div className="flex items-center gap-8">
                  <ChartLegend color="bg-slate-900" label={model.chartLegend.history} />
                  <ChartLegend color="bg-indigo-500" dashed label={model.chartLegend.forecast} />
                  <ChartLegend color="bg-indigo-100" label={model.chartLegend.confidence} />
                </div>
              </div>

              <div className="h-[420px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.05}/>
                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="monthLabel"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }}
                      dy={15}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '20px' }}
                    />
                    <Area type="monotone" dataKey="confidenceHigh" stroke="none" fill="#eef2ff" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="confidenceLow" stroke="none" fill="#ffffff" />
                    <Area type="monotone" dataKey="historical" stroke="#0f172a" strokeWidth={3} fill="url(#colorHistory)" />
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      stroke="#6366f1"
                      strokeWidth={4}
                      strokeDasharray="10 8"
                      dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }}
                    />
                    <ReferenceLine x="MAR" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" label={{ position: 'top', value: 'BÂY GIỜ', fill: '#94a3b8', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Right Column: AI Insights & Scenarios */}
          <div className="space-y-10">
            {/* AI Recommendation Card - Standardized p-10 */}
            <Card className="relative overflow-hidden border-none bg-indigo-600 p-10 text-white shadow-2xl shadow-indigo-200 rounded-[32px]">
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xl ring-1 ring-white/20">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em]">{model.aiTitle}</h3>
                </div>
                <p className="text-[21px] font-bold leading-[1.6] text-white">
                  {model.aiSuggestionText}
                </p>
                <div className="flex items-center gap-4 rounded-[20px] bg-black/10 p-5 border border-white/10 backdrop-blur-sm">
                  <div className={`h-3 w-3 rounded-full ${model.riskTone === 'high' ? 'bg-rose-400' : 'bg-emerald-400'} animate-pulse shadow-[0_0_12px_rgba(251,113,133,0.5)]`} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Tình trạng rủi ro</p>
                    <p className="text-sm font-bold uppercase">{model.riskLabel}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Impact Factors - Standardized p-10 (Changed from p-8) */}
            <Card className="border-none bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] ring-1 ring-slate-100 rounded-[32px]">
              <h3 className="mb-8 text-xs font-black uppercase tracking-[0.15em] text-slate-400 px-1">{model.factorsTitle}</h3>
              <div className="space-y-8">
                {model.factors.map((factor) => (
                  <div key={factor.id} className="space-y-3">
                    <div className="flex items-center justify-between text-[13px] font-black">
                      <span className="text-slate-700">{factor.label}</span>
                      <span className="text-indigo-600 font-mono">{factor.impactPercent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-50">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-1000 shadow-sm" 
                        style={{ width: `${factor.impactPercent}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Scenarios - Unified Spacing */}
            <section className="space-y-5">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-4">
                <ShieldCheck className="h-4 w-4" />
                DỰ PHÒNG KỊCH BẢN
              </h3>
              <div className="space-y-4">
                {model.scenarios.map((scenario) => (
                  <button 
                    key={scenario.id}
                    className="group w-full rounded-[24px] border border-slate-100 bg-white p-6 text-left shadow-sm transition-all hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[14px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{scenario.label}</p>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${scenario.tone === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ''}
                          ${scenario.tone === 'rose' ? 'bg-rose-50 text-rose-700 border-rose-100' : ''}
                          ${scenario.tone === 'indigo' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : ''}
                          text-[10px] font-black px-2.5 rounded-full border-none
                        `}
                      >
                        {scenario.impactLabel}
                      </Badge>
                    </div>
                    <p className="text-[13px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors leading-relaxed">
                      {scenario.description}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  )
}

function StatMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-[#FBFDFF] p-6 ring-1 ring-slate-100/50 transition-all hover:shadow-lg hover:shadow-slate-100 hover:bg-white group">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="transition-transform group-hover:scale-110 duration-300">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 leading-none">{label}</span>
      </div>
      <p className="font-mono text-[24px] font-black text-slate-900 tracking-tighter leading-none">{value}</p>
    </div>
  )
}

function ChartLegend({ color, label, dashed = false }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`h-2 w-5 rounded-full ${color} ${dashed ? 'bg-transparent border-2 border-dashed border-indigo-400' : ''}`} />
      <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 leading-none">{label}</span>
    </div>
  )
}
