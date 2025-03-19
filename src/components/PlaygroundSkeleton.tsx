import { Card, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlaygroundSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-40 w-full" />
      <CardFooter className="flex justify-between p-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </CardFooter>
    </Card>
  );
}
