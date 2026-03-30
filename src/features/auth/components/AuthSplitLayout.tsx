import type { PropsWithChildren, ReactNode } from "react";

type AuthSplitLayoutProps = PropsWithChildren<{
  title: string;
  subtitle: string;
  footer?: ReactNode;
}>;

export function AuthSplitLayout({ title, subtitle, footer, children }: AuthSplitLayoutProps) {
  return (
    <main className="min-h-screen bg-[#f9f9ff]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-[#0b163a] p-12 text-white lg:flex lg:flex-col lg:items-center lg:justify-center">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-6 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative z-10 w-full max-w-xl">
            <div className="space-y-3 text-center">
              <h1 className="text-5xl font-extrabold tracking-tight">ShopHub</h1>
              <p className="mx-auto max-w-sm text-base leading-7 text-white/75">
                Quản lý toàn bộ Shop của bạn từ một nơi
              </p>
            </div>

            <div className="mt-12 rounded-xl border border-white/20 bg-white/[0.03] p-6 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-2">
                <span className="size-3 rounded-full bg-white/25" />
                <span className="size-3 rounded-full bg-white/25" />
                <span className="size-3 rounded-full bg-white/25" />
              </div>

              <div className="grid h-64 grid-cols-6 grid-rows-4 gap-4">
                <div className="col-span-4 row-span-2 flex flex-col justify-between rounded-lg bg-indigo-500/25 p-4">
                  <div className="h-2 w-20 rounded bg-white/40" />
                  <div className="h-8 w-32 rounded bg-white/15" />
                </div>
                <div className="col-span-2 row-span-1 rounded-lg bg-indigo-300/35" />
                <div className="col-span-2 row-span-1 rounded-lg bg-white/10" />
                <div className="col-span-2 row-span-2 rounded-lg bg-white/10" />
                <div className="col-span-2 row-span-1 rounded-lg bg-indigo-500/35" />
                <div className="col-span-2 row-span-1 rounded-lg bg-white/15" />
              </div>
            </div>
          </div>

          <p className="absolute bottom-10 text-xs font-medium tracking-wide text-slate-400">© 2026 ShopHub</p>
        </section>

        <section className="flex items-center justify-center p-4 sm:p-8 lg:p-10">
          <div className="w-full max-w-[360px] rounded-2xl bg-white p-4 shadow-[0px_12px_32px_0px_rgba(15,23,42,0.06)] sm:p-5">
            <header className="mb-8 space-y-2 text-center">
              <h2 className="text-4xl font-bold tracking-tight text-slate-800">{title}</h2>
              <p className="text-sm font-medium text-slate-500">{subtitle}</p>
            </header>

            {children}

            {footer ? <div className="pt-4">{footer}</div> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
