// Type nhận về khi gọi BE lấy info QR code (kiểu transaction detail mà có mỗi qr còn mấy kia tự truyền vô)
export interface PaymentQrInfo {
  transactionId: number;
  qrCodeUrl: string;
  amount: number;
  paymentContent: string;
  expireAt: string;

  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

