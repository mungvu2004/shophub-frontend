import { useState } from 'react'
import { Calculator, Calendar, Percent, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type ForecastParameterFormProps = {
  isRecalculating: boolean
  onRecalculate: (params: unknown) => void
}

const PRESETS = [
  { label: 'Flash Sale', name: 'Flash Sale 5/5', date: '2026-05-05', boost: 120 },
  { label: 'Tết Nguyên Đán', name: 'Tết Nguyên Đán 2027', date: '2027-02-05', boost: 250 },
  { label: 'Black Friday', name: 'Black Friday 2026', date: '2026-11-27', boost: 300 },
]

export function ForecastParameterForm({ isRecalculating, onRecalculate }: ForecastParameterFormProps) {
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [salesBoost, setSalesBoost] = useState('')

  const handleApplyPreset = (preset: typeof PRESETS[number]) => {
    setEventName(preset.name)
    setEventDate(preset.date)
    setSalesBoost(preset.boost.toString())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onRecalculate({
      eventName,
      eventDate,
      salesBoost: Number(salesBoost) || 0
    })
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100">
          <Calculator className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Giả lập biến số</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Cấu hình sự kiện để AI tính toán lại</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
         {PRESETS.map(preset => (
            <button 
              key={preset.label} 
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[9px] font-black uppercase text-slate-500 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
               + {preset.label}
            </button>
         ))}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-1.5">
               <label htmlFor="event-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tên sự kiện</label>
               <div className="relative">
                  <Zap className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input 
                    id="event-name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="VD: Flash Sale 5/5..." 
                    className="h-11 rounded-xl pl-10 border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm font-bold"
                  />
               </div>
            </div>
            <div className="space-y-1.5">
               <label htmlFor="event-date" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Thời gian</label>
               <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input 
                    id="event-date"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="h-11 rounded-xl pl-10 border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm font-bold"
                  />
               </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="sales-boost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kỳ vọng tăng trưởng doanh số (%)</label>
            <div className="relative">
               <Percent className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
               <Input 
                 id="sales-boost"
                 type="number"
                 value={salesBoost}
                 onChange={(e) => setSalesBoost(e.target.value)}
                 placeholder="30" 
                 className="h-11 rounded-xl pl-10 border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm font-bold"
               />
            </div>
          </div>
        </div>

        <Button 
          type="submit"
          disabled={isRecalculating || (!eventName && !salesBoost)}
          aria-busy={isRecalculating}
          className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-primary-600 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          {isRecalculating ? 'Đang tính toán lại...' : 'Áp dụng & Tính toán lại'}
        </Button>
      </form>
    </div>
  )
}
