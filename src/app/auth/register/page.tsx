"use client";

import Link from "next/link";
import { useState } from "react";
import mascot from "../../../../public/mascot.png";
import Image from "next/image";
import MascotPanel from "../components/mascot_panel";

export default function RegisterPage() {

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        businessName: "",
        phoneNumber: "",
        address: ""
    });

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Password không khớp");
            return;
        }

        console.log(form);
    };

    return (
        <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-[#FDC5F5] via-[#B388EB] to-[#72DDF7] p-4">

            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden max-w-6xl w-full">

                <MascotPanel
                    title="COUPLE MOOD"
                    subtitle="Quản lý địa điểm – Tạo nên khoảnh khắc cho các cặp đôi"
                />

                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl 
      p-6 sm:p-8 w-full md:w-1/2">

                    <h1 className="text-3xl font-bold text-[#8093F1] mb-2">
                        Tạo tài khoản mới
                    </h1>

                    <p className="text-gray-500 mb-6">
                        Đăng ký tài khoản cho doanh nghiệp của bạn
                    </p>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium">Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="example@email.com"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#B388EB] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Tên Doanh Nghiệp</label>
                            <input
                                name="businessName"
                                placeholder="Tên doanh nghiệp của bạn"
                                value={form.businessName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#B388EB] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Số Điện Thoại</label>
                            <input
                                name="phoneNumber"
                                placeholder="0123456789"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#B388EB] outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium">Địa Chỉ</label>
                            <input
                                name="address"
                                placeholder="Địa chỉ doanh nghiệp của bạn"
                                value={form.address}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#B388EB] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Mật khẩu</label>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#B388EB] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Xác nhận mật khẩu</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#B388EB] outline-none"
                            />
                        </div>

                        <div className="md:col-span-2 mt-2">
                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400
              hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-200 shadow-lg cursor-pointer"
                            >
                                Tạo Tài Khoản
                            </button>
                        </div>

                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Bạn đã có tài khoản?
                        <Link href="/auth/" className="text-[#8093F1] font-medium cursor-pointer ml-1">
                            Đăng nhập
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}