import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartProps {
  data: Record<string, unknown>[];
  width?: number;
  height?: number;
}

export function BarChartComponent({
  data,
  height = 300,
}: ChartProps & { dataKey?: string; xKey?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#0066cc" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LineChartComponent({
  data,
  height = 300,
}: ChartProps & { dataKey?: string; xKey?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#0066cc"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

const COLORS = [
  "#0066cc",
  "#00a854",
  "#ff7a45",
  "#ffb500",
  "#722ed1",
  "#13c2c2",
];

export function PieChartComponent({
  data,
  height = 300,
}: ChartProps & { dataKey?: string; nameKey?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
          outerRadius={100}
          fill="#0066cc"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function GraduateComponent({
  label,
  value,
  color = "#0066cc",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="p-6 bg-surface-container-low rounded-lg">
      <p className="text-sm text-on-surface-variant mb-2">{label}</p>
      <p className="text-3xl font-bold mb-3" style={{ color }}>
        {value}%
      </p>
      <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
