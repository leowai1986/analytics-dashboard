import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { regionBreakdown } from "@/data/mock";

export function RegionTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Regional Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-muted-foreground">Region</th>
                <th className="pb-3 font-medium text-muted-foreground text-right">Users</th>
                <th className="pb-3 font-medium text-muted-foreground text-right">Sessions</th>
                <th className="pb-3 font-medium text-muted-foreground text-right">Bounce Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {regionBreakdown.map((region) => (
                <tr key={region.region} className="group">
                  <td className="py-3 font-medium">{region.region}</td>
                  <td className="py-3 text-right tabular-nums text-muted-foreground">
                    {region.users.toLocaleString()}
                  </td>
                  <td className="py-3 text-right tabular-nums text-muted-foreground">
                    {region.sessions.toLocaleString()}
                  </td>
                  <td className="py-3 text-right tabular-nums">
                    <span
                      className={
                        region.bounceRate > 45
                          ? "text-red-600 font-medium"
                          : region.bounceRate > 40
                          ? "text-amber-600 font-medium"
                          : "text-emerald-600 font-medium"
                      }
                    >
                      {region.bounceRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
