import { Link, useLocation, useNavigate } from 'react-router-dom'

export function NotFoundPage() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-indigo-100/70 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-amber-100/70 blur-2xl" />

      <div className="relative mx-auto w-full max-w-xl rounded-2xl border border-white/70 bg-white/90 p-8 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Lỗi điều hướng</p>
        <h1 className="mt-3 text-5xl font-bold tracking-tight text-slate-900">404</h1>
        <p className="mt-3 text-base font-semibold text-slate-700">Không tìm thấy trang bạn đang truy cập.</p>
        <p className="mt-2 text-sm text-slate-500">
          Đường dẫn <span className="font-mono text-slate-700">{location.pathname}</span> không tồn tại hoặc đã được thay đổi.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Quay lại
          </button>

          <Link
            to="/"
            className="inline-flex h-10 items-center rounded-lg bg-gradient-to-r from-indigo-700 to-indigo-500 px-4 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(79,70,229,0.25)] transition hover:opacity-95"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
