import React from 'react';

const SkeletonBlock = ({ className = '' }) => (
  <div className={`bg-[#1A1A2E] rounded animate-pulse ${className}`} />
);

const TableSkeleton = ({ rows, cols }) => (
  <div className="w-full overflow-x-auto rounded-xl border border-[#6C63FF]/20">
    {/* Header */}
    <div className="flex items-center gap-4 px-6 py-4 border-b border-[#6C63FF]/10 bg-[#1A1A2E]/60">
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonBlock
          key={`header-${i}`}
          className={`h-4 rounded-md ${i === 0 ? 'w-1/4' : i === cols - 1 ? 'w-1/6' : 'flex-1'}`}
        />
      ))}
    </div>

    {/* Rows */}
    <div className="divide-y divide-[#6C63FF]/10">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={`row-${rowIdx}`}
          className="flex items-center gap-4 px-6 py-4 bg-[#0A0A0F] hover:bg-[#1A1A2E]/30 transition-colors"
        >
          {/* Avatar / Icon placeholder */}
          <div className="flex items-center gap-3 w-1/4 min-w-0">
            <SkeletonBlock className="h-9 w-9 rounded-full flex-shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <SkeletonBlock className="h-3 w-4/5 rounded" />
              <SkeletonBlock className="h-2.5 w-3/5 rounded" />
            </div>
          </div>

          {Array.from({ length: cols - 1 }).map((_, colIdx) => (
            <SkeletonBlock
              key={`cell-${rowIdx}-${colIdx}`}
              className={`h-3 rounded ${
                colIdx === cols - 2
                  ? 'w-20 rounded-full'
                  : 'flex-1'
              }`}
            />
          ))}
        </div>
      ))}
    </div>

    {/* Footer pagination */}
    <div className="flex items-center justify-between px-6 py-4 border-t border-[#6C63FF]/10 bg-[#1A1A2E]/40">
      <SkeletonBlock className="h-3 w-32 rounded" />
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={`page-${i}`} className="h-8 w-8 rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

const CardsSkeleton = ({ rows, cols }) => (
  <div
    className={`grid gap-4 sm:gap-6 ${
      cols === 1
        ? 'grid-cols-1'
        : cols === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : cols === 3
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : cols === 4
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }`}
  >
    {Array.from({ length: rows * cols }).map((_, i) => (
      <div
        key={`card-${i}`}
        className="bg-[#1A1A2E] border border-[#6C63FF]/15 rounded-2xl overflow-hidden animate-pulse"
      >
        {/* Card image/banner */}
        <SkeletonBlock className="h-40 w-full rounded-none bg-[#0A0A0F]/80" />

        <div className="p-5 space-y-4">
          {/* Badge */}
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-5 w-16 rounded-full bg-[#6C63FF]/20" />
            <SkeletonBlock className="h-5 w-5 rounded-full" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-4/5 rounded" />
            <SkeletonBlock className="h-3 w-3/5 rounded" />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <SkeletonBlock className="h-2.5 w-full rounded" />
            <SkeletonBlock className="h-2.5 w-5/6 rounded" />
            <SkeletonBlock className="h-2.5 w-4/6 rounded" />
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 pt-1">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={`stat-${i}-${j}`} className="flex items-center gap-1.5">
                <SkeletonBlock className="h-4 w-4 rounded bg-[#6C63FF]/20" />
                <SkeletonBlock className="h-3 w-10 rounded" />
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-[#6C63FF]/10" />

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SkeletonBlock className="h-7 w-7 rounded-full" />
              <SkeletonBlock className="h-3 w-20 rounded" />
            </div>
            <SkeletonBlock className="h-8 w-24 rounded-lg bg-[#6C63FF]/20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ListSkeleton = ({ rows, cols }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={`list-item-${i}`}
        className="flex items-center gap-4 px-5 py-4 bg-[#1A1A2E] border border-[#6C63FF]/15 rounded-xl animate-pulse hover:border-[#6C63FF]/25 transition-colors"
      >
        {/* Left indicator */}
        <SkeletonBlock className="h-10 w-1 rounded-full flex-shrink-0 bg-[#6C63FF]/30" />

        {/* Avatar */}
        <SkeletonBlock className="h-11 w-11 rounded-xl flex-shrink-0" />

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-3.5 w-36 rounded" />
            <SkeletonBlock className="h-4 w-14 rounded-full bg-[#00D4AA]/15" />
          </div>
          <SkeletonBlock className="h-2.5 w-64 max-w-full rounded" />
        </div>

        {/* Right side columns */}
        <div
          className={`hidden ${cols > 1 ? 'sm:flex' : 'hidden'} items-center gap-6`}
        >
          {Array.from({ length: Math.max(0, cols - 1) }).map((_, j) => (
            <div key={`meta-${i}-${j}`} className="text-right space-y-1.5">
              <SkeletonBlock className="h-2.5 w-16 rounded ml-auto" />
              <SkeletonBlock className="h-3 w-20 rounded ml-auto" />
            </div>
          ))}
        </div>

        {/* Action button */}
        <SkeletonBlock className="h-8 w-8 rounded-lg flex-shrink-0 bg-[#6C63FF]/20" />
      </div>
    ))}
  </div>
);

const LoadingSkeleton = ({ rows = 5, cols = 3, type = 'table' }) => {
  const safeRows = Math.max(1, Math.min(rows, 20));
  const safeCols = Math.max(1, Math.min(cols, 6));

  return (
    <div className="w-full bg-[#0A0A0F] min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-pulse">
        <div className="space-y-2">
          <SkeletonBlock className="h-6 w-48 rounded-lg" />
          <SkeletonBlock className="h-3.5 w-72 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-9 w-28 rounded-lg bg-[#6C63FF]/20" />
          <SkeletonBlock className="h-9 w-9 rounded-lg" />
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className="flex flex-wrap items-center gap-3 mb-6 animate-pulse">
        <SkeletonBlock className="h-9 w-56 rounded-lg" />
        <SkeletonBlock className="h-9 w-32 rounded-lg" />
        <SkeletonBlock className="h-9 w-32 rounded-lg" />
        <div className="flex-1 hidden sm:block" />
        <SkeletonBlock className="h-9 w-24 rounded-lg bg-[#00D4AA]/15" />
      </div>

      {/* Stats bar for cards/list */}
      {type !== 'table' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`stat-${i}`}
              className="bg-[#1A1A2E] border border-[#6C63FF]/15 rounded-xl p-4 animate-pulse"
            >
              <SkeletonBlock className="h-3 w-20 rounded mb-2" />
              <SkeletonBlock className="h-6 w-16 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Main content */}
      {type === 'table' && <TableSkeleton rows={safeRows} cols={safeCols} />}
      {type === 'cards' && <CardsSkeleton rows={safeRows} cols={safeCols} />}
      {type === 'list' && <ListSkeleton rows={safeRows} cols={safeCols} />}
    </div>
  );
};

export default LoadingSkeleton;