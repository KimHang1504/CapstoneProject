"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center
    bg-linear-to-br from-[#FDC5F5] via-[#B388EB] to-[#72DDF7]
    p-6 relative overflow-hidden">

            {/* floating hearts */}
            <div className="absolute top-20 left-16 text-white/40 text-3xl heart">❤</div>
            <div className="absolute bottom-24 right-16 text-white/30 text-2xl heart delay-200">❤</div>
            <div className="absolute top-40 right-24 text-white/20 text-xl heart delay-500">❤</div>
            <div className="absolute bottom-32 left-24 text-white/30 text-2xl heart delay-700">❤</div>
            <div className="absolute top-32 left-40 text-white/20 text-xl heart delay-1000">❤</div>

            {/* main card */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl
      p-10 max-w-lg w-full text-center">

                {/* icon */}
                <div className="flex justify-center mb-6">
                    <div className="p-5 rounded-full bg-linear-to-r
          from-[#F7AEF8] to-[#8093F1] shadow-lg">
                        <ShieldAlert size={40} className="text-white" />
                    </div>
                </div>

                {/* title */}
                <h1 className="text-4xl font-extrabold text-[#8093F1] mb-3">
                    403
                </h1>

                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Không có quyền truy cập
                </h2>

                <p className="text-gray-500 mb-8">
                    Bạn không có quyền truy cập vào trang này.
                    Nếu bạn nghĩ đây là lỗi, hãy liên hệ quản trị viên.
                </p>

                {/* actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">

                    <Link
                        href="/auth"
                        className="flex items-center justify-center gap-2
            px-5 py-3 rounded-xl font-semibold text-white
            bg-linear-to-r from-pink-400 via-purple-400 to-blue-400
            hover:scale-[1.03] active:scale-[0.97]
            transition-all shadow-md"
                    >
                        <ArrowLeft size={18} />
                        Quay trở lại
                    </Link>

                </div>
            </div>
        </div>
    );
}