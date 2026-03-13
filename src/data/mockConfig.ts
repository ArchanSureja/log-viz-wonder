// Apache: regex rules from Drain3 template mining
export interface ApacheRegexRule {
  id: string;
  pattern: string;
  category: string;
  isAbnormal: boolean;
  matchCount: number;
  enabled: boolean;
}

// OpenStack: module → category mapping rules
export interface OpenStackRule {
  id: string;
  moduleName: string;
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
  // ERROR (abnormal)
  { id: "ar-1", pattern: "File does not exist", category: "ERROR", isAbnormal: true, matchCount: 1243, enabled: true },
  { id: "ar-2", pattern: "script not found or unable to stat", category: "ERROR", isAbnormal: true, matchCount: 456, enabled: true },
  { id: "ar-3", pattern: "Factory error creating", category: "ERROR", isAbnormal: true, matchCount: 89, enabled: true },
  { id: "ar-4", pattern: "Can't create", category: "ERROR", isAbnormal: true, matchCount: 34, enabled: true },
  { id: "ar-5", pattern: "request failed: error reading the headers", category: "ERROR", isAbnormal: true, matchCount: 178, enabled: true },
  { id: "ar-6", pattern: "mod_jk child workerEnv in error state", category: "ERROR", isAbnormal: true, matchCount: 312, enabled: true },
  // SECURITY (abnormal)
  { id: "ar-7", pattern: "Directory index forbidden", category: "SECURITY", isAbnormal: true, matchCount: 567, enabled: true },
  { id: "ar-8", pattern: "attempt to invoke directory as script", category: "SECURITY", isAbnormal: true, matchCount: 123, enabled: true },
  { id: "ar-9", pattern: "Attempt to serve directory", category: "SECURITY", isAbnormal: true, matchCount: 45, enabled: true },
  { id: "ar-10", pattern: "Invalid .* in request", category: "SECURITY", isAbnormal: true, matchCount: 678, enabled: true },
  { id: "ar-11", pattern: "URI too long", category: "SECURITY", isAbnormal: true, matchCount: 23, enabled: false },
  { id: "ar-12", pattern: "uri must start with /", category: "SECURITY", isAbnormal: true, matchCount: 12, enabled: true },
  { id: "ar-13", pattern: "client sent HTTP/1\\.1 request without hostname", category: "SECURITY", isAbnormal: true, matchCount: 89, enabled: true },
  { id: "ar-14", pattern: "/xmlrpc\\.php", category: "SECURITY", isAbnormal: true, matchCount: 234, enabled: true },
  // RESOURCE (normal)
  { id: "ar-15", pattern: "child process .* still did not exit", category: "RESOURCE", isAbnormal: false, matchCount: 56, enabled: true },
  { id: "ar-16", pattern: "Creating \\d+ session mutexes", category: "RESOURCE", isAbnormal: false, matchCount: 34, enabled: true },
  // WARNING (abnormal)
  { id: "ar-17", pattern: "Can't find child .* in scoreboard", category: "WARNING", isAbnormal: true, matchCount: 189, enabled: true },
  { id: "ar-18", pattern: "LDAP: SSL support unavailable", category: "WARNING", isAbnormal: true, matchCount: 67, enabled: false },
  // CONFIG (normal)
  { id: "ar-19", pattern: "configured -- resuming", category: "CONFIG", isAbnormal: false, matchCount: 87, enabled: true },
  { id: "ar-20", pattern: "Graceful restart requested", category: "CONFIG", isAbnormal: false, matchCount: 45, enabled: true },
  { id: "ar-21", pattern: "mechanism enabled", category: "CONFIG", isAbnormal: false, matchCount: 23, enabled: true },
  { id: "ar-22", pattern: "generating secret for digest", category: "CONFIG", isAbnormal: false, matchCount: 12, enabled: true },
  // INFO (normal)
  { id: "ar-23", pattern: "Found child .* in scoreboard slot", category: "INFO", isAbnormal: false, matchCount: 345, enabled: true },
  { id: "ar-24", pattern: "workerEnv\\.init\\(\\) ok", category: "INFO", isAbnormal: false, matchCount: 123, enabled: true },
  { id: "ar-25", pattern: "mod_jk child init", category: "INFO", isAbnormal: false, matchCount: 89, enabled: true },
  { id: "ar-26", pattern: "mod_jk2 Shutting down", category: "INFO", isAbnormal: false, matchCount: 34, enabled: true },
  { id: "ar-27", pattern: "Digest: done", category: "INFO", isAbnormal: false, matchCount: 56, enabled: true },
  { id: "ar-28", pattern: "LDAP: Built with OpenLDAP", category: "INFO", isAbnormal: false, matchCount: 78, enabled: true },
];

export const mockOpenStackRules: OpenStackRule[] = [
  // Storage/IO
  { id: "os-1", moduleName: "cinder.service", category: "Storage/IO", enabled: true, matchCount: 2341 },
  { id: "os-2", moduleName: "cinder.volume.manager", category: "Storage/IO", enabled: true, matchCount: 1567 },
  { id: "os-3", moduleName: "cinder", category: "Storage/IO", enabled: true, matchCount: 890 },
  { id: "os-4", moduleName: "cinder.message.api", category: "Storage/IO", enabled: true, matchCount: 234 },
  { id: "os-5", moduleName: "nova.virt.libvirt.driver", category: "Storage/IO", enabled: true, matchCount: 456 },
  // Configuration
  { id: "os-6", moduleName: "oslo_config.cfg", category: "Configuration", enabled: true, matchCount: 123 },
  // Access & Auth
  { id: "os-7", moduleName: "keystonemiddleware.auth_token", category: "Access & Auth", enabled: true, matchCount: 8934 },
  { id: "os-8", moduleName: "oslo.privsep.daemon", category: "Access & Auth", enabled: true, matchCount: 312 },
  // Service Lifecycle
  { id: "os-9", moduleName: "eventlet.wsgi.server", category: "Service Lifecycle", enabled: true, matchCount: 5621 },
  { id: "os-10", moduleName: "oslo_concurrency.processutils", category: "Service Lifecycle", enabled: true, matchCount: 789 },
  { id: "os-11", moduleName: "oslo_concurrency.lockutils", category: "Service Lifecycle", enabled: true, matchCount: 345 },
  { id: "os-12", moduleName: "oslo_service.periodic_task", category: "Service Lifecycle", enabled: true, matchCount: 567 },
  { id: "os-13", moduleName: "nova.compute.manager", category: "Service Lifecycle", enabled: true, matchCount: 4321 },
  // Resource
  { id: "os-14", moduleName: "nova.compute.resource_tracker", category: "Resource", enabled: true, matchCount: 2345 },
  { id: "os-15", moduleName: "nova.compute.provider_tree", category: "Resource", enabled: true, matchCount: 1234 },
  { id: "os-16", moduleName: "nova.virt.libvirt.imagecache", category: "Resource", enabled: false, matchCount: 456 },
  { id: "os-17", moduleName: "nova.objects.instance", category: "Resource", enabled: true, matchCount: 3456 },
  // Connectivity/Network
  { id: "os-18", moduleName: "nova.scheduler.client.report", category: "Connectivity/Network", enabled: true, matchCount: 1890 },
  { id: "os-19", moduleName: "nova.network.neutronv2.api", category: "Connectivity/Network", enabled: true, matchCount: 2345 },
  { id: "os-20", moduleName: "nova.network.base_api", category: "Connectivity/Network", enabled: true, matchCount: 567 },
  { id: "os-21", moduleName: "neutronclient.v2_0.client", category: "Connectivity/Network", enabled: false, matchCount: 234 },
];

export const mockLinuxModels: LinuxModel[] = [
  { id: "lm-1", name: "LogReg TF-IDF v3", version: "3.2.1", accuracy: 94.7, trainedOn: "2026-02-15", datasetSize: 45000, active: true },
  { id: "lm-2", name: "LogReg TF-IDF v2", version: "2.1.0", accuracy: 91.2, trainedOn: "2025-11-03", datasetSize: 32000, active: false },
  { id: "lm-3", name: "LogReg TF-IDF v1", version: "1.0.0", accuracy: 87.5, trainedOn: "2025-08-20", datasetSize: 18000, active: false },
];

// Normal/Abnormal logic descriptions
export const classificationLogic = {
  apache: "Regex patterns classify logs into categories (ERROR, SECURITY, RESOURCE, WARNING, CONFIG, INFO). Abnormal: ERROR, SECURITY, WARNING. Normal: RESOURCE, CONFIG, INFO.",
  openstack: "Module name determines category (e.g. cinder.* → Storage/IO, nova.compute.manager → Service Lifecycle). Abnormal is determined by log level: ERROR, WARNING → Abnormal; INFO, DEBUG → Normal.",
  linux: "Logistic Regression on TF-IDF vectors classifies into SYSTEM_BOOT, RESOURCE_HEALTH, STORAGE_IO, NETWORK_SERVICE, SECURITY_CONTROL. Normal/Abnormal determined by log level.",
};
