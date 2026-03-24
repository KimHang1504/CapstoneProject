import { ReactNode } from "react";

type Props = {
  title: string;
  value: number | string;
  icon: ReactNode;
};

export default function StatCard({ title, value, icon }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-gray-200 hover:shadow-lg transition">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <p className="text-2xl font-bold mt-1">
            {value}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[#B388EB] text-white">
          {icon}
        </div>

      </div>


    </div>
  );
}