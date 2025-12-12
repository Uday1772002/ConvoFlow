"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function MessageSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`flex gap-3 ${i % 2 === 0 ? "flex-row-reverse" : ""}`}
        >
          <Skeleton className="h-8 w-8 rounded-full" />
          <div
            className={`flex flex-col gap-2 max-w-[70%] ${
              i % 2 === 0 ? "items-end" : "items-start"
            }`}
          >
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-16 w-64 rounded-2xl" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
