import { ReactNode } from "react";

type Props = {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
};

export default function StatCard({ title, value, icon, color }: Props) {
  const radius = 24;
  const offset = 40; // hoặc dynamic sau

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">

      {/* gradient light */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 blur-6xl rounded-full opacity-70 group-hover:scale-125 transition"
        style={{ backgroundColor: color, opacity: 0.5 }}
      />

      {/* noise */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />

      <div className="relative flex items-center justify-between">

        {/* TEXT */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
            {title}
          </p>

          <div className="relative inline-block mt-2">
            <p className="relative text-3xl font-bold text-gray-900 tabular-nums z-10">
              {value}
            </p>

            <span
              className="absolute left-0 bottom-1 h-3 w-full rounded-md blur-sm opacity-80 group-hover:h-4 transition-all duration-300"
            />
          </div>
        </div>

        {/* ICON + CIRCLE */}
        <div className="relative">
          {/* glow */}
          <div
            className="absolute inset-0 rounded-full blur-xl scale-110 opacity-70 group-hover:scale-125 transition"
            style={{ backgroundColor: color, opacity: 0.5 }}
          />

          <div className="relative w-14 h-14">
            <svg className="w-full h-full">

              {/* background */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                stroke="#eee"
                strokeWidth="4"
                fill="none"
              />

              {/* progress */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                stroke={color}
                strokeWidth="4"
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* icon */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ color }}
            >
              {icon}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}