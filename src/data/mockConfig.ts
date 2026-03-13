// Apache: regex rules from Drain3 template mining
export interface ApacheRegexRule {
  id: string;
  pattern: string;
  category: string;
  matchCount: number;
  enabled: boolean;
}

// OpenStack: module + log level rules
export interface OpenStackRule {
  id: string;
  moduleName: string;
  logLevel: string;
  category: string;
  enabled: boolean;
  matchCount: number;
}

// Linux: ML models
export interface LinuxModel {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  trainedOn: string;
  datasetSize: number;
  active: boolean;
}

export const mockApacheRules: ApacheRegexRule[] = [
  { id: "ar-1", pattern: "^\\[.*\\] \\[error\\] \\[client (.+)\\] File does not exist: (.+)$", category: "File Not Found", matchCount: 1243, enabled: true },
  { id: "ar-2", pattern: "^\\[.*\\] \\[notice\\] Apache/.* configured -- resuming normal operations$", category: "Server Start", matchCount: 87, enabled: true },
  { id: "ar-3", pattern: "^\\[.*\\] \\[error\\] \\[client (.+)\\] script not found: (.+)$", category: "Script Error", matchCount: 456, enabled: true },
  { id: "ar-4", pattern: "^\\[.*\\] \\[warn\\] mod_ssl: (.+)$", category: "SSL Warning", matchCount: 312, enabled: true },
  { id: "ar-5", pattern: "^\\[.*\\] \\[error\\] \\(13\\)Permission denied: (.+)$", category: "Permission Denied", matchCount: 189, enabled: false },
  { id: "ar-6", pattern: "^\\[.*\\] \\[notice\\] caught SIGTERM, shutting down$", category: "Server Shutdown", matchCount: 45, enabled: true },
  { id: "ar-7", pattern: "^\\[.*\\] \\[error\\] \\[client (.+)\\] Invalid URI in request (.+)$", category: "Invalid Request", matchCount: 678, enabled: true },
  { id: "ar-8", pattern: "^\\[.*\\] \\[crit\\] \\(98\\)Address already in use: (.+)$", category: "Port Conflict", matchCount: 12, enabled: false },
];

export const mockOpenStackRules: OpenStackRule[] = [
  { id: "os-1", moduleName: "nova.compute.manager", logLevel: "ERROR", category: "Compute Failure", enabled: true, matchCount: 234 },
  { id: "os-2", moduleName: "nova.compute.manager", logLevel: "INFO", category: "Compute Operation", enabled: true, matchCount: 5621 },
  { id: "os-3", moduleName: "neutron.agent.dhcp", logLevel: "WARNING", category: "DHCP Warning", enabled: true, matchCount: 145 },
  { id: "os-4", moduleName: "neutron.agent.dhcp", logLevel: "ERROR", category: "DHCP Failure", enabled: true, matchCount: 67 },
  { id: "os-5", moduleName: "keystone.auth", logLevel: "INFO", category: "Auth Event", enabled: true, matchCount: 8934 },
  { id: "os-6", moduleName: "keystone.auth", logLevel: "WARNING", category: "Auth Warning", enabled: false, matchCount: 312 },
  { id: "os-7", moduleName: "cinder.volume.manager", logLevel: "ERROR", category: "Volume Error", enabled: true, matchCount: 89 },
  { id: "os-8", moduleName: "cinder.volume.manager", logLevel: "INFO", category: "Volume Operation", enabled: true, matchCount: 2341 },
  { id: "os-9", moduleName: "glance.api", logLevel: "ERROR", category: "Image API Error", enabled: false, matchCount: 23 },
  { id: "os-10", moduleName: "glance.api", logLevel: "INFO", category: "Image API Request", enabled: true, matchCount: 1567 },
];

export const mockLinuxModels: LinuxModel[] = [
  { id: "lm-1", name: "LogReg TF-IDF v3", version: "3.2.1", accuracy: 94.7, trainedOn: "2026-02-15", datasetSize: 45000, active: true },
  { id: "lm-2", name: "LogReg TF-IDF v2", version: "2.1.0", accuracy: 91.2, trainedOn: "2025-11-03", datasetSize: 32000, active: false },
  { id: "lm-3", name: "LogReg TF-IDF v1", version: "1.0.0", accuracy: 87.5, trainedOn: "2025-08-20", datasetSize: 18000, active: false },
];

// Normal/Abnormal logic descriptions
export const classificationLogic = {
  apache: "Normal/Abnormal is determined by log level: [notice], [info] → Normal; [error], [crit], [warn] → Abnormal",
  openstack: "Category is determined by module name. Normal/Abnormal is determined by log level: INFO → Normal; WARNING, ERROR, CRITICAL → Abnormal",
  linux: "Classification uses Logistic Regression on TF-IDF vectors. Normal/Abnormal is determined by log level in the log message",
};
