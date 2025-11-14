import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SubjectCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
          </div>
          <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-6 bg-muted rounded w-32 animate-pulse" />
      </CardContent>
    </Card>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-32 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-16 bg-muted rounded animate-pulse" />
          <div className="h-16 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    </div>
  );
}
