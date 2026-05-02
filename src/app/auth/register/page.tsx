"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import MascotPanel from "../components/mascot_panel";
import { register, sendRegistrationOtp, verifyRegistrationOtp } from "@/api/auth/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Mail, KeyRound, Loader2 } from "lucide-react";

type Step = "form" | "otp";

export default function RegisterPage() {
    const nav = useRouter();

    // ── form state ──────────────────────────────────────────────────────────
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        businessName: "",
        phoneNumber: "",
        address: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // ── OTP state ────────────────────────────────────────────────────────────
    const [step, setStep] = useState<Step>("form");
    const [otpCode, setOtpCode] = useState("");
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ── helpers ──────────────────────────────────────────────────────────────
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!form.email) newErrors.email = "Vui lòng nhập email";
        if (!form.businessName) newErrors.businessName = "Vui lòng nhập tên doanh nghiệp";
        if (!form.phoneNumber) newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
        if (!form.address) newErrors.address = "Vui lòng nhập địa chỉ";
        if (!form.password) newErrors.password = "Vui lòng nhập mật khẩu";
        if (!form.confirmPassword) newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
        if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu không khớp";
        }
        return newErrors;
    };

    // ── step 1: validate form → send OTP ────────────────────────────────────
    const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = validateForm();
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setIsSendingOtp(true);
        try {
            await sendRegistrationOtp({ email: form.email });
            toast.success("Mã OTP đã được gửi đến email của bạn!");
            setOtpCode("");
            setStep("otp");
        } catch (error: any) {
            const message = error.response?.data?.message || error.message;
            if (error.response?.status === 400) {
                toast.error(message || "Email đã được sử dụng hoặc không hợp lệ.");
            } else if (message) {
                toast.error(message);
            } else {
                toast.error("Gửi OTP thất bại. Vui lòng thử lại.");
            }
        } finally {
            setIsSendingOtp(false);
        }
    };

    // ── step 2a: resend OTP ──────────────────────────────────────────────────
    const handleResendOtp = async () => {
        setIsSendingOtp(true);
        try {
            await sendRegistrationOtp({ email: form.email });
            toast.success("Mã OTP mới đã được gửi đến email của bạn!");
        } catch (error: any) {
            const message = error.response?.data?.message || error.message;
            toast.error(message || "Gửi lại OTP thất bại. Vui lòng thử lại.");
        } finally {
            setIsSendingOtp(false);
        }
    };

    // ── step 2b: verify OTP → register ──────────────────────────────────────
    const handleVerifyAndRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!otpCode) {
            toast.error("Vui lòng nhập mã OTP.");
            return;
        }

        setIsVerifyingOtp(true);
        try {
            await verifyRegistrationOtp({ email: form.email, otpCode });
            toast.success("Xác thực OTP thành công! Đang tạo tài khoản...");
        } catch (error: any) {
            const message = error.response?.data?.message || error.message;
            if (error.response?.status === 400) {
                toast.error("Mã OTP không chính xác hoặc đã hết hạn.");
            } else if (message) {
                toast.error(message);
            } else {
                toast.error("Xác thực OTP thất bại. Vui lòng thử lại.");
            }
            setIsVerifyingOtp(false);
            return;
        }
        setIsVerifyingOtp(false);

        // OTP verified → proceed to register
        setIsSubmitting(true);
        try {
            const res = await register({
                email: form.email,
                password: form.password,
                confirmPassword: form.confirmPassword,
                businessName: form.businessName,
                phoneNumber: form.phoneNumber,
                address: form.address,
            });
            if (res.code === 200) {
                toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
                nav.push("/auth");
            }
        } catch (error: any) {
            const message = error.response?.data?.message || error.message;
            toast.error(message || "Đăng ký thất bại. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── render ───────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#FDC5F5] via-[#B388EB] to-[#72DDF7] p-4">

            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden max-w-6xl w-full">

                <MascotPanel
                    title="COUPLE MOOD"
                    subtitle="Quản lý địa điểm – Tạo nên khoảnh khắc cho các cặp đôi"
                />

                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 sm:p-8 w-full md:w-1/2">

                    <h1 className="text-3xl font-bold text-[#8093F1] mb-2">
                        Tạo tài khoản mới
                    </h1>
                    <p className="text-gray-500 mb-6">
                        Đăng ký tài khoản cho doanh nghiệp của bạn
                    </p>

                    {/* ── STEP 1: Registration form ── */}
                    <form onSubmit={handleSendOtp} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium">Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="example@email.com"
                                value={form.email}
                                onChange={handleChange}
                                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-[#B388EB]"}`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Tên Doanh Nghiệp</label>
                            <input
                                name="businessName"
                                placeholder="Tên doanh nghiệp của bạn"
                                value={form.businessName}
                                onChange={handleChange}
                                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ${errors.businessName ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-[#B388EB]"}`}
                            />
                            {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Số Điện Thoại</label>
                            <input
                                name="phoneNumber"
                                placeholder="0123456789"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ${errors.phoneNumber ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-[#B388EB]"}`}
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium">Địa Chỉ</label>
                            <input
                                name="address"
                                placeholder="Địa chỉ doanh nghiệp của bạn"
                                value={form.address}
                                onChange={handleChange}
                                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ${errors.address ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-[#B388EB]"}`}
                            />
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Mật khẩu</label>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-[#B388EB]"}`}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Xác nhận mật khẩu</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ${errors.confirmPassword ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-[#B388EB]"}`}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <div className="md:col-span-2 mt-2">
                            <button
                                type="submit"
                                disabled={isSendingOtp}
                                className="w-full py-3 rounded-xl font-semibold text-white bg-linear-to-r from-pink-400 via-purple-400 to-blue-400 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSendingOtp ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Đang gửi OTP...
                                    </>
                                ) : (
                                    "Tiếp tục"
                                )}
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

            {/* ── OTP Modal ── */}
            {step === "otp" && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !isVerifyingOtp && !isSubmitting) {
                            setStep("form");
                        }
                    }}
                >
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">

                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Xác thực email</h2>
                                    <p className="text-purple-100 text-sm mt-1">
                                        Nhập mã OTP đã gửi đến email của bạn
                                    </p>
                                </div>
                                <button
                                    onClick={() => setStep("form")}
                                    disabled={isVerifyingOtp || isSubmitting}
                                    className="p-2 hover:bg-white/20 cursor-pointer rounded-xl transition-all duration-200 text-white disabled:opacity-50"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleVerifyAndRegister} className="p-6 space-y-6">

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={form.email}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mã OTP <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-gray-300 text-center text-2xl font-bold tracking-widest"
                                        placeholder="000000"
                                        required
                                        maxLength={6}
                                        disabled={isVerifyingOtp || isSubmitting}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-gray-500">Nhập mã 6 số từ email</p>
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={isSendingOtp || isVerifyingOtp || isSubmitting}
                                        className="text-xs cursor-pointer text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                                    >
                                        {isSendingOtp ? "Đang gửi..." : "Gửi lại OTP"}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep("form")}
                                    disabled={isVerifyingOtp || isSubmitting}
                                    className="flex-1 px-6 py-3 border-2 cursor-pointer border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50"
                                >
                                    Quay lại
                                </button>
                                <button
                                    type="submit"
                                    disabled={isVerifyingOtp || isSubmitting}
                                    className="flex-1 px-6 py-3 cursor-pointer bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    {isVerifyingOtp ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Đang xác thực...
                                        </>
                                    ) : isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Đang tạo tài khoản...
                                        </>
                                    ) : (
                                        <>
                                            <KeyRound className="w-5 h-5" />
                                            Xác thực & Đăng ký
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
