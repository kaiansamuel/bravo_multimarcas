export default function FinanceiroLoading() {
  return (
    <div>
      <div className="h-8 w-40 animate-pulse rounded bg-charcoal-800" />
      <div className="mt-2 h-4 w-56 animate-pulse rounded bg-charcoal-800" />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-6"
          >
            <div className="h-4 w-28 animate-pulse rounded bg-charcoal-700" />
            <div className="mt-4 h-8 w-36 animate-pulse rounded bg-charcoal-700" />
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {[1, 2].map((col) => (
          <div key={col}>
            <div className="mb-4 h-6 w-24 animate-pulse rounded bg-charcoal-800" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-4"
                >
                  <div className="h-4 w-40 animate-pulse rounded bg-charcoal-700" />
                  <div className="mt-2 h-3 w-32 animate-pulse rounded bg-charcoal-700" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
