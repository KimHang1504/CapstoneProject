/**
 * Helper functions để redirect đến trang payment success/failure
 * Sử dụng: redirectToPaymentSuccess({ ... }) hoặc redirectToPaymentFailure({ ... })
 */

type PaymentSuccessParams = {
  title?: string;
  message?: string;
  amount?: number;
  orderId?: string;
  redirectUrl?: string;
};

type PaymentFailureParams = {
  title?: string;
  message?: string;
  errorCode?: string;
  orderId?: string;
  retryUrl?: string;
  homeUrl?: string;
};

export const buildPaymentSuccessUrl = (params: PaymentSuccessParams): string => {
  const searchParams = new URLSearchParams();
  
  if (params.title) searchParams.set('title', params.title);
  if (params.message) searchParams.set('message', params.message);
  if (params.amount) searchParams.set('amount', params.amount.toString());
  if (params.orderId) searchParams.set('orderId', params.orderId);
  if (params.redirectUrl) searchParams.set('redirect', params.redirectUrl);
  
  return `/payment/success?${searchParams.toString()}`;
};

export const buildPaymentFailureUrl = (params: PaymentFailureParams): string => {
  const searchParams = new URLSearchParams();
  
  if (params.title) searchParams.set('title', params.title);
  if (params.message) searchParams.set('message', params.message);
  if (params.errorCode) searchParams.set('errorCode', params.errorCode);
  if (params.orderId) searchParams.set('orderId', params.orderId);
  if (params.retryUrl) searchParams.set('retry', params.retryUrl);
  if (params.homeUrl) searchParams.set('home', params.homeUrl);
  
  return `/payment/failure?${searchParams.toString()}`;
};

// Convenience functions for router.push
export const redirectToPaymentSuccess = (params: PaymentSuccessParams) => {
  return buildPaymentSuccessUrl(params);
};

export const redirectToPaymentFailure = (params: PaymentFailureParams) => {
  return buildPaymentFailureUrl(params);
};
