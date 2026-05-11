// Componente reutilizável de skeleton loader
export function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-[#E8F0E6] via-[#F0F5EE] to-[#E8F0E6] bg-[length:200%_100%] rounded ${className}`}
      style={{ animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%' }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E8F0E6]">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-1/3 rounded-full" />
        <Skeleton className="h-4 w-3/4 rounded-full" />
        <Skeleton className="h-5 w-1/4 rounded-full mt-2" />
      </div>
    </div>
  );
}

export function SkeletonCardTall() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E8F0E6]">
      <Skeleton className="h-64 w-full rounded-none" />
      <div className="p-3.5 space-y-2">
        <Skeleton className="h-3 w-3/4 rounded-full" />
        <Skeleton className="h-5 w-1/3 rounded-full" />
      </div>
    </div>
  );
}
