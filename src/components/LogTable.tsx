import { LogEntry } from "@/data/mockLogs";
import { Badge } from "@/components/ui/badge";

interface LogTableProps {
  logs: LogEntry[];
}

const LogTable = ({ logs }: LogTableProps) => {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted">
            <tr className="text-left font-[var(--font-display)] text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Source</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.slice(0, 50).map((log) => (
              <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-[var(--font-display)] text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{log.source}</td>
                <td className="px-4 py-3 whitespace-nowrap">{log.category}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={log.classification === "normal" ? "default" : "destructive"}
                    className={log.classification === "normal" ? "bg-success text-success-foreground hover:bg-success/90" : ""}
                  >
                    {log.classification}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs font-[var(--font-display)] max-w-xs truncate">
                  {log.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogTable;
