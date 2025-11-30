import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function GameCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full h-48" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </CardFooter>
    </Card>
  );
}

