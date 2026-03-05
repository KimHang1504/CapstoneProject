'use client';
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState('');
    return (
        <div className='flex justify-center items-center h-screen gap-10'>
            <div>
                <div className='bg-white rounded-2xl w-96 p-10 flex flex-col gap-5'>
                    <h2 className='text-4xl font-semibold flex justify-center'>Đăng nhập</h2>
                    <form className='flex flex-col gap-5'>
                        <label className='text-black font-semibold'>
                            Email
                        </label>
                        <input type="text" placeholder='Email' className='border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-pink-400' />

                        <label className='text-black font-semibold'>
                            Mật khẩu
                        </label>

                        <input type="password" placeholder='Mật khẩu' className='border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-pink-400' />

                        <button type='submit' className='cursor-pointer bg-pink-400 text-white rounded-lg p-3 mt-5 hover:bg-pink-500 transition-colors'>
                            Đăng nhập
                        </button>
                    </form>
                    <div className='text-center text-pink-400 cursor-pointer'>
                        Quên mật khẩu?
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="text-sm text-gray-500">
                            Hoặc tiếp tục với
                        </span>
                        <div className="flex-1 h-px bg-gray-300" />
                    </div>
                    <div className='flex justify-between gap-5'>
                        <button className='border-2 border-gray-300 rounded-lg p-3 w-full flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors'>
                            <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="Google Icon" className='w-6 h-6' />
                            Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
