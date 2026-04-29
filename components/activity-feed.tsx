import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { recentActivity } from "@/data/mock";
import { cn } from "@/lib/utils";

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-emerald-600", label: "Completed", variant: "default" as const },
  pending: { icon: Clock, color: "text-amber-600", label: "Pending", variant: "secondary" as const },
  failed: { icon: XCircle, color: "text-red-600", label: "Failed", variant: "destructive" as const },
};

export function ActivityFeed() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivity.map((item) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;

          return (
            <div key={item.id} className="flex items-start gap-3">
              <div className={cn("mt-0.5", config.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{item.action}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{item.user}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                </div>
              </div>
              <Badge variant={config.variant} className="text-[10px]">
                {config.label}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
