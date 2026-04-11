"use client";

import { useEffect, useState } from "react";
import { ChallengeConfigResponse } from "@/api/admin/type";
import { getChallengeConfig } from "@/api/admin/api";
import BackButton from "@/components/BackButton";

export default function ChallengeGuidePage() {
  const [config, setConfig] = useState<ChallengeConfigResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await getChallengeConfig();
      setConfig(res.data);
    };

    load();
  }, []);

  if (!config) {
    return (
      <div className="p-6 text-center text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">

      <BackButton />

      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          🎯 Hướng dẫn tạo Challenge
        </h1>
        <p className="text-gray-500">
          Tài liệu này giúp bạn hiểu cách tạo và cấu hình một challenge trong hệ thống.
        </p>
      </div>

      {/* STEP 1 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          1️⃣ Chọn loại nhiệm vụ
        </h2>

        <p className="text-gray-600 text-sm">
          Đây là hành động người dùng cần thực hiện để bắt đầu hoặc ghi nhận tiến độ.
        </p>

        <div className="border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-3 text-left">Mã</th>
                <th className="p-3 text-left">Mô tả</th>
              </tr>
            </thead>

            <tbody>
              {config.taskTypes.map((task) => (
                <tr key={task.code} className="border-t">
                  <td className="p-3 font-medium text-indigo-600">
                    {task.code}
                  </td>
                  <td className="p-3">
                    {task.label}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* STEP 2 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          2️⃣ Cách tính tiến độ
        </h2>

        <p className="text-gray-600 text-sm">
          Xác định hệ thống sẽ đo lường tiến độ challenge như thế nào.
        </p>

        <div className="border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-3 text-left">Mã</th>
                <th className="p-3 text-left">Mô tả</th>
              </tr>
            </thead>

            <tbody>
              {config.metrics.map((metric) => (
                <tr key={metric.code} className="border-t">
                  <td className="p-3 font-medium text-pink-600">
                    {metric.code}
                  </td>
                  <td className="p-3">
                    {metric.label}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* STEP 3 */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">
          3️⃣ Quy tắc cấu hình theo từng loại nhiệm vụ
        </h2>

        <p className="text-gray-600 text-sm">
          Một số loại nhiệm vụ cần thêm thông tin để hoạt động chính xác.
        </p>

        {Object.entries(config.rules).map(([taskType, rules]) => (
          <div
            key={taskType}
            className="border rounded-xl p-5 shadow-sm space-y-4"
          >
            <h3 className="font-semibold text-lg text-indigo-600">
              {taskType}
            </h3>

            {rules.length === 0 ? (
              <p className="text-gray-400 text-sm italic">
                Không cần cấu hình thêm
              </p>
            ) : (
              <div className="space-y-3">

                {rules.map((rule) => (
                  <div
                    key={rule.key}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="font-medium text-indigo-600">
                      {rule.key}
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                      {rule.label}
                    </p>

                    {/* OPTIONAL EXAMPLE */}
                    <p className="text-xs text-gray-400 mt-2 italic">
                      Ví dụ: Nhập giá trị phù hợp theo yêu cầu của nhiệm vụ
                    </p>
                  </div>
                ))}

              </div>
            )}
          </div>
        ))}
      </section>

    </div>
  );
}