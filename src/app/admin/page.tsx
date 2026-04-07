"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

type Item = {
    title: string;
    desc: string;
    href: string;
    image: string;
    className?: string;
};

export default function AdminHome() {
    const router = useRouter();

    const items: Item[] = [
        {
            title: "Quản lý bài kiểm tra tính cách",
            desc: "Tạo, chỉnh sửa và theo dõi các bài test dành cho người dùng.",
            href: "/admin/testtype-management",
            image: "/testtype.png",
            className: "col-span-2",
        },
        {
            title: "Quản lý sự kiện đặc biệt",
            desc: "Tạo chiến dịch, event marketing và ưu đãi theo thời điểm.",
            href: "/admin/special-event-management",
            image: "/event.png",
        },
        {
            title: "Quản lý thử thách",
            desc: "Thiết lập thử thách, theo dõi tiến độ và phần thưởng.",
            href: "/admin/challenge",
            image: "/challenge.png",
            className: "row-span-2 sm:row-span-1 lg:row-span-2",
        },
        {
            title: "Quản lý danh mục",
            desc: "Quản lý các danh mục nội dung và phân loại hệ thống.",
            href: "/admin/category-management",
            image: "/category.png",
        },
        {
            title: "Quản lý giao dịch",
            desc: "Theo dõi lịch sử giao dịch, thanh toán và doanh thu.",
            href: "/admin/transaction-management",
            image: "/transaction.png",
        },
    ];

    return (
        <div className="p-6 min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-rose-50">

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Trang quản lý hệ thống
                </h1>
                <p className="text-gray-500 mt-2">
                    Điều hướng nhanh đến các chức năng quản lý
                </p>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[200px]">

                {items.map((item, index) => {
                    const isChallenge = item.title === "Quản lý thử thách";

                    return (
                        <div
                            key={index}
                            onClick={() => router.push(item.href)}
                            className={`group relative overflow-hidden rounded-2xl p-5 
                            bg-white/80 backdrop-blur-md border border-purple-100
                            hover:border-purple-300
                            shadow-sm hover:shadow-xl hover:-translate-y-1
                            transition-all duration-300 cursor-pointer
                            ${isChallenge ? "" : "grid grid-cols-[1.2fr_1fr] gap-4 items-center"}
                            ${item.className || ""}`}
                        >
                            {/* glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 
                            bg-linear-to-br from-purple-200/50 via-pink-200/50 to-transparent" />

                            {isChallenge ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover rounded-xl transition-transform duration-700 group-hover:scale-110"
                                    />

                                    <div className="absolute inset-0 bg-linear-to-t from-purple-900/70 via-purple-700/30 to-transparent rounded-xl" />

                                    <div className="absolute bottom-0 p-5 text-white">
                                        <h2 className="text-xl font-semibold mb-1">
                                            {item.title}
                                        </h2>
                                        <p className="text-sm text-purple-100">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* TEXT */}
                                    <div className="z-10">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-2 
                                        group-hover:text-purple-600 transition">
                                            {item.title}
                                        </h2>

                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {item.desc}
                                        </p>

                                        <span className="text-sm font-medium text-purple-600 mt-3 inline-block 
                                        opacity-80 group-hover:opacity-100">
                                            Xem chi tiết →
                                        </span>
                                    </div>

                                    {/* IMAGE */}
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}

                {/* CONFIG */}
                <div
                    className="col-span-1 sm:col-span-2 relative overflow-hidden rounded-2xl p-6 
                    bg-linear-to-r from-purple-400 to-pink-400 text-white
                    flex justify-between items-center
                    shadow-md hover:shadow-xl hover:-translate-y-1 transition"
                >
                    <div>
                        <h2 className="text-lg font-semibold">
                            Cấu hình hệ thống
                        </h2>
                        <p className="text-sm text-purple-100">
                            Thiết lập thông số và quyền truy cập
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/admin/config-management")}
                        className="bg-white cursor-pointer text-purple-600 px-4 py-2 rounded-full hover:bg-purple-100 transition"
                    >
                        Setup
                    </button>
                </div>

            </div>
        </div>
    );
}