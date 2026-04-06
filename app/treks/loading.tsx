export default function TreksLoading() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header skeleton */}
      <div className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="h-4 w-32 bg-slate-700 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-14 w-96 bg-slate-700 rounded-2xl mx-auto mb-6 animate-pulse" />
          <div className="h-6 w-80 bg-slate-800 rounded-xl mx-auto animate-pulse" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-6 px-8 text-center">
                <div className="h-9 w-16 bg-slate-100 rounded-lg mx-auto mb-2 animate-pulse" />
                <div className="h-3 w-24 bg-slate-100 rounded mx-auto animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="h-9 w-56 bg-slate-200 rounded-xl mb-12 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100"
              >
                <div className="h-72 bg-slate-200 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
