/**
 * Format số điện thoại Việt Nam theo định dạng 3-4-3
 * Ví dụ: 0334455333 -> 033 4455 333
 * @param phone - Số điện thoại cần format
 * @returns Số điện thoại đã được format hoặc giá trị gốc nếu không hợp lệ
 */
export const formatVietnamPhone = (phone: string | null | undefined): string => {
  if (!phone) return "-";

  // Bỏ hết ký tự không phải số
  const digits = phone.replace(/\D/g, "");

  // Format theo nhóm 3-4-3 (VN mobile phổ biến 10 số)
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }

  // Format theo nhóm 3-4-4 (VN mobile 11 số, ví dụ: +84)
  if (digits.length === 11) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }

  // Trả về số gốc nếu không match format
  return phone;
};

/**
 * Loại bỏ format và chỉ giữ lại số
 * Ví dụ: 033 4455 333 -> 0334455333
 * @param phone - Số điện thoại đã format
 * @returns Số điện thoại chỉ có chữ số
 */
export const unformatPhone = (phone: string): string => {
  return phone.replace(/\D/g, "");
};

/**
 * Validate số điện thoại Việt Nam
 * @param phone - Số điện thoại cần validate
 * @returns true nếu hợp lệ, false nếu không hợp lệ
 */
export const isValidVietnamPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, "");
  // Số điện thoại VN: bắt đầu bằng 0 hoặc +84, có 10-11 số
  return /^(0|\+?84)[0-9]{9,10}$/.test(digits);
};
