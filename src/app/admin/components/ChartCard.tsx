"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ChartItem = {
  label: string;
  value: number;
};

type ChartType = "line" | "bar" | "area";

type Props = {
  title: string;
  data: ChartItem[];
  type?: ChartType;
  color?: string;
};

export default function ChartCard({
  title,
  data,
  type = "line",
  color = "#8093F1",
}: Props) {
  const renderChart = () => {
    if (type === "bar") {
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />

          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
          />

          <YAxis tick={{ fontSize: 12 }} />

          <Tooltip />

          <Bar
            dataKey="value"
            fill={color}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      );
    }

    if (type === "area") {
      return (
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />

          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
          />

          <YAxis tick={{ fontSize: 12 }} />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill="url(#colorValue)"
            strokeWidth={3}
          />
        </AreaChart>
      );
    }

    return (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />

        <XAxis
          dataKey="label"
          tick={{ fontSize: 12 }}
        />

        <YAxis tick={{ fontSize: 12 }} />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-85 flex flex-col">
      <h3 className="font-semibold text-gray-700 mb-4">
        {title}
      </h3>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}