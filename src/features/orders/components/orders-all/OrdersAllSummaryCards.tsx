import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type OrdersAllSummaryCardsModel = {
  id: string
  label: string
  value: string
  tone: 'slate' | 'amber' | 'emerald' | 'indigo'
}

const toneClassMap: Record<OrdersAllSummaryCardsModel['tone'], string> = {
  slate: 'from-slate-50 to-white',
  amber: 'from-amber-50 to-white',
  emerald: 'from-emerald-50 to-white',
  indigo: 'from-indigo-50 to-white',
}

type OrdersAllSummaryCardsProps = {
  cards: OrdersAllSummaryCardsModel[]
}

export function OrdersAllSummaryCards({ cards }: OrdersAllSummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.id} className={`border border-slate-200 bg-gradient-to-br ${toneClassMap[card.tone]}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{card.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
