import { MetricCard, ChartData, ActivityItem, RegionData } from "@/types";

export const overviewMetrics: MetricCard[] = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: 20.1,
    trend: "up",
    description: "From last month",
  },
  {
    title: "Active Users",
    value: "2,350",
    change: 15.3,
    trend: "up",
    description: "From last month",
  },
  {
    title: "Bounce Rate",
    value: "42.3%",
    change: -5.2,
    trend: "down",
    description: "From last month",
  },
  {
    title: "Avg. Session",
    value: "4m 32s",
    change: 8.7,
    trend: "up",
    description: "From last month",
  },
];

export const revenueData: ChartData[] = [
  { name: "Jan", value: 4000, secondary: 2400 },
  { name: "Feb", value: 3000, secondary: 1398 },
  { name: "Mar", value: 2000, secondary: 9800 },
  { name: "Apr", value: 2780, secondary: 3908 },
  { name: "May", value: 1890, secondary: 4800 },
  { name: "Jun", value: 2390, secondary: 3800 },
  { name: "Jul", value: 3490, secondary: 4300 },
  { name: "Aug", value: 4200, secondary: 5100 },
  { name: "Sep", value: 3800, secondary: 4700 },
  { name: "Oct", value: 5100, secondary: 6200 },
  { name: "Nov", value: 4800, secondary: 5800 },
  { name: "Dec", value: 6200, secondary: 7500 },
];

export const trafficSourceData: ChartData[] = [
  { name: "Direct", value: 35 },
  { name: "Organic", value: 28 },
  { name: "Referral", value: 18 },
  { name: "Social", value: 12 },
  { name: "Email", value: 7 },
];

export const weeklyVisitors: ChartData[] = [
  { name: "Mon", value: 1200 },
  { name: "Tue", value: 1900 },
  { name: "Wed", value: 1600 },
  { name: "Thu", value: 2100 },
  { name: "Fri", value: 2400 },
  { name: "Sat", value: 1800 },
  { name: "Sun", value: 1400 },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "1",
    action: "Published new campaign",
    user: "Sarah Chen",
    timestamp: "2 minutes ago",
    status: "completed",
  },
  {
    id: "2",
    action: "Updated user permissions",
    user: "Marcus Johnson",
    timestamp: "15 minutes ago",
    status: "completed",
  },
  {
    id: "3",
    action: "Server maintenance scheduled",
    user: "System",
    timestamp: "1 hour ago",
    status: "pending",
  },
  {
    id: "4",
    action: "Payment gateway integration",
    user: "Elena Rodriguez",
    timestamp: "3 hours ago",
    status: "failed",
  },
  {
    id: "5",
    action: "Analytics report generated",
    user: "David Kim",
    timestamp: "5 hours ago",
    status: "completed",
  },
];

export const regionBreakdown: RegionData[] = [
  { region: "North America", users: 12450, sessions: 38920, bounceRate: 38.2 },
  { region: "Europe", users: 8930, sessions: 27100, bounceRate: 41.5 },
  { region: "Asia Pacific", users: 6720, sessions: 19800, bounceRate: 45.1 },
  { region: "Latin America", users: 3100, sessions: 9200, bounceRate: 52.3 },
  { region: "Middle East", users: 1850, sessions: 5400, bounceRate: 48.7 },
];
