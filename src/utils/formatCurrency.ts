export const formatCurrency = (value: number) => {
  if (!value) return "0 đ";
  return value.toLocaleString("vi-VN") + " đ";
};