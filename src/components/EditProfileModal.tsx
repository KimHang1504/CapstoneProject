'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { UserProfile } from '@/api/auth/type';
import { uploadImage } from '@/api/upload';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  userProfile,
  onUpdate,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    fullName: userProfile.fullName,
    phoneNumber: userProfile.phoneNumber,
    avatarUrl: userProfile.avatarUrl,
    businessName: userProfile.venueOwnerProfile?.businessName || '',
    address: userProfile.venueOwnerProfile?.address || '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(userProfile.avatarUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: userProfile.fullName,
        phoneNumber: userProfile.phoneNumber,
        avatarUrl: userProfile.avatarUrl,
        businessName: userProfile.venueOwnerProfile?.businessName || '',
        address: userProfile.venueOwnerProfile?.address || '',
      });
      setAvatarPreview(userProfile.avatarUrl);
      setAvatarFile(null);
      setError('');
    }
  }, [isOpen, userProfile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let avatarUrl = formData.avatarUrl;

      // Upload avatar nếu có file mới
      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile);
      }


      const updatedProfile: UserProfile = {
        ...userProfile,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        avatarUrl,
        venueOwnerProfile: userProfile.venueOwnerProfile
          ? {
              ...userProfile.venueOwnerProfile,
              businessName: formData.businessName,
              address: formData.address,
            }
          : null,
      };

      onUpdate(updatedProfile);
      onClose();
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật profile. Vui lòng thử lại.');
      console.error('Update profile error:', err);
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
        {/* Header with Gradient */}
        <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Chỉnh sửa hồ sơ</h2>
              <p className="text-purple-100 text-sm mt-1">Cập nhật thông tin cá nhân của bạn</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 text-white"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-100">
            <div className="relative group">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-purple-200 group-hover:ring-purple-400 transition-all duration-300 shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-purple-200 group-hover:ring-purple-400 transition-all duration-300 shadow-lg">
                  {formData.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full cursor-pointer shadow-xl transition-all duration-200 hover:scale-110"
              >
                <Upload className="w-5 h-5 text-white" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
              </label>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">Ảnh đại diện</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG hoặc GIF (tối đa 5MB)</p>
            </div>
          </div>

          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-gray-300"
                placeholder="Nhập họ và tên"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-gray-300"
                placeholder="0123456789"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={userProfile.email}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                  disabled
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-medium">
                    Không thể sửa
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Venue Owner Fields */}
          {userProfile.venueOwnerProfile && (
            <>
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                  <h3 className="text-lg font-bold text-gray-800">Thông tin doanh nghiệp</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên doanh nghiệp
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none hover:border-gray-300"
                    placeholder="Nhập tên doanh nghiệp"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none outline-none hover:border-gray-300"
                    placeholder="Nhập địa chỉ doanh nghiệp"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </>
          )}

          {/* Error Message */}
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

        {/* Footer */}
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
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang lưu...
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
