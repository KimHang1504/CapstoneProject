"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  getQuestionsByTestType,
  getTestTypeById,
} from "@/api/admin/testtype/api";
import {
  TestQuestion,
  TestTypeDetail,
} from "@/api/admin/testtype/type";

export default function VersionQuestionsPage() {
  const params = useParams();

  const id = useMemo(() => Number(params?.id), [params?.id]);
  const version = useMemo(() => Number(params?.version), [params?.version]);

  const [testType, setTestType] = useState<TestTypeDetail | null>(null);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (Number.isNaN(id) || Number.isNaN(version)) {
        setError("ID hoặc version không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [testTypeRes, questionsRes] = await Promise.all([
          getTestTypeById(id),
          getQuestionsByTestType(id, version),
        ]);

        setTestType(testTypeRes.data);
        setQuestions(questionsRes.data);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Không tải được danh sách câu hỏi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, version]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/admin/testtype-management/${id}`}
          className="mb-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Quay lại chi tiết test type
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {testType?.name || "Danh sách câu hỏi"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Phiên bản {version}
          </p>
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            Đang tải danh sách câu hỏi...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && questions.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            Không có câu hỏi nào trong phiên bản này
          </div>
        )}

        {!loading && !error && questions.length > 0 && (
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Câu {question.orderIndex}
                  </span>

                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {question.dimension}
                  </span>

                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    {question.answerType}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      question.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {question.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </span>
                </div>

                <div className="mb-3 text-sm font-semibold text-slate-900">
                  {question.content}
                </div>

                <div className="space-y-2">
                  {question.answers
                    .slice()
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((answer) => (
                      <div
                        key={answer.id}
                        className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                      >
                        <div className="text-sm text-slate-700">
                          <span className="mr-2 font-semibold">
                            {answer.orderIndex}.
                          </span>
                          {answer.answerContent}
                        </div>

                        <div className="shrink-0 rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                          {answer.scoreKey}: {answer.scoreValue}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}