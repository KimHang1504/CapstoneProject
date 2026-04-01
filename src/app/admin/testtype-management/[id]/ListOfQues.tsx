import { TestQuestion } from "@/api/admin/testtype/type";

type ListOfQuesProps = {
  questions: TestQuestion[];
  loading: boolean;
};

export default function ListOfQues({
  questions,
  loading,
}: ListOfQuesProps) {
  if (loading) {
    return (
      <div className="text-sm text-slate-500">
        Đang tải danh sách câu hỏi...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-sm text-slate-500">
        Không có câu hỏi nào trong phiên bản này
      </div>
    );
  }

  return (
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
  );
}