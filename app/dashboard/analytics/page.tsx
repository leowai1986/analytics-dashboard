import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { VisitorsChart } from "@/components/charts/visitors-chart";
import { TrafficChart } from "@/components/charts/traffic-chart";
import { RegionTable } from "@/components/region-table";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground mt-1">
          Deep dive into your traffic, revenue, and regional performance.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue comparison year-over-year</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Breakdown by acquisition channel</CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Traffic</CardTitle>
          <CardDescription>Visitor volume across the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <VisitorsChart />
        </CardContent>
      </Card>

      <RegionTable />
    </div>
  );
}
