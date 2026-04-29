import { MetricCard } from "@/components/metric-card";
import { ActivityFeed } from "@/components/activity-feed";
import { RegionTable } from "@/components/region-table";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { VisitorsChart } from "@/components/charts/visitors-chart";
import { TrafficChart } from "@/components/charts/traffic-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { overviewMetrics } from "@/data/mock";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground mt-1">
          Track your key performance metrics and recent activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewMetrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <TrafficChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <VisitorsChart />
          </CardContent>
        </Card>

        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      <RegionTable />
    </div>
  );
}
