"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      position="top-right"
      closeButton
      duration={5000}
      visibleToasts={1}
      expand={false}
      richColors
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "hsl(0 0% 100%)",
          "--normal-text": "hsl(222 47% 17%)",
          "--normal-border": "hsl(214 32% 88%)",
          "--success-bg": "hsl(142 76% 96%)",
          "--success-text": "hsl(142 71% 25%)",
          "--success-border": "hsl(142 60% 83%)",
          "--error-bg": "hsl(0 100% 97%)",
          "--error-text": "hsl(0 72% 35%)",
          "--error-border": "hsl(0 85% 88%)",
          "--warning-bg": "hsl(48 100% 96%)",
          "--warning-text": "hsl(30 92% 30%)",
          "--warning-border": "hsl(42 96% 82%)",
          "--info-bg": "hsl(214 100% 97%)",
          "--info-text": "hsl(224 64% 33%)",
          "--info-border": "hsl(214 91% 86%)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast rounded-xl shadow-lg",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
