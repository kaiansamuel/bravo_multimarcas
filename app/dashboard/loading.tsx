export default function DashboardLoading() {
  return (
    <div>
      <div className="h-8 w-48 animate-pulse rounded bg-charcoal-800" />
      <div className="mt-2 h-4 w-64 animate-pulse rounded bg-charcoal-800" />

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-6"
          >
            <div className="h-4 w-32 animate-pulse rounded bg-charcoal-700" />
            <div className="mt-4 h-10 w-20 animate-pulse rounded bg-charcoal-700" />
            <div className="mt-2 h-3 w-24 animate-pulse rounded bg-charcoal-700" />
          </div>
        ))}
      </div>
    </div>
  );
}
