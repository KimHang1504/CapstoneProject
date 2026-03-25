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

  yFormatter?: (value: number) => string; // 👈 thêm
  yLabel?: string; // 👈 thêm
};

export default function ChartCard({
  title,
  data,
  type = "line",
  color = "#8093F1",
  yFormatter,
  yLabel
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

          <YAxis
            tickFormatter={yFormatter}
            width={60}
          />

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

          <YAxis
            tickFormatter={yFormatter}
            width={60}
          />

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

        <YAxis
          tickFormatter={yFormatter}
          width={60}
        />

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
    <div className="bg-white rounded-2xl border border-gray-200 p-6 h-85 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-5 rounded bg-indigo-400"></div>
        <h3 className="text-lg font-semibold text-gray-800">
          {title}
        </h3>
      </div>

      <div className="flex-1 flex flex-col">
        {yLabel && (
          <div className="text-xs font-medium text-gray-500 mb-2 ml-10">
            {yLabel}
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}