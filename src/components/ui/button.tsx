import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:ring-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",
        primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",
        cta: "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700",
        secondary: "bg-secondary-100 text-secondary-800 hover:bg-secondary-200",
        outline: "border-secondary-300 text-secondary-700 hover:bg-secondary-50",
        ghost: "text-secondary-600 hover:bg-secondary-100",
        danger: "bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800",
        link: "text-primary-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-7 px-2 text-xs rounded-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6 rounded-lg text-base",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-xs": "size-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & {
  isLoading?: boolean
  loadingText?: React.ReactNode
}

function Button({
  className,
  variant = "default",
  size = "default",
  isLoading,
  loadingText,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
      {isLoading && loadingText ? loadingText : children}
    </ButtonPrimitive>
  )
}

  // eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
