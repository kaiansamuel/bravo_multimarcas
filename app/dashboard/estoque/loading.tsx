export default function EstoqueLoading() {
  return (
    <div>
      <div className="h-8 w-32 animate-pulse rounded bg-charcoal-800" />
      <div className="mt-2 h-4 w-48 animate-pulse rounded bg-charcoal-800" />

      <div className="mt-6 overflow-x-auto">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg border border-charcoal-700 bg-charcoal-800 p-4"
            >
              <div className="h-4 w-16 animate-pulse rounded bg-charcoal-700" />
              <div className="h-4 w-32 animate-pulse rounded bg-charcoal-700" />
              <div className="h-4 w-24 animate-pulse rounded bg-charcoal-700" />
              <div className="ml-auto h-4 w-12 animate-pulse rounded bg-charcoal-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
