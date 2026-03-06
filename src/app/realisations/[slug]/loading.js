export default function Loading() {
  return (
    <div className="min-h-screen bg-transparent text-[#d1d2d4] animate-pulse">
      <div className="mx-auto max-w-6xl px-5 py-8">

        {/* Retour */}
        <div className="h-4 w-16 rounded bg-white/10" />

        {/* Titre */}
        <div className="mt-4 space-y-2">
          <div className="h-7 w-56 rounded bg-white/10" />
          <div className="h-4 w-80 rounded bg-white/10" />
        </div>

        {/* Grille photos */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-2xl bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
