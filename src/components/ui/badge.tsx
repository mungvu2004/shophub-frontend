import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 items-center justify-center gap-1 rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-primary-500/20",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600",
        primary: "bg-primary-100 text-primary-700 border-primary-200",
        secondary: "bg-secondary-100 text-secondary-800 border-secondary-200",
        success: "bg-success-100 text-success-700 border-success-200",
        warning: "bg-warning-100 text-warning-700 border-warning-200",
        danger: "bg-danger-100 text-danger-700 border-danger-200",
        info: "bg-info-100 text-info-700 border-info-200",
        neutral: "bg-secondary-100 text-secondary-500 border-secondary-200",
        shopee: "bg-[#FFF0ED] text-[#EE4D2D] border-[#FECEC4]",
        tiktok: "bg-[#FFF0F3] text-[#FE2C55] border-[#FFCCD6]",
        outline: "border-secondary-300 text-secondary-700 hover:bg-secondary-50",
        soft: "bg-secondary-50 text-secondary-700 border-transparent",
        destructive: "bg-danger-600 text-white hover:bg-danger-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
