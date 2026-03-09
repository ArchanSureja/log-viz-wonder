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
    method: "Rule-Based + Embedding Similarity",
    description: "Uses embeddings to find similar module names among unknown logs, then applies existing rules to classify them.",
  },
  linux: {
    label: "Linux",
    method: "Clustering + Logistic Regression",
    description: "Clusters unknown logs to find new training data, then retrains the TF-IDF logistic regression model.",
  },
};

function generateApacheDiscoveries(): DiscoveryItem[] {
  const templates = [
    { pattern: `\\[error\\] \\[client .+\\] File does not exist: .+`, example: "[error] [client 192.168.1.1] File does not exist: /var/www/html/favicon.ico" },
    { pattern: `\\[notice\\] Apache/.+ configured -- resuming normal operations`, example: "[notice] Apache/2.4.41 configured -- resuming normal operations" },
    { pattern: `\\[warn\\] mod_ssl: .+ SSL library error`, example: "[warn] mod_ssl: OpenSSL SSL library error" },
    { pattern: `\\[error\\] \\[proxy\\] .+ connection refused`, example: "[error] [proxy] backend:8080 connection refused" },
    { pattern: `\\[info\\] \\[negotiation\\] no acceptable variant: .+`, example: "[info] [negotiation] no acceptable variant: /var/www/html/index" },
  ];

  return templates.map((t, i) => ({
    id: `apache-${i}`,
    type: "Regex Pattern",
    detail: t.pattern,
    confidence: 0.75 + Math.random() * 0.2,
    matchedLogs: Math.floor(20 + Math.random() * 180),
    status: "pending" as const,
  }));
}

function generateOpenStackDiscoveries(): DiscoveryItem[] {
  const modules = [
    { name: "nova.compute.resource_tracker", rule: "Resource tracking anomaly detection" },
    { name: "neutron.agent.dhcp", rule: "DHCP lease failure classification" },
    { name: "cinder.volume.drivers.lvm", rule: "LVM volume error pattern" },
    { name: "keystone.token.persistence", rule: "Token persistence warning" },
    { name: "glance.store.filesystem", rule: "Image store access pattern" },
    { name: "heat.engine.stack", rule: "Stack operation timeout detection" },
  ];

  return modules.map((m, i) => ({
    id: `openstack-${i}`,
    type: "Rule Mapping",
    detail: `${m.name} → ${m.rule}`,
    confidence: 0.7 + Math.random() * 0.25,
    matchedLogs: Math.floor(10 + Math.random() * 120),
    status: "pending" as const,
  }));
}

function generateLinuxDiscoveries(): DiscoveryItem[] {
  const clusters = [
    { label: "Kernel OOM events", size: 45 },
    { label: "systemd service restart loops", size: 78 },
    { label: "PAM authentication failures", size: 34 },
    { label: "disk I/O timeout patterns", size: 56 },
    { label: "network interface flapping", size: 23 },
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
