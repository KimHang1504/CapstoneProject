"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import MascotPanel from "./components/mascot_panel";
import { login, loginWithGoogle, forgotPassword, verifyOtp, resetPassword } from "@/api/auth/api";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/utils/jwt";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { X, Mail, Loader2, KeyRound, Lock, EyeOff, Eye } from "lucide-react";

export default function LoginPage() {
    const nav = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const rememberMe = true;

    const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isResettingPassword, setIsResettingPassword] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate input
        if (!email || !password) {
            toast.error("Vui lòng nhập đầy đủ email và mật khẩu.");
            return;
        }

        const payload = { email, password, rememberMe };
        toast.loading("Đang đăng nhập...", { id: "login-loading" });

        try {
            const res = await login(payload);
            const token = res.data.accessToken;

            const user = getUserFromToken(token);
            const role = user.role;

            if (role === "MEMBER") {
                toast.dismiss("login-loading");
                toast.error("Tài khoản MEMBER không được phép đăng nhập vào hệ thống quản lý.");
                return;
            }

            apiClient.setAuthToken(token);
            document.cookie = `accessToken=${res.data.accessToken}; path=/; max-age=36000;Secure`;
            window.dispatchEvent(new Event('login'));

            toast.dismiss("login-loading");
            toast.success(`Đăng nhập thành công! Chào mừng ${user.name || 'bạn'}.`);

            if (role === "ADMIN") {
                nav.push("/admin");
            } else if (role === "VENUEOWNER") {
                nav.push("/venue/dashboard");
            } else if (role === "STAFF") {
                nav.push("/venue/redeem");
            }

        } catch (error: any) {
            toast.dismiss("login-loading");
            console.error("Error occurred while logging in:", error);

            // Handle specific error cases
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;

            if (status === 401 || message?.toLowerCase().includes("invalid email or password")) {
                toast.error("Email hoặc mật khẩu không chính xác.");
            } else if (status === 403) {
                toast.error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
            } else if (status === 404) {
                toast.error("Tài khoản không tồn tại.");
            } else if (message) {
                toast.error(message);
            } else {
                toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin và thử lại.");
            }
        }
    };

    const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
        const idToken = credentialResponse.credential;

        if (!idToken) {
            toast.error("Không lấy được Google ID token. Vui lòng thử lại.");
            return;
        }

        toast.loading("Đang đăng nhập với Google...", { id: "google-login-loading" });

        try {
            const res = await loginWithGoogle({ idToken });
            const token = res.data.accessToken;

            const user = getUserFromToken(token);
            const role = user.role;

            if (role === "MEMBER") {
                toast.dismiss("google-login-loading");
                toast.error("Tài khoản MEMBER không được phép đăng nhập bằng Google vào hệ thống quản lý.");
                return;
            }

            apiClient.setAuthToken(token);
            document.cookie = `accessToken=${res.data.accessToken}; path=/; max-age=36000;Secure`;
            window.dispatchEvent(new Event('login'));

            toast.dismiss("google-login-loading");
            toast.success(`Đăng nhập Google thành công! Chào mừng ${user.name || 'bạn'}.`);

            if (role === "ADMIN") {
                nav.push("/admin");
            } else if (role === "VENUEOWNER") {
                nav.push("/venue/dashboard");
            } else if (role === "STAFF") {
                nav.push(`/staff/redeem?locationId=${user.assignedVenueLocationId}`);
            }
        } catch (error: any) {
            toast.dismiss("google-login-loading");
            console.error("Error occurred while logging in with Google:", error);

            // Handle specific error cases
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;

            if (status === 401) {
                toast.error("Xác thực Google thất bại. Vui lòng thử lại.");
            } else if (status === 403) {
                toast.error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
            } else if (status === 404) {
                toast.error("Tài khoản Google chưa được đăng ký trong hệ thống.");
            } else if (message) {
                toast.error(message);
            } else {
                toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
            }
        }
    };

    const handleGoogleError = () => {
        toast.error("Google login bị hủy hoặc xảy ra lỗi.");
    };

    const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!forgotPasswordEmail) {
            toast.error("Vui lòng nhập email.");
            return;
        }

        setIsSendingEmail(true);

        try {
            await forgotPassword({ email: forgotPasswordEmail });
            toast.success("Mã OTP đã được gửi đến email của bạn!");
            setForgotPasswordModalOpen(false);
            setOtpModalOpen(true);
            setOtpCode("");
        } catch (error: any) {
            console.error("Forgot password error:", error);
            const message = error.response?.data?.message || error.message;

            if (error.response?.status === 404) {
                toast.error("Email không tồn tại trong hệ thống.");
            } else if (message) {
                toast.error(message);
            } else {
                toast.error("Gửi email thất bại. Vui lòng thử lại.");
            }
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!otpCode) {
            toast.error("Vui lòng nhập mã OTP.");
            return;
        }

        setIsVerifyingOtp(true);

        try {
            await verifyOtp({
                email: forgotPasswordEmail,
                otpCode: otpCode
            });
            toast.success("Xác thực OTP thành công! Vui lòng đặt lại mật khẩu.");
            setOtpVerified(true);
        } catch (error: any) {
            console.error("Verify OTP error:", error);
            const message = error.response?.data?.message || error.message;

            if (error.response?.status === 400) {
                toast.error("Mã OTP không chính xác hoặc đã hết hạn.");
            } else if (message) {
                toast.error(message);
            } else {
                toast.error("Xác thực OTP thất bại. Vui lòng thử lại.");
            }
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.error("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp.");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        setIsResettingPassword(true);

        try {
            await resetPassword({
                email: forgotPasswordEmail,
                otpCode: otpCode,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            });
            toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
            setOtpModalOpen(false);
            setOtpCode("");
            setForgotPasswordEmail("");
            setOtpVerified(false);
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            console.error("Reset password error:", error);
            const message = error.response?.data?.message || error.message;

            if (error.response?.status === 400) {
                toast.error("Yêu cầu không hợp lệ. Vui lòng thử lại.");
            } else if (message) {
                toast.error(message);
            } else {
                toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
            }
        } finally {
            setIsResettingPassword(false);
        }
    };

    const handleResendOtp = async () => {
        setIsSendingEmail(true);

        try {
            await forgotPassword({ email: forgotPasswordEmail });
            toast.success("Mã OTP mới đã được gửi đến email của bạn!");
        } catch (error: any) {
            console.error("Resend OTP error:", error);
            toast.error("Gửi lại mã OTP thất bại. Vui lòng thử lại.");
        } finally {
            setIsSendingEmail(false);
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
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setForgotPasswordModalOpen(true);
                                        setForgotPasswordEmail(email);
                                    }}
                                    className="text-sm cursor-pointer text-[#8093F1] hover:text-[#6b7dd4] font-medium transition-colors"
                                >
                                    Quên mật khẩu?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu của bạn"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#B388EB]"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
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

                    <div className="w-full flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={handleGoogleError}
                            text="continue_with"
                            shape="pill"
                            size="large"
                            width="320"
                        />
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Chưa có tài khoản?
                        <Link href="/auth/register" className="text-[#8093F1] font-medium cursor-pointer ml-1">
                            Đăng ký
                        </Link>
                    </p>

                </div>

            </div>

            {/* Forgot Password Modal */}
            {forgotPasswordModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !isSendingEmail) {
                            setForgotPasswordModalOpen(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Quên mật khẩu</h2>
                                    <p className="text-purple-100 text-sm mt-1">Nhập email để khôi phục mật khẩu</p>
                                </div>
                                <button
                                    onClick={() => setForgotPasswordModalOpen(false)}
                                    className="p-2 hover:bg-white/20 cursor-pointer rounded-xl transition-all duration-200 text-white"
                                    disabled={isSendingEmail}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleForgotPassword} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={forgotPasswordEmail}
                                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-gray-300"
                                        placeholder="Nhập email của bạn"
                                        required
                                        disabled={isSendingEmail}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Chúng tôi sẽ gửi mã OTP đến email này
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setForgotPasswordModalOpen(false)}
                                    className="flex-1 px-6 py-3 border-2 cursor-pointer border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                    disabled={isSendingEmail}
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 cursor-pointer bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                    disabled={isSendingEmail}
                                >
                                    {isSendingEmail ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-5 h-5" />
                                            Gửi email
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Verify OTP Modal */}
            {otpModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !isVerifyingOtp && !isResettingPassword) {
                            setOtpModalOpen(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {otpVerified ? "Đặt lại mật khẩu" : "Xác thực OTP"}
                                    </h2>
                                    <p className="text-purple-100 text-sm mt-1">
                                        {otpVerified ? "Nhập mật khẩu mới của bạn" : "Nhập mã OTP đã gửi đến email"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setOtpModalOpen(false);
                                        setOtpVerified(false);
                                        setNewPassword("");
                                        setConfirmPassword("");
                                    }}
                                    className="p-2 hover:bg-white/20 cursor-pointer rounded-xl transition-all duration-200 text-white"
                                    disabled={isVerifyingOtp || isResettingPassword}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                        </div>

                        {/* OTP Verification Form */}
                        {!otpVerified && (
                            <form onSubmit={handleVerifyOtp} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={forgotPasswordEmail}
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
                                            disabled={isVerifyingOtp}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-xs text-gray-500">
                                            Nhập mã 6 số từ email
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={isSendingEmail || isVerifyingOtp}
                                            className="text-xs cursor-pointer text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                                        >
                                            {isSendingEmail ? "Đang gửi..." : "Gửi lại OTP"}
                                        </button>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOtpModalOpen(false);
                                            setForgotPasswordModalOpen(true);
                                        }}
                                        className="flex-1 px-6 py-3 border-2 cursor-pointer border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                        disabled={isVerifyingOtp}
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 cursor-pointer bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                        disabled={isVerifyingOtp}
                                    >
                                        {isVerifyingOtp ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Đang xác thực...
                                            </>
                                        ) : (
                                            <>
                                                <KeyRound className="w-5 h-5" />
                                                Xác thực
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Reset Password Form */}
                        {otpVerified && (
                            <form onSubmit={handleResetPassword} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={forgotPasswordEmail}
                                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mật khẩu mới <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Nhập mật khẩu mới"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Mật khẩu phải có ít nhất 6 ký tự
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Xác nhận mật khẩu <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Nhập lại mật khẩu mới"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOtpVerified(false);
                                            setNewPassword("");
                                            setConfirmPassword("");
                                        }}
                                        className="flex-1 px-6 py-3 border-2 cursor-pointer border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                                        disabled={isResettingPassword}
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 cursor-pointer bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                        disabled={isResettingPassword}
                                    >
                                        {isResettingPassword ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Đang đặt lại...
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-5 h-5" />
                                                Đặt lại mật khẩu
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}