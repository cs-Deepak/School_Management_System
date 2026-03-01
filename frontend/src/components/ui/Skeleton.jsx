import React from "react";
import { cn } from "../../utils/cn";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200/60", className)}
      {...props}
    />
  );
};

export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex bg-gray-50/50 p-4 rounded-xl border-b border-gray-100">
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1 mx-2" />
        ))}
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex p-4 border-b border-gray-50 items-center">
          <Skeleton className="h-10 w-10 rounded-full mr-4" />
          <div className="flex-1 flex gap-4">
            {[...Array(columns - 1)].map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
