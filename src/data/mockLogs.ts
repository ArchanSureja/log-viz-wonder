export type LogEntry = {
  id: string;
  timestamp: string;
  source: "Apache" | "OpenStack" | "Linux";
  category: string;
  classification: "normal" | "abnormal";
  message: string;
};

export const LOG_SOURCES = ["All Sources", "Apache", "OpenStack", "Linux"] as const;
export type LogSource = (typeof LOG_SOURCES)[number];

// Apache categories from regex classifier
const apacheCategories: { category: string; abnormal: boolean; messages: string[] }[] = [
  { category: "ERROR", abnormal: true, messages: [
    "[Sun Mar 07 16:02:00 2004] [error] [client 64.242.88.10] File does not exist: /var/www/html/favicon.ico",
    "[Sun Mar 07 16:05:00 2004] [error] script not found or unable to stat: /var/www/cgi-bin/test",
    "[Sun Mar 07 16:10:00 2004] [error] Factory error creating connection pool",
    "[Sun Mar 07 16:15:00 2004] [error] request failed: error reading the headers",
    "[Sun Mar 07 16:20:00 2004] [error] mod_jk child workerEnv in error state 6",
  ]},
  { category: "SECURITY", abnormal: true, messages: [
    "[Sun Mar 07 16:25:00 2004] [error] [client 10.0.0.1] Directory index forbidden by rule: /var/www/html/",
    "[Sun Mar 07 16:30:00 2004] [error] [client 10.0.0.2] attempt to invoke directory as script: /var/www/cgi-bin/",
    "[Sun Mar 07 16:35:00 2004] [error] [client 10.0.0.3] Invalid URI in request GET /%00 HTTP/1.0",
    "[Sun Mar 07 16:40:00 2004] [error] [client 10.0.0.4] URI too long (exceeds max length)",
    "[Sun Mar 07 16:45:00 2004] [error] [client 10.0.0.5] /xmlrpc.php access attempt blocked",
  ]},
  { category: "RESOURCE", abnormal: false, messages: [
    "[Sun Mar 07 16:50:00 2004] [warn] child process 1234 still did not exit, sending a SIGTERM",
    "[Sun Mar 07 16:55:00 2004] [notice] Creating 256 session mutexes based on 150 max clients",
  ]},
  { category: "WARNING", abnormal: true, messages: [
    "[Sun Mar 07 17:00:00 2004] [warn] Can't find child 5678 in scoreboard",
    "[Sun Mar 07 17:05:00 2004] [warn] LDAP: SSL support unavailable: built/linked with OpenLDAP",
  ]},
  { category: "CONFIG", abnormal: false, messages: [
    "[Sun Mar 07 17:10:00 2004] [notice] Apache/2.4.41 configured -- resuming normal operations",
    "[Sun Mar 07 17:15:00 2004] [notice] Graceful restart requested, doing restart",
    "[Sun Mar 07 17:20:00 2004] [notice] Digest: generating secret for digest authentication",
    "[Sun Mar 07 17:25:00 2004] [notice] FIPS mode mechanism enabled",
  ]},
  { category: "INFO", abnormal: false, messages: [
    "[Sun Mar 07 17:30:00 2004] [notice] Found child 9012 in scoreboard slot 5",
    "[Sun Mar 07 17:35:00 2004] [notice] workerEnv.init() ok /etc/httpd/conf/workers2.properties",
    "[Sun Mar 07 17:40:00 2004] [notice] mod_jk child init 1 -2",
    "[Sun Mar 07 17:45:00 2004] [notice] Digest: done",
  ]},
];

// OpenStack categories from module-based classifier
const openstackCategories: { category: string; modules: string[]; levels: string[] }[] = [
  { category: "Storage/IO", modules: ["cinder.service", "cinder.volume.manager", "cinder", "cinder.message.api", "nova.virt.libvirt.driver"], levels: ["INFO", "ERROR", "WARNING"] },
  { category: "Configuration", modules: ["oslo_config.cfg"], levels: ["INFO", "WARNING"] },
  { category: "Access & Auth", modules: ["keystonemiddleware.auth_token", "oslo.privsep.daemon"], levels: ["INFO", "ERROR", "WARNING"] },
  { category: "Service Lifecycle", modules: ["eventlet.wsgi.server", "oslo_concurrency.processutils", "oslo_concurrency.lockutils", "oslo_service.periodic_task", "nova.compute.manager"], levels: ["INFO", "ERROR", "WARNING"] },
  { category: "Resource", modules: ["nova.compute.resource_tracker", "nova.compute.provider_tree", "nova.virt.libvirt.imagecache", "nova.objects.instance"], levels: ["INFO", "ERROR"] },
  { category: "Connectivity/Network", modules: ["nova.scheduler.client.report", "nova.network.neutronv2.api", "nova.network.base_api", "neutronclient.v2_0.client"], levels: ["INFO", "ERROR", "WARNING"] },
];

// Linux categories from logistic regression
const linuxCategories = ["SYSTEM_BOOT", "RESOURCE_HEALTH", "STORAGE_IO", "NETWORK_SERVICE", "SECURITY_CONTROL"];

function generateLogs(): LogEntry[] {
  const logs: LogEntry[] = [];

  // Generate Apache logs
  for (let i = 0; i < 80; i++) {
    const cat = apacheCategories[Math.floor(Math.random() * apacheCategories.length)];
    const msg = cat.messages[Math.floor(Math.random() * cat.messages.length)];
    const date = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    logs.push({
      id: `log-apache-${i}`,
      timestamp: date.toISOString(),
      source: "Apache",
      category: cat.category,
      classification: cat.abnormal ? "abnormal" : "normal",
      message: msg,
    });
  }

  // Generate OpenStack logs
  for (let i = 0; i < 80; i++) {
    const cat = openstackCategories[Math.floor(Math.random() * openstackCategories.length)];
    const mod = cat.modules[Math.floor(Math.random() * cat.modules.length)];
    const level = cat.levels[Math.floor(Math.random() * cat.levels.length)];
    const isAbnormal = level === "ERROR" || level === "WARNING";
    const date = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    logs.push({
      id: `log-openstack-${i}`,
      timestamp: date.toISOString(),
      source: "OpenStack",
      category: cat.category,
      classification: isAbnormal ? "abnormal" : "normal",
      message: `2026-03-07 12:00:00.000 1 ${level} ${mod} [req-abc-123] Operation completed`,
    });
  }

  // Generate Linux logs
  for (let i = 0; i < 80; i++) {
    const category = linuxCategories[Math.floor(Math.random() * linuxCategories.length)];
    const isAbnormal = Math.random() < 0.3;
    const date = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const sampleMessages: Record<string, string[]> = {
      SYSTEM_BOOT: ["kernel: [0.000000] Initializing cgroup subsys cpuset", "systemd[1]: Started target Basic System", "kernel: [0.500000] BIOS-provided physical RAM map"],
      RESOURCE_HEALTH: ["kernel: Out of memory: Kill process 1234", "kernel: CPU0: Core temperature above threshold", "systemd[1]: memory.max exceeded for /system.slice"],
      STORAGE_IO: ["kernel: [sda] Write Protect is off", "kernel: EXT4-fs error (device sda1): __ext4_get_inode_loc", "kernel: Buffer I/O error on dev sdb1"],
      NETWORK_SERVICE: ["NetworkManager[890]: <info> dhcp4: state changed", "sshd[1234]: Accepted publickey for user", "kernel: e1000: eth0 NIC Link is Up"],
      SECURITY_CONTROL: ["sshd[5678]: Failed password for invalid user admin", "PAM: authentication failure; logname= uid=0", "audit: USER_AUTH pid=1234 uid=0 auid=4294967295"],
    };
    const msgs = sampleMessages[category];
    logs.push({
      id: `log-linux-${i}`,
      timestamp: date.toISOString(),
      source: "Linux",
      category,
      classification: isAbnormal ? "abnormal" : "normal",
      message: msgs[Math.floor(Math.random() * msgs.length)],
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const mockLogs = generateLogs();

export type ChartDataPoint = {
  category: string;
  normal: number;
  abnormal: number;
};

export function getChartData(source: LogSource, filter: "all" | "normal" | "abnormal"): ChartDataPoint[] {
  const filtered = source === "All Sources" ? mockLogs : mockLogs.filter(l => l.source === source);

  const grouped: Record<string, { normal: number; abnormal: number }> = {};
  for (const log of filtered) {
    if (!grouped[log.category]) grouped[log.category] = { normal: 0, abnormal: 0 };
    grouped[log.category][log.classification]++;
  }

  return Object.entries(grouped).map(([category, counts]) => ({
    category,
    normal: filter === "abnormal" ? 0 : counts.normal,
    abnormal: filter === "normal" ? 0 : counts.abnormal,
  }));
}
