import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { Activity, Settings, ToggleLeft, Check, X, Info, Database, Brain, Regex } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  mockApacheRules, mockOpenStackRules, mockLinuxModels, classificationLogic,
  type ApacheRegexRule, type OpenStackRule, type LinuxModel,
} from "@/data/mockConfig";

const Configuration = () => {
  const [apacheRules, setApacheRules] = useState<ApacheRegexRule[]>(mockApacheRules);
  const [openStackRules, setOpenStackRules] = useState<OpenStackRule[]>(mockOpenStackRules);
  const [linuxModels, setLinuxModels] = useState<LinuxModel[]>(mockLinuxModels);
  const [hasChanges, setHasChanges] = useState(false);

  const toggleApacheRule = (id: string) => {
    setApacheRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    setHasChanges(true);
  };

  const toggleOpenStackRule = (id: string) => {
    setOpenStackRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    setHasChanges(true);
  };

  const activateModel = (id: string) => {
    setLinuxModels(prev => prev.map(m => ({ ...m, active: m.id === id })));
    setHasChanges(true);
  };

  const saveChanges = () => {
    setHasChanges(false);
    toast.success("Configuration saved", { description: "Classification service updated successfully." });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Log Classifier</h1>
              <p className="text-xs text-muted-foreground">Classification service configuration</p>
            </div>
          </div>
          <nav className="flex gap-1">
            <NavLink to="/" className="text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" activeClassName="bg-muted text-foreground" end>Dashboard</NavLink>
            <NavLink to="/discovery" className="text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" activeClassName="bg-muted text-foreground">Discovery</NavLink>
            <NavLink to="/configuration" className="text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" activeClassName="bg-muted text-foreground">Configuration</NavLink>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Save bar */}
        {hasChanges && (
          <div className="flex items-center justify-between bg-warning/10 border border-warning/30 rounded-lg px-4 py-3">
            <p className="text-sm font-medium text-foreground">You have unsaved configuration changes.</p>
            <Button onClick={saveChanges} size="sm" className="gap-1.5">
              <Check className="h-4 w-4" /> Save & Apply
            </Button>
          </div>
        )}

        <Tabs defaultValue="apache" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="apache" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Regex className="h-3.5 w-3.5" /> Apache
            </TabsTrigger>
            <TabsTrigger value="openstack" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Database className="h-3.5 w-3.5" /> OpenStack
            </TabsTrigger>
            <TabsTrigger value="linux" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Brain className="h-3.5 w-3.5" /> Linux
            </TabsTrigger>
          </TabsList>

          {/* Apache Tab */}
          <TabsContent value="apache" className="space-y-4">
            <div className="flex items-start gap-2 bg-muted/50 border border-border rounded-lg p-3">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Regular Expression Rules (Drain3 Template Mining)</p>
                <p className="text-xs text-muted-foreground mt-0.5">{classificationLogic.apache}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {apacheRules.filter(r => r.enabled).length} of {apacheRules.length} rules active
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              {apacheRules.map(rule => (
                <div key={rule.id} className={`flex items-center gap-4 px-4 py-3 transition-opacity ${!rule.enabled ? "opacity-50" : ""}`}>
                  <Switch checked={rule.enabled} onCheckedChange={() => toggleApacheRule(rule.id)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs font-mono shrink-0">{rule.category}</Badge>
                      <Badge variant={rule.isAbnormal ? "destructive" : "secondary"} className="text-[10px]">
                        {rule.isAbnormal ? "Abnormal" : "Normal"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{rule.matchCount.toLocaleString()} matches</span>
                    </div>
                    <code className="text-xs text-muted-foreground font-mono block truncate">{rule.pattern}</code>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* OpenStack Tab */}
          <TabsContent value="openstack" className="space-y-4">
            <div className="flex items-start gap-2 bg-muted/50 border border-border rounded-lg p-3">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Rule-Based Classification (Module + Log Level)</p>
                <p className="text-xs text-muted-foreground mt-0.5">{classificationLogic.openstack}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {openStackRules.filter(r => r.enabled).length} of {openStackRules.length} rules active
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-4 px-4 py-2 bg-muted/50 text-xs font-medium text-muted-foreground border-b border-border">
                <span>Active</span>
                <span>Module Name</span>
                <span>Category</span>
                <span className="text-right">Matches</span>
              </div>
              <div className="divide-y divide-border">
                {openStackRules.map(rule => (
                  <div key={rule.id} className={`grid grid-cols-[auto_1fr_auto_auto] gap-x-4 items-center px-4 py-3 transition-opacity ${!rule.enabled ? "opacity-50" : ""}`}>
                    <Switch checked={rule.enabled} onCheckedChange={() => toggleOpenStackRule(rule.id)} />
                    <code className="text-sm font-mono truncate">{rule.moduleName}</code>
                    <Badge variant="outline" className="text-xs">{rule.category}</Badge>
                    <span className="text-xs text-muted-foreground text-right">{rule.matchCount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Linux Tab */}
          <TabsContent value="linux" className="space-y-4">
            <div className="flex items-start gap-2 bg-muted/50 border border-border rounded-lg p-3">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Logistic Regression on TF-IDF Vectors</p>
                <p className="text-xs text-muted-foreground mt-0.5">{classificationLogic.linux}</p>
              </div>
            </div>

            <div className="grid gap-4">
              {linuxModels.map(model => (
                <div key={model.id} className={`bg-card border rounded-lg p-4 transition-all ${model.active ? "border-primary ring-1 ring-primary/20" : "border-border"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-sm">{model.name}</span>
                      <Badge variant="outline" className="text-xs">v{model.version}</Badge>
                      {model.active && (
                        <Badge className="text-xs bg-success text-success-foreground">Active</Badge>
                      )}
                    </div>
                    {!model.active && (
                      <Button variant="outline" size="sm" onClick={() => activateModel(model.id)} className="gap-1.5">
                        <ToggleLeft className="h-3.5 w-3.5" /> Activate
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                      <p className="font-mono font-semibold">{model.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Trained On</p>
                      <p className="font-mono">{model.trainedOn}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Dataset Size</p>
                      <p className="font-mono">{model.datasetSize.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Configuration;
