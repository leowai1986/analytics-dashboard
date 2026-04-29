export interface MetricCard {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  description: string;
}

export interface ChartData {
  name: string;
  value: number;
  secondary?: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

export interface RegionData {
  region: string;
  users: number;
  sessions: number;
  bounceRate: number;
}
