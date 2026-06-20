/**
 * Modern skeleton loaders with shimmer animation
 * Used for loading states in property cards
 */

export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm animate-pulse">
      {/* Image placeholder */}
      <div className="relative h-56 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />

      {/* Content placeholder */}
      <div className="flex flex-col gap-4 p-5">
        {/* Title */}
        <div className="h-4 w-3/4 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />

        {/* Location */}
        <div className="h-3 w-1/2 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />

        {/* Info row */}
        <div className="mt-2 flex gap-4">
          <div className="h-3 w-12 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
          <div className="h-3 w-12 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
          <div className="h-3 w-16 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
        </div>

        {/* Divider */}
        <div className="mt-4 h-px w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />

        {/* Price */}
        <div className="h-5 w-1/3 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
      </div>
    </div>
  );
}

export function LatestProjectCardSkeleton() {
  return (
    <div className="relative h-75 lg:h-85 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
  );
}

/**
 * CSS for shimmer animation - add this to globals.css
 * @keyframes shimmer {
 *   0% {
 *     background-position: 200% 0;
 *   }
 *   100% {
 *     background-position: -200% 0;
 *   }
 * }
 * 
 * .animate-shimmer {
 *   animation: shimmer 2s infinite;
 * }
 */
