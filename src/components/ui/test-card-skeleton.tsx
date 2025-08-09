import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const TestCardSkeleton = () => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-14" />
            </div>
          </div>
          <div className="flex space-x-2 pt-3">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const TestGridSkeleton = ({ count = 12 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <TestCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const PaginationSkeleton = () => {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-20" />
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-8 w-8" />
              ))}
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
