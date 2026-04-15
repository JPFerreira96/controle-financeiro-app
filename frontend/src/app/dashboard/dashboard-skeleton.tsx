export default function DashboardSkeleton() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8">
      {/* Header */}
      <div className="card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="skeleton h-3 w-40" />
          <div className="skeleton mt-3 h-7 w-56" />
          <div className="skeleton mt-2 h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-10 w-24 rounded-lg" />
          <div className="skeleton h-10 w-24 rounded-lg" />
          <div className="skeleton h-10 w-20 rounded-lg" />
        </div>
      </div>

      {/* Metric cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-4">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton mt-3 h-7 w-36" />
          </div>
        ))}
      </section>

      {/* Analysis + Summaries */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="skeleton h-5 w-52" />
          <div className="skeleton mt-4 h-4 w-40" />
          <div className="skeleton mt-3 h-4 w-full" />
          <div className="skeleton mt-2 h-4 w-3/4" />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div>
              <div className="skeleton h-4 w-44" />
              <div className="skeleton mt-2 h-3 w-32" />
              <div className="skeleton mt-1 h-3 w-28" />
            </div>
            <div>
              <div className="skeleton h-4 w-44" />
              <div className="skeleton mt-2 h-3 w-32" />
              <div className="skeleton mt-1 h-3 w-28" />
            </div>
          </div>
          <div className="skeleton mt-5 h-4 w-44" />
          <div className="skeleton mt-2 h-3 w-full" />
          <div className="skeleton mt-1 h-3 w-2/3" />
        </div>
        <div className="card p-6">
          <div className="skeleton h-5 w-24" />
          <div className="skeleton mt-4 h-4 w-full" />
          <div className="skeleton mt-2 h-4 w-full" />
          <div className="skeleton mt-2 h-4 w-3/4" />
          <div className="skeleton mt-4 h-4 w-full" />
          <div className="skeleton mt-2 h-4 w-2/3" />
        </div>
      </section>

      {/* Forms */}
      <section className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card p-6">
            <div className="skeleton h-5 w-40" />
            <div className="mt-4 grid gap-3">
              <div className="skeleton h-10 w-full rounded-lg" />
              <div className="skeleton h-10 w-full rounded-lg" />
              <div className="skeleton h-10 w-full rounded-lg" />
              <div className="skeleton h-10 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-4">
            <div className="skeleton h-5 w-44" />
            <div className="skeleton mt-4 h-[260px] w-full rounded-lg" />
          </div>
        ))}
      </section>

      {/* Lists */}
      <section className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card p-6">
            <div className="skeleton h-5 w-36" />
            <div className="mt-3 space-y-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="skeleton h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
