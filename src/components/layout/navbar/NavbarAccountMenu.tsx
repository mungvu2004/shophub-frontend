import { Settings } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type NavbarAccountMenuProps = {
  displayName: string
  onOpenSettings: () => void
  onLogout: () => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function NavbarAccountMenu({ displayName, onOpenSettings, onLogout }: NavbarAccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 bg-white outline-none hover:bg-slate-50 focus:outline-none"
        aria-label="Account menu"
      >
        <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-xs font-bold text-white">
          {getInitials(displayName)}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 border-0 p-0">
        <div className="flex items-center gap-3 border-l-2 border-l-slate-300 px-4 py-3">
          <div className="flex flex-1 flex-col items-end">
            <p className="text-right text-sm font-bold text-slate-900">{displayName}</p>
            <p className="text-right text-xs text-slate-500">Workspace 01</p>
          </div>
          <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-xs font-bold text-white ring-2 ring-indigo-100">
            {getInitials(displayName)}
          </div>
        </div>
        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuItem
          onClick={onOpenSettings}
          className="cursor-pointer gap-2 rounded-none px-4 py-2"
        >
          <Settings className="size-4" />
          <span className="text-sm">Cài đặt tài khoản</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuItem onClick={onLogout} variant="destructive" className="cursor-pointer rounded-none px-4 py-2">
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
