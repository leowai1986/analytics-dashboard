import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Download, Calendar, TrendingUp } from "lucide-react";

const reports = [
  {
    title: "Monthly Revenue Report",
    description: "Comprehensive breakdown of all revenue streams",
    date: "Apr 2026",
    size: "2.4 MB",
    type: "PDF",
  },
  {
    title: "User Growth Analysis",
    description: "Quarterly user acquisition and retention metrics",
    date: "Q1 2026",
    size: "1.8 MB",
    type: "XLSX",
  },
  {
    title: "Traffic Source Report",
    description: "Detailed analysis of acquisition channels",
    date: "Mar 2026",
    size: "3.1 MB",
    type: "PDF",
  },
  {
    title: "Conversion Funnel Study",
    description: "End-to-end conversion rate optimization data",
    date: "Feb 2026",
    size: "1.2 MB",
    type: "PDF",
  },
];

const quickStats = [
  { label: "Reports Generated", value: "24", icon: FileText },
  { label: "Downloads", value: "1,432", icon: Download },
  { label: "This Month", value: "8", icon: Calendar },
  { label: "Avg. Growth", value: "+14%", icon: TrendingUp },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground mt-1">
          Generate, download, and manage your analytics reports.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.title} className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-xs text-muted-foreground">{report.date}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{report.size}</span>
                    <span className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium bg-primary text-primary-foreground">
                      {report.type}
                    </span>
                  </div>
                </div>
                <button className="flex h-9 w-9 items-center justify-center rounded-md border bg-transparent hover:bg-accent transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
