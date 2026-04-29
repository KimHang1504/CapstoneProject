export default function VoucherPagination({
    page,
    totalPages,
    setPage,
}: {
    page: number;
    totalPages: number;
    setPage: (p: number) => void;
}) {
    return (
        <div className="flex justify-center gap-3 mt-6">
            <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 cursor-pointer rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50 disabled:opacity-40"
            >
                Prev
            </button>

            <span className="px-4 py-2 font-medium text-violet-600">
                {page} / {totalPages}
            </span>

            <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 cursor-pointer rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50 disabled:opacity-40"
            >
                Next
            </button>
        </div>
    );
}