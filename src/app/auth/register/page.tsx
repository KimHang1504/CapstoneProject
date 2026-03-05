import React from "react";

export default function Register() {
    return (
        <div className="bg-white rounded-2xl w-96 p-10 flex flex-col gap-5 max-h-[100vh] overflow-y-auto no-scrollbar">
            <h2 className="text-4xl font-semibold text-center">Đăng ký</h2>

            <form className="flex flex-col gap-3">
                <label className="text-black font-semibold">Tên người dùng</label>
                <input
                    type="text"
                    placeholder="Tên người dùng"
                    className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-pink-400"
                />

                <label className="text-black font-semibold">Email</label>
                <input
                    type="text"
                    placeholder="Email"
                    className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-pink-400"
                />

                <label className="text-black font-semibold">Số điện thoại</label>
                <input
                    type="text"
                    placeholder="Số điện thoại"
                    className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-pink-400"
                />

                <label className="text-black font-semibold">Mật khẩu</label>
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-pink-400"
                />

                <label className="text-black font-semibold">Xác nhận Mật khẩu</label>
                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-pink-400"
                />

                <button
                    type="submit"
                    className="cursor-pointer bg-pink-400 text-white rounded-lg p-3 mt-2 hover:bg-pink-500 transition-colors"
                >
                    Đăng ký
                </button>
            </form>
        </div>
    );
}
