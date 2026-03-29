'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '@/api/auth/type';
import { uploadImage } from '@/api/upload';
import { updatePassword } from '@/api/auth/api';
import { toast } from 'sonner';
import { updateVenueOwnerProfile } from '@/api/venue/profile/api';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdate: () => Promise<void> | void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  userProfile,
  onUpdate,
}: EditProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const [formData, setFormData] = useState({
    businessName: userProfile.venueOwnerProfile?.businessName || '',
    phoneNumber: userProfile.venueOwnerProfile?.phoneNumber || '',
    email: userProfile.venueOwnerProfile?.email || '',
    citizenIdFrontUrl: userProfile.venueOwnerProfile?.citizenIdFrontUrl || '',
    citizenIdBackUrl: userProfile.venueOwnerProfile?.citizenIdBackUrl || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  const [frontPreview, setFrontPreview] = useState<string>(
    userProfile.venueOwnerProfile?.citizenIdFrontUrl || ''
  );
  const [backPreview, setBackPreview] = useState<string>(
    userProfile.venueOwnerProfile?.citizenIdBackUrl || ''
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab('profile');

      setFormData({
        businessName: userProfile.venueOwnerProfile?.businessName || '',
        phoneNumber: userProfile.venueOwnerProfile?.phoneNumber || '',
        email: userProfile.venueOwnerProfile?.email || '',
        citizenIdFrontUrl: userProfile.venueOwnerProfile?.citizenIdFrontUrl || '',
        citizenIdBackUrl: userProfile.venueOwnerProfile?.citizenIdBackUrl || '',
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setFrontPreview(userProfile.venueOwnerProfile?.citizenIdFrontUrl || '');
      setBackPreview(userProfile.venueOwnerProfile?.citizenIdBackUrl || '');
      setFrontFile(null);
      setBackFile(null);
      setError('');
    }
  }, [isOpen, userProfile]);

  const handleFrontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFrontFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFrontPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBackFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setBackPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validateProfileForm = () => {
    if (!userProfile.venueOwnerProfile) {
      return 'Tài khoản của bạn chưa có thông tin venue owner.';
    }

    if (!formData.businessName.trim()) {
      return 'Tên doanh nghiệp không được để trống.';
    }

    if (!formData.phoneNumber.trim()) {
      return 'Số điện thoại không được để trống.';
    }

    if (!formData.email.trim()) {
      return 'Email không được để trống.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Email không đúng định dạng.';
    }

    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateProfileForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let citizenIdFrontUrl = formData.citizenIdFrontUrl;
      let citizenIdBackUrl = formData.citizenIdBackUrl;

      if (frontFile) {
        citizenIdFrontUrl = await uploadImage(frontFile);
      }

      if (backFile) {
        citizenIdBackUrl = await uploadImage(backFile);
      }

      await updateVenueOwnerProfile({
        businessName: formData.businessName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        citizenIdFrontUrl,
        citizenIdBackUrl,
      });

      await onUpdate();
      toast.success('Cập nhật hồ sơ thành công!');
      onClose();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Có lỗi xảy ra khi cập nhật profile. Vui lòng thử lại.';

      setError(message);
      toast.error(message);
      console.error('Update venue owner profile error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (passwordData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      setIsSubmitting(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      setIsSubmitting(false);
      return;
    }

    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      toast.success('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      onClose();
    } catch (err: any) {
      console.error('Change password error:', err);

      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;

      if (status === 400) {
        if (message?.toLowerCase().includes('current password')) {
          setError('Mật khẩu hiện tại không chính xác.');
          toast.error('Mật khẩu hiện tại không chính xác.');
        } else if (message?.toLowerCase().includes('password')) {
          setError(message);
          toast.error(message);
        } else {
          setError('Thông tin không hợp lệ. Vui lòng kiểm tra lại.');
          toast.error('Thông tin không hợp lệ. Vui lòng kiểm tra lại.');
        }
      } else if (status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (message) {
        setError(message);
        toast.error(message);
      } else {
        setError('Đổi mật khẩu thất bại. Vui lòng thử lại.');
        toast.error('Đổi mật khẩu thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden animate-slideUp">
        <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {activeTab === 'profile' ? 'Chỉnh sửa hồ sơ' : 'Đổi mật khẩu'}
              </h2>
              <p className="text-purple-100 text-sm mt-1">
                {activeTab === 'profile'
                  ? 'Cập nhật thông tin venue owner của bạn'
                  : 'Thay đổi mật khẩu đăng nhập'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 text-white"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
        </div>

        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'profile'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            disabled={isSubmitting}
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'password'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            disabled={isSubmitting}
          >
            <Lock className="w-4 h-4" />
            Đổi mật khẩu
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[calc(95vh-280px)]">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {!userProfile.venueOwnerProfile ? (
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-xl">
                  <p className="text-sm text-yellow-700 font-medium">
                    Tài khoản của bạn chưa có venue owner profile để chỉnh sửa.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tên doanh nghiệp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) =>
                          setFormData({ ...formData, businessName: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-gray-300"
                        placeholder="Nhập tên doanh nghiệp"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-gray-300"
                        placeholder="0123456789"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-gray-300"
                        placeholder="example@email.com"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                      <h3 className="text-lg font-bold text-gray-800">
                        CCCD / CMND
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Mặt trước <span className="text-red-500">*</span>
                        </label>

                        <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                          <Upload className="w-5 h-5 text-purple-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Chọn ảnh mặt trước
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFrontFileChange}
                            className="hidden"
                            disabled={isSubmitting}
                          />
                        </label>

                        {frontPreview && (
                          <img
                            src={frontPreview}
                            alt="CCCD mặt trước"
                            className="mt-3 h-44 w-full object-cover rounded-2xl border border-gray-200 shadow-sm"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Mặt sau <span className="text-red-500">*</span>
                        </label>

                        <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                          <Upload className="w-5 h-5 text-purple-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Chọn ảnh mặt sau
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBackFileChange}
                            className="hidden"
                            disabled={isSubmitting}
                          />
                        </label>

                        {backPreview && (
                          <img
                            src={backPreview}
                            alt="CCCD mặt sau"
                            className="mt-3 h-44 w-full object-cover rounded-2xl border border-gray-200 shadow-sm"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu hiện tại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-gray-300"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        current: !showPasswords.current,
                      })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-gray-300"
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    required
                    minLength={6}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        new: !showPasswords.new,
                      })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Mật khẩu phải có ít nhất 6 ký tự
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-gray-300"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        confirm: !showPasswords.confirm,
                      })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-white hover:border-gray-400 transition-all duration-200"
            disabled={isSubmitting}
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            onClick={activeTab === 'profile' ? handleSubmit : handleChangePassword}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            disabled={isSubmitting || (activeTab === 'profile' && !userProfile.venueOwnerProfile)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {activeTab === 'profile' ? 'Đang lưu...' : 'Đang đổi mật khẩu...'}
              </>
            ) : activeTab === 'profile' ? (
              'Lưu thay đổi'
            ) : (
              'Đổi mật khẩu'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}