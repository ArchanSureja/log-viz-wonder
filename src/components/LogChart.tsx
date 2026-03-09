import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartDataPoint } from "@/data/mockLogs";

interface LogChartProps {
  data: ChartDataPoint[];
  filter: "all" | "normal" | "abnormal";
}

const LogChart = ({ data, filter }: LogChartProps) => {
  return (
    <div className="w-full h-[400px] rounded-lg border border-border bg-card p-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="category"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontFamily: "var(--font-display)" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontFamily: "var(--font-display)" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              fontFamily: "var(--font-display)",
              fontSize: 13,
            }}
          />
          <Legend
            wrapperStyle={{ fontFamily: "var(--font-display)", fontSize: 13 }}
          />
          {filter !== "abnormal" && (
            <Bar dataKey="normal" name="Normal" fill="hsl(var(--chart-normal))" radius={[4, 4, 0, 0]} />
          )}
          {filter !== "normal" && (
            <Bar dataKey="abnormal" name="Abnormal" fill="hsl(var(--chart-abnormal))" radius={[4, 4, 0, 0]} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LogChart;
