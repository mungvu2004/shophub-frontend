import type { PlatformCode } from '@/types/platform.types'

export const platformStyleByCode: Record<PlatformCode, {
  cardBorderClassName: string
  logoBackgroundClassName: string
  logoTextClassName: string
  dotClassName: string
  label: string
}> = {
  shopee: {
    cardBorderClassName: 'border-l-[#EE4D2D]',
    logoBackgroundClassName: 'bg-[#FDECE8]',
    logoTextClassName: 'text-[#EE4D2D]',
    dotClassName: 'bg-[#EE4D2D]',
    label: 'SP',
  },
  tiktok_shop: {
    cardBorderClassName: 'border-l-black',
    logoBackgroundClassName: 'bg-black',
    logoTextClassName: 'text-white',
    dotClassName: 'bg-black',
    label: 'TT',
  },
  lazada: {
    cardBorderClassName: 'border-l-[#3525CD]',
    logoBackgroundClassName: 'bg-[#EEF0FF]',
    logoTextClassName: 'text-[#3525CD]',
    dotClassName: 'bg-[#3525CD]',
    label: 'LZ',
  },
}
