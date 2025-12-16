function PageSkeletonLoader() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="mb-6 flex items-center gap-2">
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="h-60 w-full bg-muted rounded-xl" />
            <div className="flex flex-col gap-5">
              <div className="h-6 w-1/2 bg-muted rounded" />
              <div className="h-4 w-1/3 bg-muted rounded mt-2" />
              <div className="flex gap-3 items-center mt-3">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-4 w-28 bg-muted rounded" />
              </div>
              <div className="h-20 w-full bg-muted rounded mt-4" />
            </div>
            <div>
              <div className="h-5 w-40 bg-muted rounded mb-6" />
              <div className="space-y-4">
                <div className="h-12 w-full bg-muted rounded" />
                <div className="h-12 w-full bg-muted rounded" />
              </div>
            </div>
          </div>
          <aside className="lg:col-span-1">
            <div className="rounded-xl border border-border p-5 sticky top-24 flex flex-col gap-8">
              <div className="h-8 w-20 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded mx-auto" />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default PageSkeletonLoader;
