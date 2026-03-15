"use client";

import {
  LineChart,
  Line,
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

type Props = {
  title: string;
  data: ChartItem[];
};

export default function ChartCard({ title, data }: Props) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 h-85">

      <h3 className="font-semibold text-gray-700 mb-4">
        {title}
      </h3>

      <ResponsiveContainer width="100%" height="100%">
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
            stroke="#8093F1"
            strokeWidth={3}
            dot={false}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}