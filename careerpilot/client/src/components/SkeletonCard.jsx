export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-soft border border-ink/10 p-6">
      <div className="skeleton h-6 w-3/4 mb-4"></div>
      <div className="skeleton h-4 w-1/2 mb-3"></div>
      <div className="space-y-2">
        <div className="skeleton h-3 w-full"></div>
        <div className="skeleton h-3 w-5/6"></div>
      </div>
    </div>
  );
}
