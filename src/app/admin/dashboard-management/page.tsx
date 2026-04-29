"use client";

import { DashboardRequest, DashboardStats } from "@/api/admin/type";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/api/admin/api";
import { CreditCard, DollarSign, MapPin, Users } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import StatCard from "@/app/admin/components/StatCard";
import ChartCard from "@/app/admin/components/ChartCard";
import DashboardSkeleton from "@/app/admin/components/DashboardSkeleton";


export default function Dashboard() {
  const [data, setData] = useState<DashboardStats>({} as DashboardStats);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);


  useEffect(() => {
    fetchData();
  }, [year, month]);

  const fetchData = async () => {
    setLoading(true);



    try {
      const request: DashboardRequest =
        month === 0
          ? { Year: year }
          : { Year: year, Month: month };

      const res = await getDashboardStats(request);

      if (res.code === 200) {
        setData(res.data);
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  const formatChartCurrency = (value: number) => {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "k";
    return value.toString();
  };

  const formatNumber = (value: number) => value.toString();

  return (
    <div >
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="p-6 space-y-6 min-h-screen bg-linear-to-br from-[#e7ebf9] via-[#fae6f5] to-[#d3e9fc]">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Tổng người dùng"
              value={data.totalUsers}
              icon={<Users size={20} />}
              color="#C4B5FD"
            />

            <StatCard
              title="Tổng địa điểm"
              value={data.totalVenueLocations}
              icon={<MapPin size={20} />}
              color="#A78BFA"
            />

            <StatCard
              title="Tổng doanh thu"
              value={formatCurrency(data.totalRevenue)}
              icon={<DollarSign size={20} />}
              color="#F0ABFC"
            />

            <StatCard
              title="Tổng giao dịch"
              value={data.totalTransactions}
              icon={<CreditCard size={20} />}
              color="#F9A8D4"
            />

          </div>

          <div className="py-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-700">
              Thống kê theo thời gian
            </h2>
            {/* LEFT */}
            <div className="flex items-center gap-4">


              {/* divider */}
              <div className="h-5 w-px bg-gray-200" />

              {/* Month */}
              <div className="relative">
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="appearance-none rounded-xl border border-purple-100 bg-white/70 backdrop-blur-md px-4 py-2 pr-10 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                >
                  <option value={0}>Tất cả</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>

                {/* custom arrow */}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 text-xs">
                  ▼
                </span>
              </div>

              {/* Year */}
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="appearance-none rounded-xl border border-pink-100 bg-white/70 backdrop-blur-md px-4 py-2 pr-10 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                >
                  {Array.from({ length: 5 }).map((_, i) => {
                    const y = new Date().getFullYear() - i;
                    return (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    );
                  })}
                </select>

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 text-xs">
                  ▼
                </span>
              </div>
              <button
                onClick={() => {
                  setMonth(new Date().getMonth() + 1);
                  setYear(new Date().getFullYear());
                }}
                className="text-sm cursor-pointer font-medium px-4 py-2 rounded-lg border border-purple-200 bg-gray-100 text-purple-600 hover:bg-purple-50 active:scale-95 transition"
              >
                Reset
              </button>
            </div>
          </div>

          <ChartCard
            title={
              month === 0
                ? `Doanh thu năm ${year}`
                : `Doanh thu tháng ${month}/${year}`
            }
            data={data.revenueChart}
            type="bar"
            color="#72DDF7"
            yFormatter={formatChartCurrency}
            yLabel="VNĐ"

          />


          <div className="grid gap-5 md:grid-cols-2">

            <ChartCard
              title="Tăng trưởng người dùng"
              data={data.userGrowthChart}
              type="line"
              color="#8093F1"
              yLabel="người"

            />

            <ChartCard
              title="Giao dịch"
              data={data.transactionChart}
              type="area"
              color="#B388EB"
              yLabel="giao dịch"
            />

          </div>


          <div className="grid gap-5 md:grid-cols-2">

            <ChartCard
              title="Tăng trưởng địa điểm"
              data={data.venueGrowthChart}
              type="bar"
              color="#F7AEF8"
              yLabel="địa điểm"
            />

            <ChartCard
              title="Hoạt động bài viết"
              data={data.postActivityChart}
              type="area"
              color="#FDC5F5"
              yLabel="bài viết"
            />

          </div>
        </div>
      )}
    </div>
  );
}