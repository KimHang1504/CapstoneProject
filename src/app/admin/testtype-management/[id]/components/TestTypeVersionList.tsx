import Link from "next/link";

type VersionItem = {
    version: number;
    totalQuestions: number;
};

type Props = {
    testTypeId: number;
    currentVersion: number;
    versions: VersionItem[];
    activatingVersion: number | null;
    onActivate: (version: number) => void;
};

export default function TestTypeVersionList({
    testTypeId,
    currentVersion,
    versions,
    activatingVersion,
    onActivate,
}: Props) {
    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-900">
                    Danh sách phiên bản
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                    Quản lý các phiên bản bộ câu hỏi và chọn phiên bản đang áp dụng.
                </p>
            </div>

            <div className="p-4 md:p-5">
                {versions.length === 0 ? (
                    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100 px-4 py-8 text-center">
                        <div className="text-base font-semibold text-slate-800">
                            Chưa có phiên bản nào
                        </div>
                        <div className="mt-2 text-sm text-slate-600">
                            Hãy tạo phiên bản mới để bắt đầu quản lý bộ câu hỏi.
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {versions.map((version) => {
                            const isCurrent = version.version === currentVersion;
                            const isActivating = activatingVersion === version.version;

                            return (
                                <div
                                    key={version.version}
                                    className={`rounded-2xl border px-5 py-4 transition-all duration-200 ${isCurrent
                                        ? "border-pink-400 bg-pink-50 shadow-sm"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                        }`}
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="text-base font-semibold text-slate-900">
                                                    Phiên bản {version.version}
                                                </div>
                                                {/* 
                        {isCurrent && (
                          <span className="inline-flex items-center rounded-full bg-pink-600 px-3 py-1 text-xs font-semibold text-white">
                            Đang áp dụng
                          </span>
                        )} */}
                                            </div>

                                            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                                                <span className="inline-flex h-8 items-center rounded-full bg-slate-200 px-3 font-medium text-slate-800">
                                                    {version.totalQuestions} câu hỏi
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 flex-col gap-2">
                                            <Link
                                                href={`/admin/testtype-management/${testTypeId}/versions/${version.version}`}
                                                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
                                            >
                                                Xem câu hỏi
                                                <span className="ml-2 text-slate-500">→</span>
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => !isCurrent && onActivate(version.version)}
                                                disabled={isActivating || isCurrent}
                                                className={`inline-flex cursor-pointer h-10 items-center justify-center rounded-xl px-4 text-sm font-medium shadow-sm transition
                                                        ${isCurrent
                                                        ? "bg-green-600 text-white cursor-default"
                                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                                    }
                                                    ${isActivating ? "opacity-60 cursor-not-allowed" : ""}
                                                    `}
                                            >
                                                {isCurrent
                                                    ? "Đang áp dụng"
                                                    : isActivating
                                                        ? "Đang áp dụng..."
                                                        : "Áp dụng"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}