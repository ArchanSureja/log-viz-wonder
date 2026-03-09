import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LogChart from "@/components/LogChart";
import LogTable from "@/components/LogTable";
import { LOG_SOURCES, LogSource, getChartData, mockLogs } from "@/data/mockLogs";
import { NavLink } from "@/components/NavLink";
import { Activity, Shield, AlertTriangle } from "lucide-react";

type FilterType = "all" | "normal" | "abnormal";

const Index = () => {
  const [source, setSource] = useState<LogSource>("All Sources");
  const [filter, setFilter] = useState<FilterType>("all");

  const chartData = useMemo(() => getChartData(source, filter), [source, filter]);

  const filteredLogs = useMemo(() => {
    let logs = source === "All Sources" ? mockLogs : mockLogs.filter(l => l.source === source);
    if (filter === "normal") logs = logs.filter(l => l.classification === "normal");
    if (filter === "abnormal") logs = logs.filter(l => l.classification === "abnormal");
    return logs;
  }, [source, filter]);

  const totalLogs = filteredLogs.length;
  const normalCount = filteredLogs.filter(l => l.classification === "normal").length;
  const abnormalCount = filteredLogs.filter(l => l.classification === "abnormal").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Log Classifier</h1>
              <p className="text-xs text-muted-foreground">Real-time log classification dashboard</p>
            </div>
          </div>
          <nav className="flex gap-1">
            <NavLink to="/" className="text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" activeClassName="bg-muted text-foreground" end>Dashboard</NavLink>
            <NavLink to="/discovery" className="text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" activeClassName="bg-muted text-foreground">Discovery</NavLink>
          </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4">
          <Select value={source} onValueChange={(v) => setSource(v as LogSource)}>
            <SelectTrigger className="w-[200px] bg-card">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {LOG_SOURCES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="Filter logs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Logs</SelectItem>
              <SelectItem value="normal">Normal Only</SelectItem>
              <SelectItem value="abnormal">Abnormal Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-[var(--font-display)]">{totalLogs}</p>
              <p className="text-xs text-muted-foreground">Total Logs</p>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold font-[var(--font-display)]">{normalCount}</p>
              <p className="text-xs text-muted-foreground">Normal</p>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold font-[var(--font-display)]">{abnormalCount}</p>
              <p className="text-xs text-muted-foreground">Abnormal</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Classification by Category
          </h2>
          <LogChart data={chartData} filter={filter} />
        </div>

        {/* Table */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Recent Logs
          </h2>
          <LogTable logs={filteredLogs} />
        </div>
      </main>
    </div>
  );
};

export default Index;
