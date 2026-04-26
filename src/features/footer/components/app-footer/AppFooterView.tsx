import type { FooterViewModel } from '@/features/footer/logic/footer.types'

import { AppFooterBottomBar } from './AppFooterBottomBar'
import { AppFooterBrandBlock } from './AppFooterBrandBlock'
import { AppFooterLinkGroups } from './AppFooterLinkGroups'

type AppFooterViewProps = {
  model: FooterViewModel
  isRefreshing: boolean
}

export function AppFooterView({ model }: AppFooterViewProps) {
  return (
    <footer className="mt-10 border-t border-slate-200/80 bg-gradient-to-b from-slate-50 to-white px-4 py-8 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <AppFooterBrandBlock
          brandName={model.brandName}
          headline={model.headline}
          description={model.description}
          supportEmail={model.supportEmail}
          supportPhone={model.supportPhone}
        />

        <AppFooterLinkGroups groups={model.groups} />

        <AppFooterBottomBar
          updatedLabel={model.updatedLabel}
          copyrightLabel={model.copyrightLabel}
        />
      </div>
    </footer>
  )
}