"use client";
import Link from "next/link";
import { Baloo_Chettan_2 } from "next/font/google";
import { usePathname } from "next/navigation";
import mascot from "../../../public/mascot.png";

export const balooChettan = Baloo_Chettan_2({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    return (
        <div className="relative min-h-screen overflow-hidden bg-pink-50">
            <img
                src="https://cdn.dribbble.com/userupload/42123188/file/original-84301e86d34d3aa94e057b8aa871561e.jpg?resize=400x300&vertical=center"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110"
            />

            <div className="relative z-10 flex min-h-screen items-center justify-center gap-30">
                <div className="relative flex flex-col items-center text-center px-20 py-14">
                    <div className="flex flex-col gap-4 items-center relative">
                        {/* Bong bóng lớn */}
                        <div className="relative flex flex-col items-center text-center px-16 py-10">
                            <div className="absolute inset-0 bg-pink-200/60 backdrop-blur-md rounded-full shadow-lg" />

                            <h1 className={`relative z-10 text-6xl text-white font-bold ${balooChettan.className}`}>
                                COUPLE MOOD
                            </h1>

                            <div className={`relative z-10 mt-2 text-2xl text-white ${balooChettan.className}`}>
                                Chọn đúng mood, đi đúng chỗ
                            </div>

                            <div className={`relative z-10 mt-4 text-white text-base ${balooChettan.className}`}>
                                Nếu bạn chưa có tài khoản thì có thể
                            </div>
                            <Link href="/auth/register" className={`relative z-10 text-white underline font-medium text-base mt-1 ${balooChettan.className}`}>
                                Đăng ký tại đây
                            </Link>
                        </div>

                        <div className="absolute top-[42%] left-[70%] -translate-x-10 w-8 h-8 bg-pink-200/60 backdrop-blur-md rounded-full shadow-md" />

                        <div className="absolute top-[50%] left-[65%] -translate-x-4 w-5 h-5 bg-pink-200/60 backdrop-blur-md rounded-full shadow-sm" />

                        {/* Mascot */}
                        <img
                            src={mascot.src}
                            alt="Mascot"
                            className="w-170 h-auto -mt-4 select-none pointer-events-none"
                        />
                    </div>

                </div>
                {children}
            </div>
        </div>
    );
}
