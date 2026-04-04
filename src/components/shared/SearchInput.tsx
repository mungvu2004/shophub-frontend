import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  inputClassName?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className,
  inputClassName,
}: SearchInputProps) {
  return (
    <label className={cn('relative block w-full max-w-xs', className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn('pl-8', inputClassName)}
      />
    </label>
  )
}
