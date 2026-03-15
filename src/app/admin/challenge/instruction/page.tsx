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

  if (!config) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <BackButton />
      <h1 className="text-3xl font-bold">
        Hướng dẫn tạo Challenge
      </h1>

      {/* TASK TYPES */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          1. Trigger Event (Loại nhiệm vụ)
        </h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Code</th>
              <th className="border p-2">Ý nghĩa</th>
            </tr>
          </thead>

          <tbody>
            {config.taskTypes.map((task) => (
              <tr key={task.code}>
                <td className="border p-2 font-medium">
                  {task.code}
                </td>

                <td className="border p-2">
                  {task.label}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </section>

      {/* METRICS */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          2. Goal Metric (Cách tính tiến độ)
        </h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Code</th>
              <th className="border p-2">Ý nghĩa</th>
            </tr>
          </thead>

          <tbody>
            {config.metrics.map((metric) => (
              <tr key={metric.code}>
                <td className="border p-2 font-medium">
                  {metric.code}
                </td>

                <td className="border p-2">
                  {metric.label}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </section>


      {/* RULES */}
      <section className="space-y-6">

        <h2 className="text-xl font-semibold">
          3. Quy tắc theo từng loại nhiệm vụ
        </h2>

        {Object.entries(config.rules).map(([taskType, rules]) => (

          <div key={taskType} className="border rounded-lg p-4">

            <h3 className="font-semibold mb-3">
              {taskType}
            </h3>

            {rules.length === 0 ? (

              <p className="text-gray-500 text-sm">
                Không có rule bổ sung
              </p>

            ) : (

              <table className="w-full border text-sm">

                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Key</th>
                    <th className="border p-2">Label</th>
                    <th className="border p-2">Type</th>
                  </tr>
                </thead>

                <tbody>

                  {rules.map((rule) => (

                    <tr key={rule.key}>
                      <td className="border p-2 font-medium">
                        {rule.key}
                      </td>

                      <td className="border p-2">
                        {rule.label}
                      </td>

                      <td className="border p-2">
                        {rule.type}
                      </td>
                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

        ))}

      </section>

    </div>
  );
}