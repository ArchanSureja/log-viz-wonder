export type DiscoverySource = "apache" | "openstack" | "linux";

export type DiscoveryStatus = "idle" | "running" | "completed";

export type DiscoveryItem = {
  id: string;
  type: string;
  detail: string;
  confidence: number;
  matchedLogs: number;
  status: "pending" | "accepted" | "rejected";
};

export type DiscoveryResult = {
  source: DiscoverySource;
  totalUnknown: number;
  coveredByDiscovery: number;
  items: DiscoveryItem[];
  timestamp: string;
};

export const SOURCE_INFO: Record<DiscoverySource, { label: string; method: string; description: string }> = {
  apache: {
    label: "Apache",
    method: "Template Mining (Drain3)",
    description: "Runs Drain3 algorithm on unknown logs to discover new regex patterns for log classification.",
  },
  openstack: {
    label: "OpenStack",
    method: "Embedding Similarity",
    description: "Uses embeddings to find similar module names among unknown logs, then maps them to existing category rules.",
  },
  linux: {
    label: "Linux",
    method: "Clustering + Model Retraining",
    description: "Clusters unknown logs to find new training data, then retrains the TF-IDF logistic regression model.",
  },
};

function generateApacheDiscoveries(): DiscoveryItem[] {
  const templates = [
    { pattern: "proxy: error reading status line from remote server", category: "ERROR" },
    { pattern: "client denied by server configuration", category: "SECURITY" },
    { pattern: "server reached MaxRequestWorkers setting", category: "RESOURCE" },
    { pattern: "AH00094: Command line: '/usr/sbin/apache2'", category: "CONFIG" },
    { pattern: "mod_reqtimeout: request header timeout", category: "WARNING" },
  ];

  return templates.map((t, i) => ({
    id: `apache-${i}`,
    type: "Regex Pattern",
    detail: `${t.pattern} → ${t.category}`,
    confidence: 0.75 + Math.random() * 0.2,
    matchedLogs: Math.floor(20 + Math.random() * 180),
    status: "pending" as const,
  }));
}

function generateOpenStackDiscoveries(): DiscoveryItem[] {
  const modules = [
    { name: "nova.virt.libvirt.config", suggestedCategory: "Resource" },
    { name: "oslo_messaging._drivers.amqp", suggestedCategory: "Connectivity/Network" },
    { name: "cinder.volume.drivers.lvm", suggestedCategory: "Storage/IO" },
    { name: "keystone.token.persistence", suggestedCategory: "Access & Auth" },
    { name: "nova.api.openstack.compute", suggestedCategory: "Service Lifecycle" },
    { name: "heat.engine.stack", suggestedCategory: "Service Lifecycle" },
  ];

  return modules.map((m, i) => ({
    id: `openstack-${i}`,
    type: "Module → Category Mapping",
    detail: `${m.name} → ${m.suggestedCategory}`,
    confidence: 0.7 + Math.random() * 0.25,
    matchedLogs: Math.floor(10 + Math.random() * 120),
    status: "pending" as const,
  }));
}

function generateLinuxDiscoveries(): DiscoveryItem[] {
  const clusters = [
    { label: "Kernel OOM events → RESOURCE_HEALTH", size: 45 },
    { label: "systemd service restart loops → SYSTEM_BOOT", size: 78 },
    { label: "PAM authentication failures → SECURITY_CONTROL", size: 34 },
    { label: "disk I/O timeout patterns → STORAGE_IO", size: 56 },
    { label: "network interface flapping → NETWORK_SERVICE", size: 23 },
  ];

  return clusters.map((c, i) => ({
    id: `linux-${i}`,
    type: "Training Cluster",
    detail: `${c.label} (${c.size} samples)`,
    confidence: 0.65 + Math.random() * 0.3,
    matchedLogs: c.size + Math.floor(Math.random() * 50),
    status: "pending" as const,
  }));
}

export function runDiscovery(source: DiscoverySource): DiscoveryResult {
  const generators: Record<DiscoverySource, () => DiscoveryItem[]> = {
    apache: generateApacheDiscoveries,
    openstack: generateOpenStackDiscoveries,
    linux: generateLinuxDiscoveries,
  };

  const items = generators[source]();
  const totalUnknown = Math.floor(500 + Math.random() * 1500);
  const coveredByDiscovery = items.reduce((sum, item) => sum + item.matchedLogs, 0);

  return {
    source,
    totalUnknown,
    coveredByDiscovery: Math.min(coveredByDiscovery, totalUnknown),
    items,
    timestamp: new Date().toISOString(),
  };
}
