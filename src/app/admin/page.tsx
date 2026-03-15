"use client";

import { DashboardRequest, DashboardStats } from "@/api/admin/type";
import ChartCard from "./components/ChartCard";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/api/admin/api";
import { CreditCard, DollarSign, MapPin, Users } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import StatCard from "./components/StatCard";
import DashboardSkeleton from "./components/DashboardSkeleton";


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


  return (
    <div>
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Tổng người dùng"
              value={data.totalUsers}
              icon={<Users size={20} />}
            />

            <StatCard
              title="Tổng địa điểm"
              value={data.totalVenueLocations}
              icon={<MapPin size={20} />}
            />

            <StatCard
              title="Tổng doanh thu"
              value={formatCurrency(data.totalRevenue)}
              icon={<DollarSign size={20} />}
            />

            <StatCard
              title="Tổng giao dịch"
              value={data.totalTransactions}
              icon={<CreditCard size={20} />}
            />

          </div>

          <div className="flex items-center gap-5">

            <h2 className="text-lg font-semibold text-gray-700">
              Thống kê theo thời gian
            </h2>

            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 text-sm bg-white shadow-sm"
            >
              <option value={0}>Tất cả</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 text-sm bg-white shadow-sm"
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

            <button
              onClick={() => {
                setMonth(new Date().getMonth() + 1);
                setYear(new Date().getFullYear());
              }}
              className="border rounded-lg px-3 py-2 text-sm bg-white shadow-sm cursor-pointer"
            >
              Reset
            </button>

          </div>

          <ChartCard
            title={
              month === 0
                ? `Doanh thu năm ${year}`
                : `Doanh thu ${month}/${year}`
            }
            data={data.revenueChart}
          />


          <div className="grid gap-5 md:grid-cols-2">

            <ChartCard
              title="Tăng trưởng người dùng"
              data={data.userGrowthChart}
            />

            <ChartCard
              title="Giao dịch"
              data={data.transactionChart}
            />

          </div>


          <div className="grid gap-5 md:grid-cols-2">

            <ChartCard
              title="Tăng trưởng địa điểm"
              data={data.venueGrowthChart}
            />

            <ChartCard
              title="Hoạt động bài viết"
              data={data.postActivityChart}
            />

          </div>
        </div>
      )}
    </div>
  );
}