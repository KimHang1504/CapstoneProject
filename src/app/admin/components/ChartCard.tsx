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
  TooltipProps,
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

  yFormatter?: (value: number) => string;
  yLabel?: string;
};

const CustomTooltip = ({ active, payload, yLabel }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value as number;
    
    // Format based on yLabel
    let formattedValue = value.toLocaleString("vi-VN");
    
    if (yLabel === "VNĐ") {
      formattedValue = formattedValue + " đ";
    } else if (yLabel === "người") {
      formattedValue = formattedValue + " người";
    } else if (yLabel === "giao dịch") {
      formattedValue = formattedValue + " giao dịch";
    } else if (yLabel === "địa điểm") {
      formattedValue = formattedValue + " địa điểm";
    } else if (yLabel === "bài viết") {
      formattedValue = formattedValue + " bài viết";
    }

    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
        <p className="text-xs font-medium text-slate-600 mb-1">{payload[0].payload.label}</p>
        <p className="text-sm font-bold text-slate-800">
          {formattedValue}
        </p>
      </div>
    );
  }

  return null;
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
            allowDecimals={false}
          />

          <Tooltip content={<CustomTooltip yLabel={yLabel} />} />

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
            allowDecimals={false}
          />

          <Tooltip content={<CustomTooltip yLabel={yLabel} />} />

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
          allowDecimals={false}
        />

        <Tooltip content={<CustomTooltip yLabel={yLabel} />} />

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