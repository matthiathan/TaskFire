import { cn } from '@/src/lib/utils';

interface SkeletonProps {
  className?: string;
  key?: string | number;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/5",
        className
      )}
    />
  );
}

export function TaskListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 flex justify-between items-center">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-[400px] rounded-3xl" />
        <div className="space-y-6">
          <Skeleton className="h-[300px] rounded-3xl" />
          <Skeleton className="h-[200px] rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
