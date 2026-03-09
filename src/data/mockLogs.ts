export type LogEntry = {
  id: string;
  timestamp: string;
  source: string;
  category: string;
  classification: "normal" | "abnormal";
  message: string;
};

export const LOG_SOURCES = ["All Sources", "Auth Service", "API Gateway", "Database", "Payment Service", "Scheduler"] as const;
export type LogSource = (typeof LOG_SOURCES)[number];

const categories = ["Authentication", "Request", "Query", "Transaction", "Timeout", "Error", "Connection", "Validation"];

function generateLogs(): LogEntry[] {
  const logs: LogEntry[] = [];
  const sources = LOG_SOURCES.filter(s => s !== "All Sources");

  for (let i = 0; i < 200; i++) {
    const source = sources[Math.floor(Math.random() * sources.length)];
    const isAbnormal = Math.random() < 0.3;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const date = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);

    logs.push({
      id: `log-${i}`,
      timestamp: date.toISOString(),
      source,
      category,
      classification: isAbnormal ? "abnormal" : "normal",
      message: isAbnormal
        ? `[WARN] Unexpected ${category.toLowerCase()} pattern detected in ${source}`
        : `[INFO] ${category} completed successfully in ${source}`,
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
