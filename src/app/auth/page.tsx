"use client";
import { useState } from "react";
import Link from "next/link";
import MascotPanel from "./components/mascot_panel";
import { login } from "@/api/auth/api";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/api/auth/type";
import { get } from "http";
import { getUserFromToken } from "@/utils/jwt";
import { apiClient } from "@/lib/api-client";
import toast from "react-hot-toast";

type UserPayload = {
    Role: string
}

export default function LoginPage() {
    const nav = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const rememberMe = true;


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const payload = { email, password, rememberMe };
        try {
            const res = await login(payload);
            const token = res.data.accessToken;
            apiClient.setAuthToken(token);

            document.cookie = `accessToken=${res.data.accessToken}; path=/; max-age=36000;Secure`;
            window.dispatchEvent(new Event('login'));

            const user = getUserFromToken(token);
            const role = user.role;
            if (role === "ADMIN") {
                nav.push("/admin");
            }
             else if (role === "VENUEOWNER") {
                nav.push("/venue/dashboard");
            } else if (role === "STAFF") {
                nav.push(`/staff/redeem?locationId=${user.assignedVenueLocationId}`);
            }
        } catch (error) {
            console.error("Error occurred while logging in:", error);
            toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin và thử lại.");
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#FDC5F5] via-[#B388EB] to-[#72DDF7] p-4 sm:p-6">

            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden max-w-5xl w-full">

                <MascotPanel
                    title="COUPLE MOOD"
                    subtitle="Đăng nhập để tiếp tục hành trình của bạn"
                />

                <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10">

                    <h1 className="text-2xl sm:text-3xl font-bold text-[#8093F1] mb-2">
                        Đăng nhập
                    </h1>

                    <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
                        Chào mừng bạn đến với Couple Mood
                    </p>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                        <div className="mb-4 sm:mb-5">
                            <label className="block mb-2 text-sm font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B388EB]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-5 sm:mb-6">
                            <label className="block mb-2 text-sm font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Nhập mật khẩu của bạn"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B388EB]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-2 py-3 rounded-xl font-semibold text-white 
                        bg-linear-to-r from-pink-400 via-purple-400 to-blue-400
                        hover:scale-[1.02] active:scale-[0.98]
                        transition-all duration-200 shadow-lg w-full cursor-pointer"
                        >
                            Đăng nhập
                        </button>
                    </form>
                    <div className="flex items-center gap-4 my-5 sm:my-6">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-sm text-gray-500">or</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">

                        <img
                            src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
                            alt="Google"
                            className="w-5 h-5"
                        />

                        <span className="font-medium text-sm sm:text-base">
                            Tiếp tục với Google
                        </span>

                    </button>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Chưa có tài khoản?
                        <Link href="/auth/register" className="text-[#8093F1] font-medium cursor-pointer ml-1">
                            Đăng ký
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
}