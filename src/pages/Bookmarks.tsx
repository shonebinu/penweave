export default function Bookmarks() {
  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Explore Playgrounds
        </h1>
        <p className="text-sm text-muted-foreground">
          Discover public playgrounds created by other users
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PlaygroundSkeleton key={i} />
          ))}
        </div>
      ) : playgrounds.length === 0 ? (
        <div className="flex h-80 flex-col items-center justify-center">
          <h3 className="text-lg font-medium">No public playgrounds found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or explore other playgrounds.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playgrounds.map((playground) => (
            <PublicPlaygroundCard
              key={playground.id}
              playground={playground}
              onToggleBookmark={handleToggleBookmark}
              onFork={handleForking}
              isOwner={user?.uid === playground.userId}
            />
          ))}
        </div>
      )}
    </main>
  );
}
