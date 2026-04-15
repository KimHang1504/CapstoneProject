export default function VoucherSkeleton() {
    return (
        <div className="flex gap-5 rounded-2xl p-5 bg-white border border-violet-100 animate-pulse">

            <div className="w-32 h-32 rounded-xl bg-gray-200 shrink-0"></div>

            <div className="flex-1 flex flex-col justify-between">

                <div className="flex justify-between items-start gap-4">
                    <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                </div>

                <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>

                <div className="space-y-2 mt-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>

                <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>

                <div className="flex justify-between mt-3">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>

            </div>
        </div>
    );
}