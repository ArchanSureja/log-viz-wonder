import { useState, useMemo, useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  DiscoverySource,
  DiscoveryStatus,
  DiscoveryResult,
  DiscoveryItem,
  SOURCE_INFO,
  runDiscovery,
} from "@/data/mockDiscovery";
import { NavLink } from "@/components/NavLink";
import {
  Search,
  Play,
  Loader2,
  Check,
  X,
  CheckCircle2,
  XCircle,
  Upload,
  Sparkles,
  Database,
  Target,
  BarChart3,
} from "lucide-react";

const Discovery = () => {
  const [source, setSource] = useState<DiscoverySource>("apache");
  const [status, setStatus] = useState<DiscoveryStatus>("idle");
  const [result, setResult] = useState<DiscoveryResult | null>(null);
  const [items, setItems] = useState<DiscoveryItem[]>([]);

  const handleRunDiscovery = useCallback(() => {
    setStatus("running");
    setResult(null);
    setItems([]);

    // Simulate async discovery
    setTimeout(() => {
      const discoveryResult = runDiscovery(source);
      setResult(discoveryResult);
      setItems(discoveryResult.items);
      setStatus("completed");
      toast.success(`Discovery completed for ${SOURCE_INFO[source].label}`);
    }, 2000);
  }, [source]);

  const handleItemAction = useCallback((id: string, action: "accepted" | "rejected") => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
  }, []);

  const handleAcceptAll = useCallback(() => {
    setItems((prev) => prev.map((item) => (item.status === "pending" ? { ...item, status: "accepted" } : item)));
    toast.success("All pending discoveries accepted");
  }, []);

  const handleRejectAll = useCallback(() => {
    setItems((prev) => prev.map((item) => (item.status === "pending" ? { ...item, status: "rejected" } : item)));
    toast.info("All pending discoveries rejected");
  }, []);

  const handleUpdateClassifier = useCallback(() => {
    const accepted = items.filter((i) => i.status === "accepted");
    if (accepted.length === 0) {
      toast.error("No accepted discoveries to update with");
      return;
    }
    toast.success(
      `Classification service updated with ${accepted.length} new ${SOURCE_INFO[source].label} discoveries`
    );
  }, [items, source]);

  const stats = useMemo(() => {
    const accepted = items.filter((i) => i.status === "accepted");
    const rejected = items.filter((i) => i.status === "rejected");
    const pending = items.filter((i) => i.status === "pending");
    const acceptedCoverage = accepted.reduce((s, i) => s + i.matchedLogs, 0);
    return { accepted: accepted.length, rejected: rejected.length, pending: pending.length, acceptedCoverage };
  }, [items]);

  const coveragePercent = result ? Math.round((result.coveredByDiscovery / result.totalUnknown) * 100) : 0;
  const acceptedCoveragePercent = result
    ? Math.round((stats.acceptedCoverage / result.totalUnknown) * 100)
    : 0;

  const info = SOURCE_INFO[source];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Search className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Discovery Service</h1>
              <p className="text-xs text-muted-foreground">Discover new classification patterns from unknown logs</p>
            </div>
          </div>
          <nav className="flex gap-1">
            <NavLink to="/" className="text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" activeClassName="bg-muted text-foreground">Dashboard</NavLink>
            <NavLink to="/discovery" className="text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" activeClassName="bg-muted text-foreground">Discovery</NavLink>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Source Selection & Trigger */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Configure Discovery
            </CardTitle>
            <CardDescription>Select a log source and trigger the discovery service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Source</label>
                <Select value={source} onValueChange={(v) => { setSource(v as DiscoverySource); setStatus("idle"); setResult(null); setItems([]); }}>
                  <SelectTrigger className="w-[200px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(SOURCE_INFO) as DiscoverySource[]).map((s) => (
                      <SelectItem key={s} value={s}>{SOURCE_INFO[s].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleRunDiscovery}
                disabled={status === "running"}
                className="gap-2"
              >
                {status === "running" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {status === "running" ? "Running Discovery..." : "Run Discovery"}
              </Button>
            </div>

            {/* Source Info Card */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mt-0.5">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{info.label} — {info.method}</p>
                  <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Running State */}
        {status === "running" && (
          <Card>
            <CardContent className="py-12 flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-semibold">Running Discovery on {info.label}...</p>
                <p className="text-sm text-muted-foreground mt-1">Analyzing unknown logs using {info.method}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {status === "completed" && result && (
          <>
            {/* Coverage Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Database className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-[var(--font-display)]">{result.totalUnknown}</p>
                    <p className="text-xs text-muted-foreground">Unknown Logs</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-[var(--font-display)]">{coveragePercent}%</p>
                    <p className="text-xs text-muted-foreground">Discovery Coverage</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-[var(--font-display)]">{stats.accepted}</p>
                    <p className="text-xs text-muted-foreground">Accepted</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-[var(--font-display)]">{stats.rejected}</p>
                    <p className="text-xs text-muted-foreground">Rejected</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coverage Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Coverage Analysis</CardTitle>
                <CardDescription>
                  How much of the unknown log dataset will be covered after accepting discoveries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Total Discovery Coverage</span>
                    <span className="font-semibold font-[var(--font-display)]">{coveragePercent}% ({result.coveredByDiscovery} / {result.totalUnknown} logs)</span>
                  </div>
                  <Progress value={coveragePercent} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Accepted Coverage</span>
                    <span className="font-semibold font-[var(--font-display)] text-success">{acceptedCoveragePercent}% ({stats.acceptedCoverage} / {result.totalUnknown} logs)</span>
                  </div>
                  <Progress value={acceptedCoveragePercent} className="h-2 [&>div]:bg-success" />
                </div>
              </CardContent>
            </Card>

            {/* Discovery Items */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-base">Discovered Patterns</CardTitle>
                  <CardDescription>{items.length} patterns found · {stats.pending} pending review</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleAcceptAll} disabled={stats.pending === 0} className="gap-1.5">
                    <Check className="h-3.5 w-3.5" /> Accept All
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRejectAll} disabled={stats.pending === 0} className="gap-1.5">
                    <X className="h-3.5 w-3.5" /> Reject All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-lg border p-4 transition-colors ${
                        item.status === "accepted"
                          ? "border-success/30 bg-success/5"
                          : item.status === "rejected"
                          ? "border-destructive/30 bg-destructive/5 opacity-60"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-[10px] font-[var(--font-display)]">
                              {item.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Confidence: <span className="font-semibold font-[var(--font-display)]">{Math.round(item.confidence * 100)}%</span>
                            </span>
                            <span className="text-xs text-muted-foreground">
                              · {item.matchedLogs} logs matched
                            </span>
                          </div>
                          <p className="text-sm font-[var(--font-display)] break-all leading-relaxed">{item.detail}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.status === "pending" ? (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-success hover:bg-success/10 hover:text-success"
                                onClick={() => handleItemAction(item.id, "accepted")}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => handleItemAction(item.id, "rejected")}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Badge
                              variant={item.status === "accepted" ? "default" : "destructive"}
                              className="text-[10px]"
                            >
                              {item.status === "accepted" ? "Accepted" : "Rejected"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Update Classifier */}
            <Card>
              <CardContent className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm">Update Classification Service</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Apply {stats.accepted} accepted discoveries to the {info.label} classifier
                  </p>
                </div>
                <Button
                  onClick={handleUpdateClassifier}
                  disabled={stats.accepted === 0}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Update Classifier
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default Discovery;
