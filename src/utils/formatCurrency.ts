/**
 * Format tiền VND với nhiều options
 */
export const formatCurrency = (
  value: number | null | undefined,
  options?: {
    showSymbol?: boolean; // Hiển thị ký hiệu đ hay không (default: true)
    useShortSymbol?: boolean; // Dùng ₫ thay vì đ (default: false)
    showZero?: boolean; // Hiển thị "0 đ" hay "-" khi value = 0 (default: true)
  }
): string => {
  const { showSymbol = true, useShortSymbol = false, showZero = true } = options || {};

  // Handle null/undefined
  if (value === null || value === undefined) {
    return showZero ? (showSymbol ? `0 ${useShortSymbol ? '₫' : 'đ'}` : '0') : '-';
  }

  // Handle 0
  if (value === 0) {
    return showZero ? (showSymbol ? `0 ${useShortSymbol ? '₫' : 'đ'}` : '0') : '-';
  }

  // Format number with Vietnamese locale
  const formatted = value.toLocaleString('vi-VN');

  // Add symbol if needed
  if (showSymbol) {
    return `${formatted} ${useShortSymbol ? '₫' : 'đ'}`;
  }

  return formatted;
};

/**
 * Format tiền VND với ký hiệu VND (cho API responses)
 */
export const formatCurrencyVND = (value: number | null | undefined): string => {
  if (value === null || value === undefined || value === 0) {
    return '0 VND';
  }
  return `${value.toLocaleString('vi-VN')} VND`;
};

/**
 * Format tiền VND ngắn gọn (dùng ₫)
 */
export const formatCurrencyShort = (value: number | null | undefined): string => {
  return formatCurrency(value, { useShortSymbol: true });
};

/**
 * Parse string tiền VND về number
 * Ví dụ: "1.000.000 đ" -> 1000000
 */
export const parseCurrency = (value: string): number => {
  return parseInt(value.replace(/[^\d]/g, '')) || 0;
};

export const formatCurrencyInput = (value: string) => {
  if (!value) return "";
  const number = value.replace(/\D/g, "");
  return Number(number).toLocaleString("vi-VN");
};
