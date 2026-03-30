import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type SectionPagePlaceholderProps = {
  title: string
  description: string
}

export function SectionPagePlaceholder({ title, description }: SectionPagePlaceholderProps) {
  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">{description}</p>
      </CardContent>
    </Card>
  )
}

