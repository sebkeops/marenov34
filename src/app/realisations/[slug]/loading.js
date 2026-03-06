export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#20313c]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-10 w-10 rounded-full border-4 border-white/20 border-t-white animate-spin" />
        <p className="text-sm font-medium text-white/60 tracking-wide">Chargement…</p>
      </div>
    </div>
  );
}
