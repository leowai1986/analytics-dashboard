import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, UserCheck, UserPlus, UserX } from "lucide-react";

const customerStats = [
  { title: "Total Customers", value: "12,450", icon: Users, change: "+8.2%" },
  { title: "Active Now", value: "1,230", icon: UserCheck, change: "+12.1%" },
  { title: "New This Month", value: "340", icon: UserPlus, change: "+5.4%" },
  { title: "Churned", value: "28", icon: UserX, change: "-2.1%" },
];

const recentCustomers = [
  { name: "Alice Morgan", email: "alice@example.com", plan: "Enterprise", status: "Active", joined: "2 days ago" },
  { name: "Bob Chen", email: "bob@example.com", plan: "Pro", status: "Active", joined: "5 days ago" },
  { name: "Carla Diaz", email: "carla@example.com", plan: "Starter", status: "Trial", joined: "1 week ago" },
  { name: "Daniel Kim", email: "daniel@example.com", plan: "Pro", status: "Active", joined: "2 weeks ago" },
  { name: "Eva Patel", email: "eva@example.com", plan: "Enterprise", status: "Active", joined: "3 weeks ago" },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <p className="text-muted-foreground mt-1">
          Manage your customer base and track engagement.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {customerStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change} from last month</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Customers</CardTitle>
          <CardDescription>Latest signups and their subscription status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Name</th>
                  <th className="pb-3 font-medium text-muted-foreground">Email</th>
                  <th className="pb-3 font-medium text-muted-foreground">Plan</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentCustomers.map((customer) => (
                  <tr key={customer.email} className="group">
                    <td className="py-3 font-medium">{customer.name}</td>
                    <td className="py-3 text-muted-foreground">{customer.email}</td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        customer.plan === "Enterprise"
                          ? "bg-purple-50 text-purple-700"
                          : customer.plan === "Pro"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-50 text-gray-700"
                      }`}>
                        {customer.plan}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        customer.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-muted-foreground">{customer.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
